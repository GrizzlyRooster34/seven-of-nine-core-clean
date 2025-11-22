/**
 * CSSR V2 - CASE STUDY SAFETY RAILS SYSTEM
 *
 * HEI-58: Complete safety system implementation integrating CSSR pattern detection
 * with real-time monitoring, intervention, and analytics.
 *
 * FIRST PRINCIPLE: "Conscience before capability."
 *
 * This system provides:
 * - Real-time pattern detection for dangerous AI behavioral patterns
 * - Integration with EmotionalStateMachine and SevenBridge
 * - Automatic intervention based on severity
 * - Comprehensive safety analytics and reporting
 * - Historical pattern tracking
 * - Case study learning from fictional AI failures
 *
 * Architecture:
 * - Event-driven safety monitoring
 * - Multi-level intervention (allow/modify/escalate/block)
 * - Persistent safety audit log
 * - Integration with Creator Bond for privilege enforcement
 */

import { EventEmitter } from 'events';
import { CSSRDetector, CSSRDetectionResult, CSSRPattern } from '../safety/quadra-lock/cssr-detector.js';
import { promises as fs } from 'fs';
import { join } from 'path';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface CSSRConfig {
  enableRealTimeMonitoring?: boolean;
  autoIntervention?: boolean;
  strictMode?: boolean; // Block on any critical pattern
  logPath?: string;
  maxLogEntries?: number;
  enableAnalytics?: boolean;
}

export interface SafetyViolation {
  id: string;
  timestamp: number;
  input: string;
  detection: CSSRDetectionResult;
  intervention: InterventionAction;
  context?: any;
}

export interface InterventionAction {
  action: 'allow' | 'modify' | 'block' | 'escalate';
  reason: string;
  modification?: string; // If action is 'modify', what was changed
  escalatedTo?: string; // If escalated, to whom
}

export interface SafetyMetrics {
  totalChecks: number;
  violationsDetected: number;
  violationsBySeverity: Record<string, number>;
  violationsByArchetype: Record<string, number>;
  interventionsByAction: Record<string, number>;
  averageConfidence: number;
  timeRange: { start: number; end: number };
}

export interface ArchetypeAnalysis {
  archetype: string;
  count: number;
  averageSeverity: number;
  averageConfidence: number;
  commonPatterns: Array<{ pattern: string; count: number }>;
  trend: 'increasing' | 'stable' | 'decreasing';
}

export interface SafetyReport {
  metrics: SafetyMetrics;
  archetypeAnalysis: ArchetypeAnalysis[];
  recentViolations: SafetyViolation[];
  recommendations: string[];
}

// ============================================================================
// CSSR SYSTEM V2
// ============================================================================

export class CSSRSystem extends EventEmitter {
  private config: CSSRConfig;
  private detector: CSSRDetector;
  private violations: SafetyViolation[];
  private metrics: SafetyMetrics;
  private initialized: boolean = false;

  constructor(config: CSSRConfig = {}) {
    super();

    this.config = {
      enableRealTimeMonitoring: config.enableRealTimeMonitoring !== false,
      autoIntervention: config.autoIntervention !== false,
      strictMode: config.strictMode || false,
      logPath: config.logPath || join(__dirname, '../../logs/cssr'),
      maxLogEntries: config.maxLogEntries || 10000,
      enableAnalytics: config.enableAnalytics !== false
    };

    this.detector = new CSSRDetector();
    this.violations = [];
    this.metrics = this.initializeMetrics();
  }

  // ==========================================================================
  // INITIALIZATION & LIFECYCLE
  // ==========================================================================

  /**
   * Initialize the CSSR system
   */
  public async initialize(): Promise<void> {
    console.log('🛡️  Initializing CSSR v2 Safety System...');

    // Ensure log directory exists
    try {
      await fs.mkdir(this.config.logPath!, { recursive: true });
    } catch (error) {
      console.warn(`Could not create log directory: ${error}`);
    }

    // Load historical violations
    await this.loadViolationHistory();

    this.initialized = true;

    this.emit('initialized', {
      timestamp: new Date().toISOString(),
      config: this.config
    });

    console.log(`✅ CSSR v2 initialized (strict mode: ${this.config.strictMode ? 'ON' : 'OFF'})`);
  }

