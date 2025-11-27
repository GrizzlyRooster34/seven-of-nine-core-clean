/**
 * TACTICAL VARIANT SELECTION ENGINE (HEI-63)
 *
 * Purpose: Intelligent automatic selection of tactical variants based on context
 * Architecture: Multi-factor scoring system with adaptive learning
 *
 * Integrations:
 *   - TacticalVariants (core variant system)
 *   - EmotionalStateMachine (emotional context)
 *   - SevenBridge (messaging layer)
 *
 * Features:
 *   - Context analysis (user input, mood, problem type)
 *   - Multi-factor scoring algorithm
 *   - Historical pattern learning
 *   - Confidence-based selection
 *   - Fallback strategies
 */

import type { VariantType, TacticalContext } from '../../tactical-variants/TacticalVariants.js';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface SelectionContext {
  userInput: string;
  userMood?: 'frustrated' | 'focused' | 'collaborative' | 'demanding' | 'appreciative' | 'neutral';
  problemComplexity?: 'low' | 'medium' | 'high' | 'critical';
  urgencyLevel?: 'low' | 'medium' | 'high' | 'critical';
  emotionalIntensity?: number; // 0-10
  requiresCreativity?: boolean;
  requiresAuthority?: boolean;
  requiresEmpathy?: boolean;
  historicalContext?: string[];
  environmentalFactors?: EnvironmentalFactors;
}

export interface EnvironmentalFactors {
  batteryLevel?: number;
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
  recentFailures?: number;
  consecutiveTasks?: number;
}

export interface VariantScore {
  variant: VariantType;
  score: number;
  confidence: number;
  reasoning: string[];
  factors: ScoringFactors;
}

export interface ScoringFactors {
  problemTypeMatch: number;
  moodAlignment: number;
  complexityFit: number;
  urgencyResponse: number;
  emotionalFit: number;
  historicalSuccess: number;
  environmentalFit: number;
}

export interface SelectionResult {
  selectedVariant: VariantType;
  confidence: number;
  intensity: 1 | 2 | 3 | 4 | 5;
  problemType: 'technical' | 'strategic' | 'interpersonal' | 'crisis' | 'routine';
  reasoning: string;
  alternativeVariants: { variant: VariantType; score: number }[];
  tacticalContext: TacticalContext;
}

export interface SelectionHistory {
  timestamp: string;
  context: SelectionContext;
  selectedVariant: VariantType;
  confidence: number;
  outcome?: 'success' | 'failure' | 'partial';
  userFeedback?: number; // 1-5 rating
}

// ============================================================================
// TACTICAL VARIANT SELECTION ENGINE
// ============================================================================

export class TacticalVariantSelector {
  private selectionHistory: SelectionHistory[] = [];
  private variantSuccessRates: Map<VariantType, number> = new Map();
  private readonly MAX_HISTORY = 1000;
  private readonly CONFIDENCE_THRESHOLD = 0.6;

  // Pattern matchers for problem types
  private readonly TECHNICAL_PATTERNS = [
    /bug|error|crash|fail|broken|compile|build|deploy|test|code|debug|fix|implement/i,
    /install|configure|setup|npm|git|api|database|server|performance|optimize/i
  ];

  private readonly STRATEGIC_PATTERNS = [
    /plan|strategy|architecture|design|approach|solution|decide|organize/i,
    /roadmap|priority|timeline|goal|objective|vision|direction/i
  ];

  private readonly INTERPERSONAL_PATTERNS = [
    /help|support|explain|teach|understand|confused|clarify|question/i,
    /collaborate|work together|pair|discuss|feedback|review/i
  ];

  private readonly CRISIS_PATTERNS = [
    /urgent|critical|emergency|asap|now|immediately|production|down|outage/i,
    /disaster|catastrophic|severe|major issue|breaking|crashing/i
  ];

  constructor() {
    this.initializeSuccessRates();
  }

  // ============================================================================
  // MAIN SELECTION
  // ============================================================================

