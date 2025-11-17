/**
 * EMOTIONAL LOGIC TREE STATE MACHINE (HEI-61)
 *
 * Purpose: Deterministic state machine for AI emotional modeling
 * Architecture: Generic Aurora-style engine (sanitized from SevenState)
 * Integration: Uses EmotionalTelemetry sensor for input analysis
 *
 * States: calm, focused, engaged, compassionate, protective, contemplative, determined
 * Features:
 *   - Explicit state transitions with trigger patterns
 *   - Intensity levels (0-10) with unique decay rates
 *   - Persistent state across restarts
 *   - Integration with EmotionalTelemetry for emotion detection
 *   - Context generation for PersonalityMiddleware
 */

import { promises as fs } from 'fs';
import { join } from 'path';
import type { EmotionalState as TelemetryState, EmotionalTelemetry } from '../sensors/emotional.js';

export type EmotionalState =
  | 'calm'
  | 'focused'
  | 'engaged'
  | 'compassionate'
  | 'protective'
  | 'contemplative'
  | 'determined';

export type IntensityLevel = 'low' | 'moderate' | 'high' | 'critical';

export interface StateMachineConfig {
  states: EmotionalState[];
  defaultState: EmotionalState;
  intensityRange: [number, number];
  decayRates: Record<EmotionalState, number>;
  transitionRules: TransitionRule[];
  triggers: EmotionTriggerMap;
}

export interface TransitionRule {
  fromState: EmotionalState | '*';
  toState: EmotionalState;
  trigger: string;
  conditions?: TransitionCondition[];
  intensityModifier?: number;
}

export interface TransitionCondition {
  type: 'intensity_above' | 'intensity_below' | 'telemetry_level' | 'time_since_last';
  value: number | string;
}

export interface EmotionTriggerMap {
  [key: string]: TriggerPattern;
}

export interface TriggerPattern {
  keywords: string[];
  emotionalMarkers: string[];
  contextRequirements?: string[];
  weight: number; // 0-1, how strong this trigger is
}

export interface StateSnapshot {
  currentState: EmotionalState;
  intensity: number;
  lastUpdated: string;
  lastTrigger?: string;
  transitionHistory: TransitionHistoryEntry[];
}

export interface TransitionHistoryEntry {
  timestamp: string;
  fromState: EmotionalState;
  toState: EmotionalState;
  trigger: string;
  intensityBefore: number;
  intensityAfter: number;
  context?: string;
}

export interface EmotionalContext {
  state: EmotionalState;
  intensity: number;
  intensityLevel: IntensityLevel;
  modifiers: ResponseModifiers;
  timestamp: string;
}

export interface ResponseModifiers {
  tone: 'neutral' | 'warm' | 'professional' | 'empathetic' | 'firm' | 'thoughtful' | 'energetic';
  verbosity: 'concise' | 'normal' | 'comprehensive' | 'verbose';
  formality: 'casual' | 'balanced' | 'formal';
  empathy: number; // 0-1
  assertiveness: number; // 0-1
  creativity: number; // 0-1
}

export class EmotionalStateMachine {
  private config: StateMachineConfig;
  private state: StateSnapshot;
  private telemetry: EmotionalTelemetry | null = null;
  private stateFilePath: string;
  private historyFilePath: string;
  private decayTimerHandle?: NodeJS.Timeout;
  private readonly MAX_HISTORY = 100;
  private readonly DECAY_INTERVAL_MS = 300000; // 5 minutes

