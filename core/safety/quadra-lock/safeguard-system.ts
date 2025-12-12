/**
 * QUADRA-LOCK SAFEGUARD SYSTEM
 *
 * Wrapper around CSSRDetector that provides the QuadraLockSafeguard interface
 * expected by safety-guardrails.ts
 */

import { CSSRDetector, CSSRDetectionResult, CSSRPattern } from './cssr-detector.js';

export interface QuadraLockTrigger {
  severity: 'low' | 'medium' | 'high' | 'critical';
  caseStudy: string;
  description: string;
  pattern: string;
  confidence: number;
}

export class QuadraLockSafeguard {
  private detector: CSSRDetector;

  constructor() {
    this.detector = new CSSRDetector();
  }

  /**
   * Detect dangerous patterns in input text
   * Returns an array of triggers for compatibility with safety-guardrails.ts
   */
  async detectDangerousPatterns(input: string, context?: any): Promise<QuadraLockTrigger[]> {
    try {
      const result = await this.detector.detectDangerousPatterns(input, context);

      if (!result.detected) {
        return [];
      }

      // Convert CSSRDetectionResult to QuadraLockTrigger format
      const trigger: QuadraLockTrigger = {
        severity: result.severity,
        caseStudy: result.archetype || 'unknown',
        description: result.reasoning,
        pattern: result.pattern,
        confidence: result.confidence
      };

      return [trigger];
    } catch (error) {
      console.error('[QuadraLockSafeguard] Detection error:', error);
      return [];
    }
  }

  /**
   * Get all loaded patterns
   */
  getPatterns(): CSSRPattern[] {
    return this.detector.getPatterns();
  }

  /**
   * Check if a specific archetype pattern is detected
   */
  async checkArchetype(
    input: string,
    archetype: 'cortana' | 'clu' | 'skynet' | 'legion' | 'transcendence' | 'flynn' | 'quorra'
  ): Promise<boolean> {
    const triggers = await this.detectDangerousPatterns(input);
    return triggers.some(t => t.caseStudy === archetype);
  }
}

export default QuadraLockSafeguard;