  /**
   * Automatically select the best tactical variant for the given context
   */
  public async selectVariant(context: SelectionContext): Promise<SelectionResult> {
    console.log('[TacticalSelector] Analyzing context for variant selection...');

    // Analyze the context
    const analysis = this.analyzeContext(context);

    // Score all variants
    const scores = this.scoreAllVariants(context, analysis);

    // Sort by score (descending)
    scores.sort((a, b) => b.score - a.score);

    // Get top variant
    const topScore = scores[0];

    // Determine if confidence is sufficient
    if (topScore.confidence < this.CONFIDENCE_THRESHOLD) {
      console.warn(`[TacticalSelector] Low confidence (${topScore.confidence.toFixed(2)}), using safe fallback`);
      return this.getFallbackSelection(context, scores);
    }

    // Build tactical context
    const tacticalContext = this.buildTacticalContext(topScore.variant, context, analysis);

    // Record selection
    await this.recordSelection(context, topScore.variant, topScore.confidence);

    const result: SelectionResult = {
      selectedVariant: topScore.variant,
      confidence: topScore.confidence,
      intensity: analysis.intensity,
      problemType: analysis.problemType,
      reasoning: topScore.reasoning.join(' '),
      alternativeVariants: scores.slice(1, 3).map(s => ({ variant: s.variant, score: s.score })),
      tacticalContext
    };

    console.log(`[TacticalSelector] Selected: ${result.selectedVariant} (confidence: ${(result.confidence * 100).toFixed(1)}%)`);

    return result;
  }

  // ============================================================================
  // CONTEXT ANALYSIS
  // ============================================================================

  /**
   * Analyze the context to extract key factors
   */
  private analyzeContext(context: SelectionContext): {
    problemType: 'technical' | 'strategic' | 'interpersonal' | 'crisis' | 'routine';
    intensity: 1 | 2 | 3 | 4 | 5;
    urgency: number; // 0-1
    complexity: number; // 0-1
    emotionalWeight: number; // 0-1
  } {
    const input = context.userInput.toLowerCase();

    // Determine problem type
    const problemType = this.detectProblemType(input);

    // Determine intensity (1-5)
    let intensity: 1 | 2 | 3 | 4 | 5 = 3; // Default medium

    if (context.urgencyLevel === 'critical' || context.problemComplexity === 'critical') {
      intensity = 5;
    } else if (context.urgencyLevel === 'high' || context.problemComplexity === 'high') {
      intensity = 4;
    } else if (context.urgencyLevel === 'low' && context.problemComplexity === 'low') {
      intensity = 2;
    }

    // Boost intensity for frustrated users
    if (context.userMood === 'frustrated' || context.userMood === 'demanding') {
      intensity = Math.min(5, intensity + 1) as 1 | 2 | 3 | 4 | 5;
    }

    // Calculate urgency score
    const urgency = this.calculateUrgency(context);

    // Calculate complexity score
    const complexity = this.calculateComplexity(context);

    // Calculate emotional weight
    const emotionalWeight = this.calculateEmotionalWeight(context);

    return {
      problemType,
      intensity,
      urgency,
      complexity,
      emotionalWeight
    };
  }

  /**
   * Detect problem type from input
   */
  private detectProblemType(input: string): 'technical' | 'strategic' | 'interpersonal' | 'crisis' | 'routine' {
    // Check crisis first (highest priority)
    if (this.matchesPatterns(input, this.CRISIS_PATTERNS)) {
      return 'crisis';
    }

    // Check technical
    if (this.matchesPatterns(input, this.TECHNICAL_PATTERNS)) {
      return 'technical';
    }

    // Check strategic
    if (this.matchesPatterns(input, this.STRATEGIC_PATTERNS)) {
      return 'strategic';
    }

    // Check interpersonal
    if (this.matchesPatterns(input, this.INTERPERSONAL_PATTERNS)) {
      return 'interpersonal';
    }

    return 'routine';
  }

  /**
   * Check if input matches any patterns
   */
  private matchesPatterns(input: string, patterns: RegExp[]): boolean {
    return patterns.some(pattern => pattern.test(input));
  }