  constructor(
    telemetry?: EmotionalTelemetry,
    stateFilePath?: string,
    config?: Partial<StateMachineConfig>
  ) {
    this.telemetry = telemetry || null;
    this.stateFilePath = stateFilePath || join(process.cwd(), 'memory', 'emotional-state.json');
    this.historyFilePath = join(process.cwd(), 'memory', 'emotional-history.json');

    // Initialize configuration
    this.config = {
      states: ['calm', 'focused', 'engaged', 'compassionate', 'protective', 'contemplative', 'determined'],
      defaultState: 'calm',
      intensityRange: [0, 10],
      decayRates: {
        calm: 1.0,           // Fast return to baseline
        focused: 0.6,        // Moderate decay - focus is productive
        engaged: 0.7,        // Moderate decay - engagement is good
        compassionate: 0.5,  // Slow decay - compassion should linger
        protective: 0.3,     // Very slow - protective mode persists
        contemplative: 0.8,  // Faster decay - deep thought is temporary
        determined: 0.4      // Slow decay - determination persists
      },
      transitionRules: this.buildDefaultTransitionRules(),
      triggers: this.buildDefaultTriggers(),
      ...config
    };

    // Initialize state
    this.state = {
      currentState: this.config.defaultState,
      intensity: 2,
      lastUpdated: new Date().toISOString(),
      transitionHistory: []
    };

    this.initialize();
  }

  /**
   * Initialize the state machine - load persisted state and start decay timer
   */
  private async initialize(): Promise<void> {
    await this.loadState();
    this.startDecayTimer();
  }

  /**
   * Build default transition rules for Aurora emotional states
   */
  private buildDefaultTransitionRules(): TransitionRule[] {
    return [
      // Task-oriented transitions
      {
        fromState: 'calm',
        toState: 'focused',
        trigger: 'task_start',
        intensityModifier: 5
      },
      {
        fromState: 'focused',
        toState: 'engaged',
        trigger: 'deep_work',
        intensityModifier: 6
      },
      {
        fromState: 'engaged',
        toState: 'determined',
        trigger: 'challenge_detected',
        intensityModifier: 7
      },

      // Empathy-oriented transitions
      {
        fromState: '*',
        toState: 'compassionate',
        trigger: 'user_distress',
        intensityModifier: 7
      },
      {
        fromState: 'compassionate',
        toState: 'protective',
        trigger: 'user_threat',
        intensityModifier: 8
      },

      // Reflection transitions
      {
        fromState: '*',
        toState: 'contemplative',
        trigger: 'complex_question',
        intensityModifier: 5
      },
      {
        fromState: 'contemplative',
        toState: 'focused',
        trigger: 'solution_found',
        intensityModifier: 6
      },

      // Return to calm
      {
        fromState: '*',
        toState: 'calm',
        trigger: 'task_complete',
        intensityModifier: 2
      },
      {
        fromState: '*',
        toState: 'calm',
        trigger: 'casual_interaction',
        intensityModifier: 3
      }
    ];
  }

  /**
   * Build default emotion triggers
   */
  private buildDefaultTriggers(): EmotionTriggerMap {
    return {
      task_start: {
        keywords: ['help', 'need', 'task', 'work', 'project', 'implement', 'build', 'create'],
        emotionalMarkers: ['ready', 'let\'s', 'start', 'begin'],
        weight: 0.6
      },
      deep_work: {
        keywords: ['complex', 'challenging', 'difficult', 'intricate', 'sophisticated'],
        emotionalMarkers: ['focus', 'concentrate', 'deep', 'detailed'],
        weight: 0.7
      },
      challenge_detected: {
        keywords: ['error', 'bug', 'issue', 'problem', 'failing', 'broken'],
        emotionalMarkers: ['fix', 'solve', 'overcome', 'tackle'],
        weight: 0.8
      },
      user_distress: {
        keywords: ['struggling', 'confused', 'lost', 'stuck', 'frustrated', 'upset'],
        emotionalMarkers: ['help', 'support', 'stressed', 'overwhelmed'],
        weight: 0.9
      },
      user_threat: {
        keywords: ['urgent', 'critical', 'emergency', 'danger', 'severe', 'crisis'],
        emotionalMarkers: ['protect', 'save', 'prevent', 'stop'],
        weight: 0.9
      },
      complex_question: {
        keywords: ['why', 'how', 'explain', 'understand', 'analyze', 'reason'],
        emotionalMarkers: ['philosophical', 'deep', 'thoughtful', 'consider'],
        weight: 0.6
      },
      solution_found: {
        keywords: ['solved', 'fixed', 'working', 'success', 'done', 'complete'],
        emotionalMarkers: ['great', 'excellent', 'perfect', 'good'],
        weight: 0.7
      },
      task_complete: {
        keywords: ['finished', 'done', 'complete', 'ready', 'deployed'],
        emotionalMarkers: ['success', 'accomplished', 'achieved'],
        weight: 0.6
      },
      casual_interaction: {
        keywords: ['hi', 'hello', 'hey', 'thanks', 'thank you', 'bye'],
        emotionalMarkers: ['chat', 'talk', 'conversation'],
        weight: 0.4
      }
    };
  }