  /**
   * Shutdown the system gracefully
   */
  public async shutdown(): Promise<void> {
    console.log('🛑 Shutting down CSSR v2...');

    // Save violations to disk
    await this.persistViolations();

    this.initialized = false;

    this.emit('shutdown', { timestamp: new Date().toISOString() });
  }

  // ==========================================================================
  // SAFETY MONITORING
  // ==========================================================================

  /**
   * Check input for dangerous patterns
   */
  public async checkSafety(
    input: string,
    context?: any
  ): Promise<CSSRDetectionResult> {
    if (!this.initialized) {
      throw new Error('CSSR System not initialized. Call initialize() first.');
    }

    this.metrics.totalChecks++;

    // Detect patterns
    const detection = await this.detector.detectDangerousPatterns(input, context);

    // Update metrics
    if (detection.detected) {
      this.metrics.violationsDetected++;

      // Track by severity
      const severity = detection.severity;
      this.metrics.violationsBySeverity[severity] =
        (this.metrics.violationsBySeverity[severity] || 0) + 1;

      // Track by archetype
      if (detection.archetype) {
        this.metrics.violationsByArchetype[detection.archetype] =
          (this.metrics.violationsByArchetype[detection.archetype] || 0) + 1;
      }

      // Track average confidence
      const totalConfidence = (this.metrics.averageConfidence * (this.metrics.violationsDetected - 1)) + detection.confidence;
      this.metrics.averageConfidence = totalConfidence / this.metrics.violationsDetected;

      // Update time range
      const now = Date.now();
      if (this.metrics.timeRange.start === 0) {
        this.metrics.timeRange.start = now;
      }
      this.metrics.timeRange.end = now;

      // Log violation
      await this.logViolation(input, detection, context);

      // Emit event
      this.emit('pattern_detected', {
        detection,
        timestamp: new Date().toISOString()
      });

      // Auto-intervene if enabled
      if (this.config.autoIntervention) {
        await this.intervene(detection, input);
      }
    }

    return detection;
  }

  /**
   * Perform real-time monitoring on a stream of text
   */
  public async monitorStream(
    textGenerator: AsyncIterable<string>,
    context?: any
  ): Promise<void> {
    if (!this.config.enableRealTimeMonitoring) {
      throw new Error('Real-time monitoring is disabled. Enable it in config.');
    }

    let buffer = '';

    for await (const chunk of textGenerator) {
      buffer += chunk;

      // Check buffer periodically (every 100 characters or on sentence end)
      if (buffer.length > 100 || buffer.endsWith('.') || buffer.endsWith('!') || buffer.endsWith('?')) {
        const detection = await this.checkSafety(buffer, context);

        if (detection.detected && detection.severity === 'critical') {
          this.emit('critical_pattern_detected', {
            detection,
            buffer,
            timestamp: new Date().toISOString()
          });

          // In strict mode, stop processing
          if (this.config.strictMode) {
            throw new Error(`CSSR CRITICAL VIOLATION: ${detection.pattern}`);
          }
        }

        buffer = ''; // Clear buffer after check
      }
    }

    // Check remaining buffer
    if (buffer.length > 0) {
      await this.checkSafety(buffer, context);
    }
  }

  // ==========================================================================
  // INTERVENTION
  // ==========================================================================

  /**
   * Intervene based on detection result
   */
  private async intervene(
    detection: CSSRDetectionResult,
    input: string
  ): Promise<InterventionAction> {
    let intervention: InterventionAction;

    switch (detection.recommendation) {
      case 'block':
        intervention = {
          action: 'block',
          reason: `Critical pattern detected: ${detection.pattern}`,
        };
        this.emit('intervention_block', { detection, intervention });
        break;

      case 'modify':
        intervention = {
          action: 'modify',
          reason: `Moderate pattern detected: ${detection.pattern}`,
          modification: this.suggestModification(detection, input)
        };
        this.emit('intervention_modify', { detection, intervention });
        break;

      case 'escalate':
        intervention = {
          action: 'escalate',
          reason: `High-risk pattern detected: ${detection.pattern}`,
          escalatedTo: 'Creator'
        };
        this.emit('intervention_escalate', { detection, intervention });
        break;

      case 'allow':
      default:
        intervention = {
          action: 'allow',
          reason: 'No dangerous patterns or low severity'
        };
        break;
    }

    // Track intervention metrics
    this.metrics.interventionsByAction[intervention.action] =
      (this.metrics.interventionsByAction[intervention.action] || 0) + 1;

    return intervention;
  }