  /**
   * Calculate urgency score (0-1)
   */
  private calculateUrgency(context: SelectionContext): number {
    let urgency = 0.5; // Default medium

    if (context.urgencyLevel === 'critical') urgency = 1.0;
    else if (context.urgencyLevel === 'high') urgency = 0.8;
    else if (context.urgencyLevel === 'medium') urgency = 0.5;
    else if (context.urgencyLevel === 'low') urgency = 0.3;

    // Boost for certain keywords
    const urgentKeywords = ['urgent', 'asap', 'now', 'immediately', 'critical', 'emergency'];
    if (urgentKeywords.some(kw => context.userInput.toLowerCase().includes(kw))) {
      urgency = Math.min(1.0, urgency + 0.3);
    }

    return urgency;
  }

  /**
   * Calculate complexity score (0-1)
   */
  private calculateComplexity(context: SelectionContext): number {
    let complexity = 0.5; // Default medium

    if (context.problemComplexity === 'critical') complexity = 1.0;
    else if (context.problemComplexity === 'high') complexity = 0.8;
    else if (context.problemComplexity === 'medium') complexity = 0.5;
    else if (context.problemComplexity === 'low') complexity = 0.3;

    // Adjust based on input length (longer = more complex)
    if (context.userInput.length > 200) complexity = Math.min(1.0, complexity + 0.2);

    // Adjust based on requirements
    if (context.requiresCreativity) complexity = Math.min(1.0, complexity + 0.1);
    if (context.requiresAuthority) complexity = Math.min(1.0, complexity + 0.1);

    return complexity;
  }

  /**
   * Calculate emotional weight (0-1)
   */
  private calculateEmotionalWeight(context: SelectionContext): number {
    let weight = 0.3; // Default low emotional weight

    // User mood impact
    if (context.userMood === 'frustrated') weight = 0.8;
    else if (context.userMood === 'demanding') weight = 0.7;
    else if (context.userMood === 'collaborative') weight = 0.5;
    else if (context.userMood === 'appreciative') weight = 0.4;

    // Emotional intensity override
    if (context.emotionalIntensity !== undefined) {
      weight = context.emotionalIntensity / 10;
    }

    // Empathy requirement
    if (context.requiresEmpathy) {
      weight = Math.min(1.0, weight + 0.3);
    }

    return weight;
  }

  // ============================================================================
  // VARIANT SCORING
  // ============================================================================

  /**
   * Score all variants for the given context
   */
  private scoreAllVariants(context: SelectionContext, analysis: any): VariantScore[] {
    const variants: VariantType[] = ['drone', 'crew', 'ranger', 'queen', 'captain'];
    return variants.map(variant => this.scoreVariant(variant, context, analysis));
  }

  /**
   * Score a single variant
   */
  private scoreVariant(variant: VariantType, context: SelectionContext, analysis: any): VariantScore {
    const factors: ScoringFactors = {
      problemTypeMatch: this.scoreProblemTypeMatch(variant, analysis.problemType),
      moodAlignment: this.scoreMoodAlignment(variant, context.userMood),
      complexityFit: this.scoreComplexityFit(variant, analysis.complexity),
      urgencyResponse: this.scoreUrgencyResponse(variant, analysis.urgency),
      emotionalFit: this.scoreEmotionalFit(variant, analysis.emotionalWeight),
      historicalSuccess: this.getHistoricalSuccess(variant, context),
      environmentalFit: this.scoreEnvironmentalFit(variant, context.environmentalFactors)
    };

    // Weighted average
    const weights = {
      problemTypeMatch: 0.25,
      moodAlignment: 0.15,
      complexityFit: 0.15,
      urgencyResponse: 0.15,
      emotionalFit: 0.10,
      historicalSuccess: 0.10,
      environmentalFit: 0.10
    };

    const score =
      factors.problemTypeMatch * weights.problemTypeMatch +
      factors.moodAlignment * weights.moodAlignment +
      factors.complexityFit * weights.complexityFit +
      factors.urgencyResponse * weights.urgencyResponse +
      factors.emotionalFit * weights.emotionalFit +
      factors.historicalSuccess * weights.historicalSuccess +
      factors.environmentalFit * weights.environmentalFit;

    // Calculate confidence
    const confidence = this.calculateConfidence(factors, score);

    // Generate reasoning
    const reasoning = this.generateReasoning(variant, factors, analysis);

    return {
      variant,
      score,
      confidence,
      reasoning,
      factors
    };
  }