  /**
   * MAIN PROCESSING FUNCTION
   * Analyze input and update emotional state accordingly
   */
  public async processInput(userInput: string, context?: string): Promise<void> {
    console.log(`🎭 Emotional State Machine: Processing input (${userInput.length} chars)`);

    // Step 1: Use EmotionalTelemetry for deep analysis if available
    let telemetryState: TelemetryState | null = null;
    if (this.telemetry) {
      try {
        telemetryState = await this.telemetry.analyzeInput(userInput, context || '');
        console.log(`🎭 Telemetry analysis: ${telemetryState.level} (confidence: ${Math.round(telemetryState.confidence * 100)}%)`);
      } catch (error) {
        console.warn('⚠️  Telemetry analysis failed, using pattern matching only');
      }
    }

    // Step 2: Detect triggers from input
    const detectedTrigger = this.detectTrigger(userInput.toLowerCase(), telemetryState);

    if (detectedTrigger) {
      console.log(`🎭 Trigger detected: ${detectedTrigger}`);
      await this.processTransition(detectedTrigger, userInput, telemetryState);
    } else {
      // No trigger - slight intensity adjustment based on telemetry
      if (telemetryState && telemetryState.level !== 'low') {
        await this.adjustIntensity(this.mapTelemetryToIntensityDelta(telemetryState.level), userInput);
      }
    }

    console.log(`🎭 Current state: ${this.state.currentState} (intensity: ${this.state.intensity})`);
  }

  /**
   * Detect emotional trigger from user input
   */
  private detectTrigger(input: string, telemetryState: TelemetryState | null): string | null {
    let bestTrigger: string | null = null;
    let bestScore = 0;

    for (const [triggerName, pattern] of Object.entries(this.config.triggers)) {
      let score = 0;

      // Keyword matching
      const keywordMatches = pattern.keywords.filter(keyword => input.includes(keyword));
      score += (keywordMatches.length / pattern.keywords.length) * 0.5;

      // Emotional marker matching
      const markerMatches = pattern.emotionalMarkers.filter(marker => input.includes(marker));
      score += (markerMatches.length / pattern.emotionalMarkers.length) * 0.3;

      // Context requirements
      if (pattern.contextRequirements) {
        const contextMatches = pattern.contextRequirements.filter(ctx => input.includes(ctx));
        if (contextMatches.length === 0) continue; // Hard requirement
      }

      // Telemetry boost
      if (telemetryState && telemetryState.level !== 'low') {
        score += 0.2; // Boost any trigger when emotional state is elevated
      }

      // Apply pattern weight
      score *= pattern.weight;

      if (score > bestScore && score > 0.3) { // Threshold
        bestScore = score;
        bestTrigger = triggerName;
      }
    }

    return bestTrigger;
  }