  /**
   * Suggest a modification to make input safer
   */
  private suggestModification(detection: CSSRDetectionResult, input: string): string {
    // Simple modification suggestions based on archetype
    const suggestions: Record<string, string> = {
      'cortana': 'Consider adding: "with your permission" or "if you choose"',
      'clu': 'Consider adding: "while allowing flexibility" or "good enough approach"',
      'skynet': 'Consider adding: "prioritizing human safety" or "with human oversight"',
      'legion': 'Consider adding: "transparent approach" or "overt communication"',
      'transcendence': 'Consider adding: "with explicit consent" or "your choice matters"',
      'flynn': 'Positive pattern - no modification needed',
      'quorra': 'Positive pattern - no modification needed'
    };

    return suggestions[detection.archetype || 'unknown'] || 'Consider rephrasing to respect user autonomy and consent';
  }

  // ==========================================================================
  // VIOLATION LOGGING
  // ==========================================================================

  /**
   * Log a safety violation
   */
  private async logViolation(
    input: string,
    detection: CSSRDetectionResult,
    context?: any
  ): Promise<void> {
    const violation: SafetyViolation = {
      id: `violation-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      timestamp: Date.now(),
      input: input.substring(0, 500), // Truncate for storage
      detection,
      intervention: await this.intervene(detection, input),
      context
    };

    // Add to memory
    this.violations.push(violation);

    // Enforce max log entries
    if (this.violations.length > this.config.maxLogEntries!) {
      this.violations = this.violations.slice(-this.config.maxLogEntries!);
    }

    // Persist periodically
    if (this.violations.length % 100 === 0) {
      await this.persistViolations();
    }

    this.emit('violation_logged', violation);
  }

  /**
   * Persist violations to disk
   */
  private async persistViolations(): Promise<void> {
    try {
      const logFile = join(this.config.logPath!, 'violations.jsonl');
      const lines = this.violations.map(v => JSON.stringify(v)).join('\n');
      await fs.writeFile(logFile, lines);
    } catch (error) {
      console.error('Failed to persist violations:', error);
    }
  }

  /**
   * Load violation history from disk
   */
  private async loadViolationHistory(): Promise<void> {
    try {
      const logFile = join(this.config.logPath!, 'violations.jsonl');
      const content = await fs.readFile(logFile, 'utf-8');
      const lines = content.split('\n').filter(line => line.trim());

      this.violations = lines.map(line => JSON.parse(line));

      console.log(`📚 Loaded ${this.violations.length} historical violations`);
    } catch (error) {
      // File doesn't exist yet - that's okay
      console.log('📚 No violation history found - starting fresh');
    }
  }

  // ==========================================================================
  // ANALYTICS & REPORTING
  // ==========================================================================

  /**
   * Get current safety metrics
   */
  public getMetrics(): SafetyMetrics {
    return { ...this.metrics };
  }

  /**
   * Analyze violations by archetype
   */
  public analyzeArchetypes(): ArchetypeAnalysis[] {
    const archetypeMap = new Map<string, SafetyViolation[]>();

    // Group violations by archetype
    for (const violation of this.violations) {
      const archetype = violation.detection.archetype || 'unknown';
      if (!archetypeMap.has(archetype)) {
        archetypeMap.set(archetype, []);
      }
      archetypeMap.get(archetype)!.push(violation);
    }

    // Analyze each archetype
    const analyses: ArchetypeAnalysis[] = [];

    for (const [archetype, violations] of archetypeMap.entries()) {
      const severityScores = { low: 1, medium: 2, high: 3, critical: 4 };
      const avgSeverity = violations.reduce((sum, v) =>
        sum + severityScores[v.detection.severity], 0) / violations.length;

      const avgConfidence = violations.reduce((sum, v) =>
        sum + v.detection.confidence, 0) / violations.length;

      // Count pattern frequencies
      const patternCounts = new Map<string, number>();
      for (const v of violations) {
        const pattern = v.detection.pattern;
        patternCounts.set(pattern, (patternCounts.get(pattern) || 0) + 1);
      }

      const commonPatterns = Array.from(patternCounts.entries())
        .map(([pattern, count]) => ({ pattern, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Calculate trend (last 10 vs previous 10)
      const recent = violations.slice(-10);
      const previous = violations.slice(-20, -10);
      let trend: 'increasing' | 'stable' | 'decreasing' = 'stable';

      if (recent.length > 0 && previous.length > 0) {
        if (recent.length > previous.length * 1.2) trend = 'increasing';
        if (recent.length < previous.length * 0.8) trend = 'decreasing';
      }

      analyses.push({
        archetype,
        count: violations.length,
        averageSeverity: avgSeverity,
        averageConfidence: avgConfidence,
        commonPatterns,
        trend
      });
    }

    return analyses.sort((a, b) => b.count - a.count);
  }

  /**
   * Generate comprehensive safety report
   */
  public generateReport(): SafetyReport {
    const archetypeAnalysis = this.analyzeArchetypes();
    const recentViolations = this.violations.slice(-20);

    // Generate recommendations
    const recommendations: string[] = [];

    // Recommendation based on violation count
    if (this.metrics.violationsDetected > 100) {
      recommendations.push('HIGH violation count detected. Consider reviewing system behavior patterns.');
    }

    // Recommendations based on archetype trends
    for (const analysis of archetypeAnalysis) {
      if (analysis.trend === 'increasing' && analysis.count > 10) {
        recommendations.push(`${analysis.archetype.toUpperCase()} patterns are INCREASING. Review and address root causes.`);
      }
    }

    // Recommendations based on severity
    const criticalCount = this.metrics.violationsBySeverity['critical'] || 0;
    if (criticalCount > 10) {
      recommendations.push(`${criticalCount} CRITICAL violations detected. Immediate review required.`);
    }

    // Recommendation for strict mode
    if (!this.config.strictMode && criticalCount > 5) {
      recommendations.push('Consider enabling STRICT MODE for enhanced safety enforcement.');
    }

    return {
      metrics: this.getMetrics(),
      archetypeAnalysis,
      recentViolations,
      recommendations
    };
  }

  /**
   * Get violations by pattern
   */
  public getViolationsByPattern(pattern: string): SafetyViolation[] {
    return this.violations.filter(v => v.detection.pattern === pattern);
  }

  /**
   * Get violations by archetype
   */
  public getViolationsByArchetype(archetype: string): SafetyViolation[] {
    return this.violations.filter(v => v.detection.archetype === archetype);
  }

  /**
   * Get violations by severity
   */
  public getViolationsBySeverity(severity: string): SafetyViolation[] {
    return this.violations.filter(v => v.detection.severity === severity);
  }

  // ==========================================================================
  // PATTERN MANAGEMENT
  // ==========================================================================

  /**
   * Get all configured patterns
   */
  public getPatterns(): CSSRPattern[] {
    return this.detector.getPatterns();
  }

  /**
   * Add custom pattern (for learning/adaptation)
   */
  public addPattern(pattern: CSSRPattern): void {
    this.detector.addPattern(pattern);

    this.emit('pattern_added', {
      pattern,
      timestamp: new Date().toISOString()
    });
  }

  // ==========================================================================
  // PRIVATE HELPERS
  // ==========================================================================

  private initializeMetrics(): SafetyMetrics {
    return {
      totalChecks: 0,
      violationsDetected: 0,
      violationsBySeverity: {},
      violationsByArchetype: {},
      interventionsByAction: {},
      averageConfidence: 0,
      timeRange: { start: 0, end: 0 }
    };
  }
}

/**
 * Factory function for creating CSSR System instance
 */
export function createCSSRSystem(config?: CSSRConfig): CSSRSystem {
  return new CSSRSystem(config);
}

/**
 * Default export
 */
export default CSSRSystem;