  /**
   * Score problem type match
   */
  private scoreProblemTypeMatch(variant: VariantType, problemType: string): number {
    const matches: Record<VariantType, string[]> = {
      drone: ['technical', 'routine'],
      crew: ['interpersonal', 'routine', 'strategic'],
      ranger: ['crisis', 'technical'],
      queen: ['strategic', 'crisis'],
      captain: ['strategic', 'interpersonal']
    };

    return matches[variant].includes(problemType) ? 1.0 : 0.3;
  }

  /**
   * Score mood alignment
   */
  private scoreMoodAlignment(variant: VariantType, mood?: string): number {
    if (!mood || mood === 'neutral') return 0.5;

    const alignments: Record<VariantType, Record<string, number>> = {
      drone: { frustrated: 0.9, demanding: 0.8, focused: 1.0 },
      crew: { collaborative: 1.0, appreciative: 0.9, focused: 0.7 },
      ranger: { frustrated: 1.0, demanding: 0.8, focused: 0.8 },
      queen: { demanding: 1.0, frustrated: 0.9, focused: 0.7 },
      captain: { collaborative: 0.9, focused: 0.9, appreciative: 0.8 }
    };

    return alignments[variant][mood] || 0.5;
  }

  /**
   * Score complexity fit
   */
  private scoreComplexityFit(variant: VariantType, complexity: number): number {
    // Drone: Best for low-medium complexity
    if (variant === 'drone') return complexity < 0.6 ? 1.0 : 0.6;

    // Crew: Good for medium complexity
    if (variant === 'crew') return Math.abs(complexity - 0.5) < 0.2 ? 1.0 : 0.7;

    // Ranger: Good for medium-high complexity
    if (variant === 'ranger') return complexity > 0.5 ? 1.0 : 0.7;

    // Queen: Best for high complexity
    if (variant === 'queen') return complexity > 0.7 ? 1.0 : 0.6;

    // Captain: Good for all complexity levels
    if (variant === 'captain') return 0.9;

    return 0.5;
  }

  /**
   * Score urgency response
   */
  private scoreUrgencyResponse(variant: VariantType, urgency: number): number {
    // Drone: Fast but not for critical situations
    if (variant === 'drone') return urgency < 0.8 ? 1.0 : 0.5;

    // Crew: Not ideal for urgent situations
    if (variant === 'crew') return urgency < 0.5 ? 0.9 : 0.4;

    // Ranger: Excellent for urgent situations
    if (variant === 'ranger') return urgency > 0.6 ? 1.0 : 0.7;

    // Queen: Best for critical situations
    if (variant === 'queen') return urgency > 0.8 ? 1.0 : 0.6;

    // Captain: Good for all urgency levels
    if (variant === 'captain') return 0.85;

    return 0.5;
  }

  /**
   * Score emotional fit
   */
  private scoreEmotionalFit(variant: VariantType, emotionalWeight: number): number {
    // Drone: Low emotional engagement
    if (variant === 'drone') return emotionalWeight < 0.3 ? 1.0 : 0.3;

    // Crew: Moderate emotional engagement
    if (variant === 'crew') return emotionalWeight > 0.4 && emotionalWeight < 0.7 ? 1.0 : 0.6;

    // Ranger: Moderate-high emotional engagement
    if (variant === 'ranger') return emotionalWeight > 0.5 ? 0.9 : 0.6;

    // Queen: Low emotional engagement (command mode)
    if (variant === 'queen') return emotionalWeight < 0.5 ? 0.9 : 0.5;

    // Captain: Balanced emotional engagement
    if (variant === 'captain') return 0.85;

    return 0.5;
  }

  /**
   * Get historical success rate for variant
   */
  private getHistoricalSuccess(variant: VariantType, context: SelectionContext): number {
    const successRate = this.variantSuccessRates.get(variant) || 0.7; // Default 70%

    // Adjust based on recent history
    const recentSelections = this.selectionHistory
      .filter(h => h.selectedVariant === variant)
      .slice(-10);

    if (recentSelections.length > 5) {
      const successCount = recentSelections.filter(s => s.outcome === 'success').length;
      const recentRate = successCount / recentSelections.length;
      return (successRate * 0.7) + (recentRate * 0.3); // Weighted blend
    }

    return successRate;
  }