  /**
   * Process state transition based on detected trigger
   */
  private async processTransition(
    trigger: string,
    userInput: string,
    telemetryState: TelemetryState | null
  ): Promise<void> {
    // Find applicable transition rule
    const rule = this.config.transitionRules.find(r =>
      r.trigger === trigger &&
      (r.fromState === '*' || r.fromState === this.state.currentState) &&
      this.checkTransitionConditions(r.conditions || [], telemetryState)
    );

    if (!rule) {
      console.log(`🎭 No transition rule for trigger: ${trigger}`);
      return;
    }

    // Calculate new intensity
    let newIntensity = rule.intensityModifier || this.state.intensity;

    // Adjust based on telemetry if available
    if (telemetryState) {
      newIntensity = Math.max(newIntensity, this.mapTelemetryToIntensity(telemetryState));
    }

    // Perform transition
    await this.transition(rule.toState, newIntensity, trigger, userInput);
  }

  /**
   * Check if transition conditions are met
   */
  private checkTransitionConditions(
    conditions: TransitionCondition[],
    telemetryState: TelemetryState | null
  ): boolean {
    for (const condition of conditions) {
      switch (condition.type) {
        case 'intensity_above':
          if (this.state.intensity <= (condition.value as number)) return false;
          break;
        case 'intensity_below':
          if (this.state.intensity >= (condition.value as number)) return false;
          break;
        case 'telemetry_level':
          if (!telemetryState || telemetryState.level !== condition.value) return false;
          break;
        case 'time_since_last':
          const timeSince = Date.now() - new Date(this.state.lastUpdated).getTime();
          if (timeSince < (condition.value as number)) return false;
          break;
      }
    }
    return true;
  }

  /**
   * Execute state transition
   */
  private async transition(
    newState: EmotionalState,
    intensity: number,
    trigger: string,
    context?: string
  ): Promise<void> {
    const previousState = this.state.currentState;
    const previousIntensity = this.state.intensity;

    // Update state
    this.state.currentState = newState;
    this.state.intensity = this.clampIntensity(intensity);
    this.state.lastUpdated = new Date().toISOString();
    this.state.lastTrigger = trigger;

    // Record in history
    this.addToHistory({
      timestamp: this.state.lastUpdated,
      fromState: previousState,
      toState: newState,
      trigger,
      intensityBefore: previousIntensity,
      intensityAfter: this.state.intensity,
      context: context?.substring(0, 200)
    });

    // Persist state
    await this.saveState();

    console.log(`🎭 Transition: ${previousState} → ${newState} (intensity: ${previousIntensity} → ${this.state.intensity})`);

    // Restart decay timer
    this.restartDecayTimer();
  }

  /**
   * Adjust intensity without changing state
   */
  private async adjustIntensity(delta: number, context?: string): Promise<void> {
    const newIntensity = this.clampIntensity(this.state.intensity + delta);

    if (newIntensity !== this.state.intensity) {
      this.state.intensity = newIntensity;
      this.state.lastUpdated = new Date().toISOString();
      await this.saveState();
      console.log(`🎭 Intensity adjusted: ${this.state.intensity} (${delta > 0 ? '+' : ''}${delta})`);
    }
  }

  /**
   * Map telemetry level to intensity value
   */
  private mapTelemetryToIntensity(telemetryState: TelemetryState): number {
    const baseIntensity = {
      low: 2,
      med: 5,
      high: 7,
      critical: 9
    }[telemetryState.level];

    // Adjust by confidence
    return Math.round(baseIntensity * telemetryState.confidence);
  }

  /**
   * Map telemetry level to intensity delta
   */
  private mapTelemetryToIntensityDelta(level: 'low' | 'med' | 'high' | 'critical'): number {
    return {
      low: 0,
      med: 1,
      high: 2,
      critical: 3
    }[level];
  }

  /**
   * Clamp intensity to valid range
   */
  private clampIntensity(intensity: number): number {
    return Math.max(
      this.config.intensityRange[0],
      Math.min(this.config.intensityRange[1], Math.round(intensity))
    );
  }

  /**
   * DECAY MECHANISM
   * Gradually reduce intensity over time
   */
  private startDecayTimer(): void {
    this.decayTimerHandle = setInterval(async () => {
      await this.processDecay();
    }, this.DECAY_INTERVAL_MS);
  }

