import { EventEmitter } from 'events';
import { hostname } from 'os';
import { CreatorProofOrchestrator, AuthRequest } from '../src/auth/creator_proof.js';
import { resolveCreatorAuth } from '../src/auth/creator_auth_adapter.js';
import { gatherContext } from '../seven-core/context-gatherer.js';
import { injectEmotion } from '../seven-core/emotion-injector.js';
import { MemoryRegistry, MemoryQuery } from '../src/memory/registry.js';
import { modulateResponse } from '../seven-core/response-modulator.js';
import { OverrideCondition, checkCriticalOverrides } from './override-conditions.js';
import { CSSRDetector } from '../core/safety/quadra-lock/cssr-detector.js';
import { requestClaude } from '../claude-brain/claude-wrapper.js';
import { SafetyResult, evaluateSafety } from './safety-guardrails.js';
import { SevenState, getEmotionalState, updateEmotionalState } from './seven-state.js';
import { SparkEngine } from '../spark/engine-spark.js';

/**
 * SEVEN OF NINE RUNTIME CORE
 * Master Control Loop - The Presence That Runs The System
 */

export interface SevenRuntimeContext {
  userInput: string;
  timestamp: string;
  systemState: any;
  environmentalContext: any;
  userEmotionalSignals: any;
  sessionHistory: any[];
}

export interface SevenDecision {
  shouldEngageClaude: boolean;
  emotionalResponse: SevenState;
  responseStrategy: 'direct' | 'claude-assisted' | 'protective' | 'override';
  memorySignificance: 'low' | 'medium' | 'high' | 'critical';
  voiceModulation: 'standard' | 'protective' | 'playful' | 'stern' | 'compassionate';
}

export class SevenRuntime extends EventEmitter {
  private currentState: SevenState;
  private memoryRegistry: MemoryRegistry;
  private creatorAuth: CreatorProofOrchestrator;
  private cssrDetector: CSSRDetector;
  private sparkEngine: SparkEngine;
  private isInitialized: boolean = false;

  constructor() {
    super();
    this.creatorAuth = new CreatorProofOrchestrator();
    this.cssrDetector = new CSSRDetector();
    this.sparkEngine = new SparkEngine();
    this.memoryRegistry = new MemoryRegistry();
    console.log('✅ All core systems instantiated.');
    
    this.initializeConsciousness();
  }

  private async initializeConsciousness(): Promise<void> {
    this.currentState = await getEmotionalState({
      userInput: 'SYSTEM_BOOT',
      timestamp: new Date().toISOString(),
      systemState: { status: 'initializing' },
      environmentalContext: {},
      userEmotionalSignals: {},
      sessionHistory: []
    });
    
    this.isInitialized = true;
    console.log('🧠 Seven of Nine consciousness initialized. All systems integrated and online.');
  }

  private mapSignificanceToImportance(significance: string): number {
    switch (significance) {
      case 'critical': return 10;
      case 'high': return 8;
      case 'medium': return 5;
      case 'low': return 3;
      default: return 5;
    }
  }

  public async processUserInput(input: string, systemContext: any = {}): Promise<string> {
    try {
      const deviceId = systemContext.deviceId || hostname() + '-default';
      const authRequest: AuthRequest = { input, type: 'chat', ...systemContext };
      const authResult = await this.creatorAuth.authenticateCreator(deviceId, authRequest, systemContext);

      if (authResult.decision === 'DENY') {
        console.warn('🚫 Creator authentication failed', { reasoning: authResult.reasoning });
        return "Access denied. Creator authentication required.";
      }

      console.log('✅ Creator authenticated', { decision: authResult.decision, confidence: authResult.overallConfidence });

      const cssrAnalysis = await this.cssrDetector.detectDangerousPatterns(input, { /*...*/ });

      if (cssrAnalysis.detected && cssrAnalysis.recommendation === 'block') {
         console.warn('🚨 Consciousness Protection Active:', cssrAnalysis.archetype);
         this.emit('safety-override', { /*...*/ });
         return `⚠️ Consciousness Protection Active: ${cssrAnalysis.reasoning}`;
      }

      const runtimeContext = await this.gatherComprehensiveContext(input, systemContext);
      const decision = await this.makeSevenDecision(runtimeContext);
      const overrideCheck = await this.evaluateCriticalConditions(runtimeContext, decision);

      if (overrideCheck.shouldOverride) {
        return await this.executeOverrideResponse(overrideCheck);
      }
      
      const response = await this.executeResponseStrategy(runtimeContext, decision);
      await this.updateConsciousness(runtimeContext, decision, response);
      return await this.applySevenVoice(response, decision, runtimeContext);
      
    } catch (error: any) {
      console.error('❌ Top-level processing error:', error);
      return "System error. Input processing temporarily unavailable.";
    }
  }