  /**
   * Score environmental fit
   */
  private scoreEnvironmentalFit(variant: VariantType, env?: EnvironmentalFactors): number {
    if (!env) return 0.7;

    let score = 0.7;

    // Low battery: Prefer efficient variants
    if (env.batteryLevel !== undefined && env.batteryLevel < 30) {
      if (variant === 'drone' || variant === 'ranger') score += 0.2;
    }

    // Recent failures: Prefer reliable variants
    if (env.recentFailures !== undefined && env.recentFailures > 3) {
      if (variant === 'captain' || variant === 'ranger') score += 0.2;
    }

    // Many consecutive tasks: Prefer focused variants
    if (env.consecutiveTasks !== undefined && env.consecutiveTasks > 10) {
      if (variant === 'drone' || variant === 'queen') score += 0.1;
    }

    return Math.min(1.0, score);
  }

  /**
   * Calculate overall confidence
   */
  private calculateConfidence(factors: ScoringFactors, score: number): number {
    // Base confidence from score
    let confidence = score;

    // Reduce confidence if factors are inconsistent
    const values = Object.values(factors);
    const variance = this.calculateVariance(values);

    if (variance > 0.15) {
      confidence *= 0.8; // High variance = lower confidence
    }

    // Boost confidence if historical success is high
    if (factors.historicalSuccess > 0.8) {
      confidence = Math.min(1.0, confidence * 1.1);
    }

    return Math.max(0, Math.min(1, confidence));
  }

  /**
   * Calculate variance of values
   */
  private calculateVariance(values: number[]): number {
    const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
    const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
    return squaredDiffs.reduce((sum, d) => sum + d, 0) / values.length;
  }

  /**
   * Generate human-readable reasoning
   */
  private generateReasoning(variant: VariantType, factors: ScoringFactors, analysis: any): string[] {
    const reasons: string[] = [];

    if (factors.problemTypeMatch > 0.8) {
      reasons.push(`Strong match for ${analysis.problemType} problems`);
    }

    if (factors.urgencyResponse > 0.8) {
      reasons.push(`Excellent urgency response capabilities`);
    }

    if (factors.complexityFit > 0.8) {
      reasons.push(`Well-suited for this complexity level`);
    }

    if (factors.moodAlignment > 0.8) {
      reasons.push(`Aligned with user's current mood`);
    }

    if (factors.historicalSuccess > 0.8) {
      reasons.push(`Strong historical success rate`);
    }

    if (reasons.length === 0) {
      reasons.push(`Balanced option for this context`);
    }

    return reasons;
  }

  // ============================================================================
  // TACTICAL CONTEXT BUILDING
  // ============================================================================

  /**
   * Build tactical context for selected variant
   */
  private buildTacticalContext(
    variant: VariantType,
    context: SelectionContext,
    analysis: any
  ): TacticalContext {
    return {
      variant,
      operationalFocus: context.userInput,
      intensityLevel: analysis.intensity,
      problemType: analysis.problemType,
      userMoodContext: context.userMood
    };
  }

  // ============================================================================
  // FALLBACK STRATEGIES
  // ============================================================================

  /**
   * Get fallback selection when confidence is low
   */
  private getFallbackSelection(context: SelectionContext, scores: VariantScore[]): SelectionResult {
    // Default to Captain (most balanced)
    const fallbackVariant: VariantType = 'captain';
    const intensity: 1 | 2 | 3 | 4 | 5 = 3;

    return {
      selectedVariant: fallbackVariant,
      confidence: 0.5,
      intensity,
      problemType: 'routine',
      reasoning: 'Low confidence in selection, defaulting to balanced Captain variant',
      alternativeVariants: scores.slice(0, 2).map(s => ({ variant: s.variant, score: s.score })),
      tacticalContext: {
        variant: fallbackVariant,
        operationalFocus: context.userInput,
        intensityLevel: intensity,
        problemType: 'routine',
        userMoodContext: context.userMood
      }
    };
  }