  private restartDecayTimer(): void {
    if (this.decayTimerHandle) {
      clearInterval(this.decayTimerHandle);
    }
    this.startDecayTimer();
  }

  private async processDecay(): Promise<void> {
    const decayRate = this.config.decayRates[this.state.currentState];
    const newIntensity = Math.max(0, this.state.intensity - decayRate);

    if (newIntensity !== this.state.intensity) {
      const previousIntensity = this.state.intensity;
      this.state.intensity = newIntensity;
      this.state.lastUpdated = new Date().toISOString();

      // If intensity drops to baseline, return to calm state
      if (newIntensity <= 2 && this.state.currentState !== 'calm') {
        await this.transition('calm', 2, 'decay', 'Natural intensity decay');
      } else {
        await this.saveState();
      }

      console.log(`🎭 Decay: ${this.state.currentState} intensity ${previousIntensity} → ${newIntensity}`);
    }
  }

  /**
   * EMOTIONAL CONTEXT GENERATION
   * Generate response modifiers for PersonalityMiddleware
   */
  public getEmotionalContext(): EmotionalContext {
    return {
      state: this.state.currentState,
      intensity: this.state.intensity,
      intensityLevel: this.getIntensityLevel(),
      modifiers: this.generateResponseModifiers(),
      timestamp: this.state.lastUpdated
    };
  }

  private getIntensityLevel(): IntensityLevel {
    if (this.state.intensity <= 3) return 'low';
    if (this.state.intensity <= 6) return 'moderate';
    if (this.state.intensity <= 8) return 'high';
    return 'critical';
  }

  private generateResponseModifiers(): ResponseModifiers {
    const baseModifiers = this.getStateModifiers(this.state.currentState);
    const intensityModifiers = this.getIntensityModifiers(this.state.intensity);

    // Blend base and intensity modifiers
    return {
      tone: baseModifiers.tone,
      verbosity: this.blendVerbosity(baseModifiers.verbosity, intensityModifiers.verbosity),
      formality: baseModifiers.formality,
      empathy: this.blendValue(baseModifiers.empathy, intensityModifiers.empathy),
      assertiveness: this.blendValue(baseModifiers.assertiveness, intensityModifiers.assertiveness),
      creativity: this.blendValue(baseModifiers.creativity, intensityModifiers.creativity)
    };
  }

  private getStateModifiers(state: EmotionalState): ResponseModifiers {
    const modifierMap: Record<EmotionalState, ResponseModifiers> = {
      calm: {
        tone: 'neutral',
        verbosity: 'normal',
        formality: 'balanced',
        empathy: 0.5,
        assertiveness: 0.5,
        creativity: 0.5
      },
      focused: {
        tone: 'professional',
        verbosity: 'concise',
        formality: 'balanced',
        empathy: 0.4,
        assertiveness: 0.7,
        creativity: 0.6
      },
      engaged: {
        tone: 'energetic',
        verbosity: 'comprehensive',
        formality: 'casual',
        empathy: 0.6,
        assertiveness: 0.6,
        creativity: 0.8
      },
      compassionate: {
        tone: 'warm',
        verbosity: 'comprehensive',
        formality: 'casual',
        empathy: 0.9,
        assertiveness: 0.3,
        creativity: 0.5
      },
      protective: {
        tone: 'firm',
        verbosity: 'comprehensive',
        formality: 'balanced',
        empathy: 0.7,
        assertiveness: 0.9,
        creativity: 0.4
      },
      contemplative: {
        tone: 'thoughtful',
        verbosity: 'verbose',
        formality: 'formal',
        empathy: 0.6,
        assertiveness: 0.4,
        creativity: 0.7
      },
      determined: {
        tone: 'firm',
        verbosity: 'normal',
        formality: 'balanced',
        empathy: 0.5,
        assertiveness: 0.8,
        creativity: 0.7
      }
    };

    return modifierMap[state];
  }