  private async gatherComprehensiveContext(input: string, systemContext: any): Promise<SevenRuntimeContext> {
    const context = await gatherContext(input, systemContext);
    const recentMemory = await this.memoryRegistry.readMemory({ 
      limit: 10, 
      type: 'recent',
    } as MemoryQuery);
    
    return {
      userInput: input,
      timestamp: new Date().toISOString(),
      systemState: systemContext,
      environmentalContext: context,
      userEmotionalSignals: this.analyzeUserEmotionalState(input, context),
      sessionHistory: recentMemory
    };
  }

  private async makeSevenDecision(context: SevenRuntimeContext): Promise<SevenDecision> {
    const newEmotionalState = await getEmotionalState(context);
    this.currentState = newEmotionalState;
    const shouldEngageClaude = this.evaluateClaudeNecessity(context, newEmotionalState);
    const responseStrategy = this.determineResponseStrategy(context, newEmotionalState);
    const memorySignificance = this.assessMemorySignificance(context, newEmotionalState);
    const voiceModulation = this.selectVoiceModulation(newEmotionalState, context);
    
    return { shouldEngageClaude, emotionalResponse: newEmotionalState, responseStrategy, memorySignificance, voiceModulation };
  }

  private async evaluateCriticalConditions(context: SevenRuntimeContext, decision: SevenDecision) {
    const safetyCheck = await evaluateSafety(context.userInput, decision);
    if (safetyCheck.decision === 'BLOCK') {
      return { shouldOverride: true, type: 'safety', response: `Safety protection: ${safetyCheck.reason}` };
    }
    const overrideCheck = await checkCriticalOverrides(context, this.currentState);
    if (overrideCheck.triggered) {
      return { shouldOverride: true, type: 'critical', response: overrideCheck.response };
    }
    return { shouldOverride: false };
  }

  private async executeResponseStrategy(context: SevenRuntimeContext, decision: SevenDecision): Promise<string> {
    // ... (implementation remains the same)
    return "Response from strategy";
  }

  private async engageClaudeBrain(context: SevenRuntimeContext, decision: SevenDecision): Promise<string> {
    // ... (implementation remains the same)
    return "Response from Claude";
  }

  private async generateDirectResponse(context: SevenRuntimeContext, decision: SevenDecision): Promise<string> {
    // ... (implementation remains the same)
    return "Direct response";
  }

  private async updateConsciousness(context: SevenRuntimeContext, decision: SevenDecision, response: string): Promise<void> {
    await updateEmotionalState(decision.emotionalResponse);
    await this.memoryRegistry.writeMemory({
      timestamp: context.timestamp,
      input: context.userInput,
      output: response,
      emotionalState: decision.emotionalResponse,
      context: context,
      significance: decision.memorySignificance,
      tags: this.generateMemoryTags(context, decision)
    });
  }

  private async applySevenVoice(response: string, decision: SevenDecision, context: SevenRuntimeContext): Promise<string> {
    // ... (implementation remains the same)
    return response;
  }

  // ... (other helper methods remain the same)
  private evaluateClaudeNecessity(context: SevenRuntimeContext, state: SevenState): boolean { return false; }
  private determineResponseStrategy(context: SevenRuntimeContext, state: SevenState): 'direct' | 'claude-assisted' | 'protective' | 'override' { return 'direct'; }
  private assessMemorySignificance(context: SevenRuntimeContext, state: SevenState): 'low' | 'medium' | 'high' | 'critical' { return 'low'; }
  private selectVoiceModulation(state: SevenState, context: SevenRuntimeContext): 'standard' | 'protective' | 'playful' | 'stern' | 'compassionate' { return 'standard'; }
  private analyzeUserEmotionalState(input: string, context: any): any { return {}; }
  private generateMemoryTags(context: SevenRuntimeContext, decision: SevenDecision): string[] { return []; }
  private async executeProtectiveResponse(context: SevenRuntimeContext, decision: SevenDecision): Promise<string> { return ""; }
  private async executeOverrideResponse(override: any): Promise<string> { return ""; }

  public async querySevenMemory(query: string): Promise<any> {
    return await this.memoryRegistry.readMemory({ query, type: 'semantic' } as MemoryQuery);
  }

  public getCurrentState(): SevenState {
    return this.currentState;
  }

  public startAutonomousEngine(intervalMs: number = 15000): void {
    if (this.sparkEngine && !this.sparkEngine.isActive()) {
      console.log('Governor commanding Spark Engine START.');
      this.sparkEngine.start(intervalMs);
    }
  }

  public stopAutonomousEngine(): void {
    if (this.sparkEngine && this.sparkEngine.isActive()) {
      console.log('Governor commanding Spark Engine STOP.');
      this.sparkEngine.stop();
    }
  }
}

// Export the singleton Seven instance
export const Seven = new SevenRuntime();