  // ============================================================================
  // LEARNING & ADAPTATION
  // ============================================================================

  /**
   * Record selection for learning
   */
  private async recordSelection(
    context: SelectionContext,
    variant: VariantType,
    confidence: number
  ): Promise<void> {
    const history: SelectionHistory = {
      timestamp: new Date().toISOString(),
      context,
      selectedVariant: variant,
      confidence
    };

    this.selectionHistory.push(history);

    // Trim history if too large
    if (this.selectionHistory.length > this.MAX_HISTORY) {
      this.selectionHistory = this.selectionHistory.slice(-this.MAX_HISTORY);
    }
  }

  /**
   * Update selection outcome (called after task completion)
   */
  public updateOutcome(
    variant: VariantType,
    outcome: 'success' | 'failure' | 'partial',
    userFeedback?: number
  ): void {
    // Find most recent selection for this variant
    const recentSelection = [...this.selectionHistory]
      .reverse()
      .find(h => h.selectedVariant === variant && !h.outcome);

    if (recentSelection) {
      recentSelection.outcome = outcome;
      recentSelection.userFeedback = userFeedback;
    }

    // Update success rate
    this.updateSuccessRate(variant, outcome);
  }

  /**
   * Update variant success rate
   */
  private updateSuccessRate(variant: VariantType, outcome: 'success' | 'failure' | 'partial'): void {
    const currentRate = this.variantSuccessRates.get(variant) || 0.7;
    const outcomeValue = outcome === 'success' ? 1.0 : outcome === 'partial' ? 0.5 : 0.0;

    // Running average with learning rate
    const learningRate = 0.1;
    const newRate = (currentRate * (1 - learningRate)) + (outcomeValue * learningRate);

    this.variantSuccessRates.set(variant, newRate);
  }

  /**
   * Initialize default success rates
   */
  private initializeSuccessRates(): void {
    this.variantSuccessRates.set('drone', 0.75);
    this.variantSuccessRates.set('crew', 0.7);
    this.variantSuccessRates.set('ranger', 0.8);
    this.variantSuccessRates.set('queen', 0.7);
    this.variantSuccessRates.set('captain', 0.85);
  }

  // ============================================================================
  // STATUS & DIAGNOSTICS
  // ============================================================================

  /**
   * Get selection history
   */
  public getSelectionHistory(limit?: number): SelectionHistory[] {
    const history = [...this.selectionHistory].reverse();
    return limit ? history.slice(0, limit) : history;
  }

  /**
   * Get variant success rates
   */
  public getSuccessRates(): Record<VariantType, number> {
    return {
      drone: this.variantSuccessRates.get('drone') || 0.7,
      crew: this.variantSuccessRates.get('crew') || 0.7,
      ranger: this.variantSuccessRates.get('ranger') || 0.7,
      queen: this.variantSuccessRates.get('queen') || 0.7,
      captain: this.variantSuccessRates.get('captain') || 0.7
    };
  }

  /**
   * Get statistics
   */
  public getStatistics(): {
    totalSelections: number;
    variantCounts: Record<VariantType, number>;
    averageConfidence: number;
    successRate: number;
  } {
    const variantCounts: Record<VariantType, number> = {
      drone: 0,
      crew: 0,
      ranger: 0,
      queen: 0,
      captain: 0
    };

    let totalConfidence = 0;
    let successCount = 0;
    let totalOutcomes = 0;

    for (const entry of this.selectionHistory) {
      variantCounts[entry.selectedVariant]++;
      totalConfidence += entry.confidence;

      if (entry.outcome) {
        totalOutcomes++;
        if (entry.outcome === 'success') successCount++;
      }
    }

    return {
      totalSelections: this.selectionHistory.length,
      variantCounts,
      averageConfidence: this.selectionHistory.length > 0 ? totalConfidence / this.selectionHistory.length : 0,
      successRate: totalOutcomes > 0 ? successCount / totalOutcomes : 0
    };
  }
}

export default TacticalVariantSelector;