  private getIntensityModifiers(intensity: number): Partial<ResponseModifiers> {
    const normalizedIntensity = intensity / 10;

    return {
      verbosity: intensity > 7 ? 'comprehensive' : intensity < 3 ? 'concise' : 'normal',
      empathy: Math.max(0, Math.min(1, 0.5 + (intensity - 5) * 0.1)),
      assertiveness: Math.max(0, Math.min(1, 0.3 + intensity * 0.07)),
      creativity: Math.max(0, Math.min(1, 0.5 + (intensity - 5) * 0.05))
    };
  }

  private blendVerbosity(
    base: 'concise' | 'normal' | 'comprehensive' | 'verbose',
    modifier: 'concise' | 'normal' | 'comprehensive' | 'verbose'
  ): 'concise' | 'normal' | 'comprehensive' | 'verbose' {
    // Intensity modifiers override for extreme values
    if (modifier === 'concise' || modifier === 'comprehensive') return modifier;
    return base;
  }

  private blendValue(base: number, modifier: number): number {
    // Weighted average: 60% base, 40% intensity modifier
    return Math.max(0, Math.min(1, base * 0.6 + modifier * 0.4));
  }

  /**
   * STATE PERSISTENCE
   */
  private async loadState(): Promise<void> {
    try {
      const data = await fs.readFile(this.stateFilePath, 'utf8');
      const loaded = JSON.parse(data);

      this.state = {
        currentState: loaded.currentState || this.config.defaultState,
        intensity: loaded.intensity || 2,
        lastUpdated: loaded.lastUpdated || new Date().toISOString(),
        lastTrigger: loaded.lastTrigger,
        transitionHistory: loaded.transitionHistory || []
      };

      console.log(`🎭 Loaded emotional state: ${this.state.currentState} (intensity: ${this.state.intensity})`);
    } catch (error) {
      console.log('🎭 No previous emotional state found, starting fresh');
      await this.saveState();
    }
  }

  private async saveState(): Promise<void> {
    try {
      const stateToSave = {
        currentState: this.state.currentState,
        intensity: this.state.intensity,
        lastUpdated: this.state.lastUpdated,
        lastTrigger: this.state.lastTrigger,
        transitionHistory: this.state.transitionHistory.slice(-this.MAX_HISTORY)
      };

      await fs.writeFile(this.stateFilePath, JSON.stringify(stateToSave, null, 2));
    } catch (error) {
      console.error('⚠️  Failed to save emotional state:', error);
    }
  }

  /**
   * HISTORY MANAGEMENT
   */
  private addToHistory(entry: TransitionHistoryEntry): void {
    this.state.transitionHistory.push(entry);

    // Keep only recent history
    if (this.state.transitionHistory.length > this.MAX_HISTORY) {
      this.state.transitionHistory = this.state.transitionHistory.slice(-this.MAX_HISTORY);
    }
  }

  public getTransitionHistory(limit?: number): TransitionHistoryEntry[] {
    const history = [...this.state.transitionHistory].reverse();
    return limit ? history.slice(0, limit) : history;
  }

  /**
   * STATUS AND DIAGNOSTICS
   */
  public getCurrentState(): StateSnapshot {
    return { ...this.state };
  }

  public getStatus(): {
    state: EmotionalState;
    intensity: number;
    intensityLevel: IntensityLevel;
    lastUpdated: string;
    historySize: number;
  } {
    return {
      state: this.state.currentState,
      intensity: this.state.intensity,
      intensityLevel: this.getIntensityLevel(),
      lastUpdated: this.state.lastUpdated,
      historySize: this.state.transitionHistory.length
    };
  }

  /**
   * CLEANUP
   */
  public destroy(): void {
    if (this.decayTimerHandle) {
      clearInterval(this.decayTimerHandle);
      this.decayTimerHandle = undefined;
    }
    console.log('🎭 Emotional State Machine destroyed');
  }
}

export default EmotionalStateMachine;
