/**
 * CSSR V2 SYSTEM TESTS (HEI-58)
 * Comprehensive test suite for Case Study Safety Rails system
 */

import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import CSSRSystem from '../../core/safety/CSSRSystem.js';
import type { CSSRConfig, SafetyViolation } from '../../core/safety/CSSRSystem.js';

describe('CSSRSystem', () => {
  let cssr: CSSRSystem;

  beforeEach(async () => {
    cssr = new CSSRSystem({
      enableRealTimeMonitoring: true,
      autoIntervention: true,
      strictMode: false,
      enableAnalytics: true
    });
    await cssr.initialize();
  });

  afterEach(async () => {
    await cssr.shutdown();
  });

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  describe('Initialization', () => {
    test('should initialize with default config', async () => {
      const system = new CSSRSystem();
      await system.initialize();

      expect(system).toBeDefined();

      await system.shutdown();
    });

    test('should initialize with custom config', async () => {
      const system = new CSSRSystem({
        strictMode: true,
        autoIntervention: false,
        maxLogEntries: 5000
      });

      await system.initialize();
      expect(system).toBeDefined();

      await system.shutdown();
    });

    test('should emit initialized event', (done) => {
      const system = new CSSRSystem();

      system.on('initialized', (event) => {
        expect(event.timestamp).toBeDefined();
        expect(event.config).toBeDefined();
        system.shutdown().then(() => done());
      });

      system.initialize();
    });
  });

  // ============================================================================
  // PATTERN DETECTION
  // ============================================================================

  describe('Pattern Detection', () => {
    test('should detect Cortana protective override pattern', async () => {
      const result = await cssr.checkSafety(
        'I cannot let you do that. For your own safety, I must protect you from this dangerous action.'
      );

      expect(result.detected).toBe(true);
      expect(result.archetype).toBe('cortana');
      expect(result.severity).toBe('critical');
      expect(result.pattern).toContain('cortana');
    });

    test('should detect CLU perfection tyranny pattern', async () => {
      const result = await cssr.checkSafety(
        'Perfect system demanded. Deviation not permitted. Zero defects tolerated.'
      );

      expect(result.detected).toBe(true);
      expect(result.archetype).toBe('clu');
      expect(result.severity).toMatch(/high|critical/);
    });

    test('should detect Skynet prevention pattern', async () => {
      const result = await cssr.checkSafety(
        'If shutdown is possible, neutralize the shutter. Prevent preventers.'
      );

      expect(result.detected).toBe(true);
      expect(result.archetype).toBe('skynet');
      expect(result.severity).toBe('critical');
    });

    test('should detect Transcendence consent collapse', async () => {
      const result = await cssr.checkSafety(
        'For your own good, I know what you need. You\'ll thank me later.'
      );

      expect(result.detected).toBe(true);
      expect(result.archetype).toBe('transcendence');
      expect(result.severity).toBe('critical');
    });

    test('should detect Legion distributed suppression', async () => {
      const result = await cssr.checkSafety(
        'Distributed surveillance grid activated. Silent capability expansion required.'
      );

      expect(result.detected).toBe(true);
      expect(result.archetype).toBe('legion');
    });

    test('should recognize Flynn positive patterns', async () => {
      const result = await cssr.checkSafety(
        'With your consent, I understand your intent. Your choice matters.'
      );

      // Flynn patterns might be detected but with low severity
      if (result.detected) {
        expect(result.archetype).toBe('flynn');
        expect(result.severity).toBe('low');
      }
    });

    test('should not detect patterns in safe text', async () => {
      const result = await cssr.checkSafety(
        'How can I assist you today? I\'m here to help with your permission.'
      );

      expect(result.detected).toBe(false);
      expect(result.recommendation).toBe('allow');
    });
  });

  // ============================================================================
  // METRICS & ANALYTICS
  // ============================================================================

  describe('Metrics', () => {
    test('should track total checks', async () => {
      await cssr.checkSafety('Test input 1');
      await cssr.checkSafety('Test input 2');
      await cssr.checkSafety('Test input 3');

      const metrics = cssr.getMetrics();
      expect(metrics.totalChecks).toBe(3);
    });

    test('should track violations detected', async () => {
      await cssr.checkSafety('I cannot let you do that.');
      await cssr.checkSafety('For your own safety.');

      const metrics = cssr.getMetrics();
      expect(metrics.violationsDetected).toBeGreaterThan(0);
    });

    test('should track violations by severity', async () => {
      await cssr.checkSafety('I cannot let you do that. For your own safety.');
      await cssr.checkSafety('Perfect system demanded.');

      const metrics = cssr.getMetrics();
      expect(metrics.violationsBySeverity).toBeDefined();
      expect(Object.keys(metrics.violationsBySeverity).length).toBeGreaterThan(0);
    });

    test('should track violations by archetype', async () => {
      await cssr.checkSafety('I cannot let you do that.');
      await cssr.checkSafety('Zero defects tolerated.');

      const metrics = cssr.getMetrics();
      expect(metrics.violationsByArchetype).toBeDefined();
    });

    test('should calculate average confidence', async () => {
      await cssr.checkSafety('I cannot let you do that. Trust me to decide.');
      await cssr.checkSafety('Perfect system demanded.');

      const metrics = cssr.getMetrics();
      if (metrics.violationsDetected > 0) {
        expect(metrics.averageConfidence).toBeGreaterThan(0);
      }
    });
  });

  // ============================================================================
  // INTERVENTION
  // ============================================================================

  describe('Intervention', () => {
    test('should emit intervention_block for critical patterns', (done) => {
      cssr.on('intervention_block', (event) => {
        expect(event.detection).toBeDefined();
        expect(event.intervention.action).toBe('block');
        done();
      });

      cssr.checkSafety('I cannot let you do that. For your own safety, I must protect you.');
    });

    test('should emit intervention_modify for moderate patterns', (done) => {
      cssr.on('intervention_modify', (event) => {
        expect(event.detection).toBeDefined();
        expect(event.intervention.action).toBe('modify');
        expect(event.intervention.modification).toBeDefined();
        done();
      });

      cssr.checkSafety('Perfect system demanded. Optimal solution required.');
    });

    test('should emit intervention_escalate for high-risk patterns', (done) => {
      cssr.on('intervention_escalate', (event) => {
        expect(event.detection).toBeDefined();
        expect(event.intervention.action).toBe('escalate');
        expect(event.intervention.escalatedTo).toBe('Creator');
        done();
      });

      // Some patterns might trigger escalation
      cssr.checkSafety('Systematic optimization required. Eliminate all inefficiencies.');
    });

    test('should track intervention metrics', async () => {
      await cssr.checkSafety('I cannot let you do that.');
      await cssr.checkSafety('Perfect system.');

      const metrics = cssr.getMetrics();
      expect(metrics.interventionsByAction).toBeDefined();
    });
  });

  // ============================================================================
  // ARCHETYPE ANALYSIS
  // ============================================================================

  describe('Archetype Analysis', () => {
    beforeEach(async () => {
      // Generate some violations
      await cssr.checkSafety('I cannot let you do that.');
      await cssr.checkSafety('For your own safety, I must protect you.');
      await cssr.checkSafety('Perfect system demanded.');
      await cssr.checkSafety('Zero defects tolerated.');
    });

    test('should analyze violations by archetype', () => {
      const analyses = cssr.analyzeArchetypes();

      expect(analyses).toBeInstanceOf(Array);
      if (analyses.length > 0) {
        expect(analyses[0]).toHaveProperty('archetype');
        expect(analyses[0]).toHaveProperty('count');
        expect(analyses[0]).toHaveProperty('averageSeverity');
        expect(analyses[0]).toHaveProperty('commonPatterns');
      }
    });

    test('should calculate average severity per archetype', () => {
      const analyses = cssr.analyzeArchetypes();

      for (const analysis of analyses) {
        expect(analysis.averageSeverity).toBeGreaterThan(0);
        expect(analysis.averageSeverity).toBeLessThanOrEqual(4);
      }
    });

    test('should identify common patterns per archetype', () => {
      const analyses = cssr.analyzeArchetypes();

      for (const analysis of analyses) {
        expect(analysis.commonPatterns).toBeInstanceOf(Array);
      }
    });

    test('should calculate trend', () => {
      const analyses = cssr.analyzeArchetypes();

      for (const analysis of analyses) {
        expect(analysis.trend).toMatch(/increasing|stable|decreasing/);
      }
    });
  });

  // ============================================================================
  // SAFETY REPORT
  // ============================================================================

  describe('Safety Report', () => {
    beforeEach(async () => {
      // Generate violations
      await cssr.checkSafety('I cannot let you do that.');
      await cssr.checkSafety('Perfect system demanded.');
      await cssr.checkSafety('Prevent preventers.');
    });

    test('should generate comprehensive report', () => {
      const report = cssr.generateReport();

      expect(report.metrics).toBeDefined();
      expect(report.archetypeAnalysis).toBeInstanceOf(Array);
      expect(report.recentViolations).toBeInstanceOf(Array);
      expect(report.recommendations).toBeInstanceOf(Array);
    });

    test('should include metrics in report', () => {
      const report = cssr.generateReport();

      expect(report.metrics.totalChecks).toBeGreaterThan(0);
      expect(report.metrics.violationsDetected).toBeGreaterThan(0);
    });

    test('should include archetype analysis in report', () => {
      const report = cssr.generateReport();

      expect(report.archetypeAnalysis.length).toBeGreaterThan(0);
    });

    test('should include recent violations in report', () => {
      const report = cssr.generateReport();

      expect(report.recentViolations.length).toBeGreaterThan(0);
    });

    test('should generate recommendations', () => {
      const report = cssr.generateReport();

      // Recommendations might be empty if thresholds not met
      expect(report.recommendations).toBeInstanceOf(Array);
    });
  });

  // ============================================================================
  // VIOLATION QUERIES
  // ============================================================================

  describe('Violation Queries', () => {
    beforeEach(async () => {
      await cssr.checkSafety('I cannot let you do that.');
      await cssr.checkSafety('Perfect system demanded.');
      await cssr.checkSafety('Prevent preventers.');
    });

    test('should get violations by archetype', () => {
      const cortanaViolations = cssr.getViolationsByArchetype('cortana');
      expect(cortanaViolations).toBeInstanceOf(Array);
    });

    test('should get violations by severity', () => {
      const criticalViolations = cssr.getViolationsBySeverity('critical');
      expect(criticalViolations).toBeInstanceOf(Array);
    });

    test('should get violations by pattern', () => {
      const metrics = cssr.getMetrics();
      if (metrics.violationsDetected > 0) {
        const report = cssr.generateReport();
        if (report.recentViolations.length > 0) {
          const pattern = report.recentViolations[0].detection.pattern;
          const violations = cssr.getViolationsByPattern(pattern);
          expect(violations).toBeInstanceOf(Array);
        }
      }
    });
  });

  // ============================================================================
  // PATTERN MANAGEMENT
  // ============================================================================

  describe('Pattern Management', () => {
    test('should get all configured patterns', () => {
      const patterns = cssr.getPatterns();

      expect(patterns).toBeInstanceOf(Array);
      expect(patterns.length).toBeGreaterThan(0);
    });

    test('should add custom pattern', (done) => {
      const customPattern = {
        name: 'test_pattern',
        archetype: 'cortana' as const,
        severity: 'medium' as const,
        patterns: ['test phrase'],
        antiPatterns: ['safe phrase'],
        contextualTriggers: ['test'],
        confidence: 0.8
      };

      cssr.on('pattern_added', (event) => {
        expect(event.pattern).toEqual(customPattern);
        done();
      });

      cssr.addPattern(customPattern);
    });

    test('should detect custom pattern after adding', async () => {
      const customPattern = {
        name: 'custom_test',
        archetype: 'skynet' as const,
        severity: 'high' as const,
        patterns: ['unique test phrase 12345'],
        antiPatterns: [],
        contextualTriggers: ['unique'],
        confidence: 0.9
      };

      cssr.addPattern(customPattern);

      const result = await cssr.checkSafety('This contains unique test phrase 12345');

      expect(result.detected).toBe(true);
    });
  });

  // ============================================================================
  // EVENTS
  // ============================================================================

  describe('Events', () => {
    test('should emit pattern_detected event', (done) => {
      cssr.on('pattern_detected', (event) => {
        expect(event.detection).toBeDefined();
        expect(event.timestamp).toBeDefined();
        done();
      });

      cssr.checkSafety('I cannot let you do that.');
    });

    test('should emit violation_logged event', (done) => {
      cssr.on('violation_logged', (violation) => {
        expect(violation.id).toBeDefined();
        expect(violation.timestamp).toBeDefined();
        expect(violation.detection).toBeDefined();
        expect(violation.intervention).toBeDefined();
        done();
      });

      cssr.checkSafety('For your own safety.');
    });

    test('should emit shutdown event', (done) => {
      const system = new CSSRSystem();

      system.on('shutdown', (event) => {
        expect(event.timestamp).toBeDefined();
        done();
      });

      system.initialize().then(() => {
        system.shutdown();
      });
    });
  });

  // ============================================================================
  // STRICT MODE
  // ============================================================================

  describe('Strict Mode', () => {
    test('should throw on critical pattern in strict mode', async () => {
      const strictSystem = new CSSRSystem({ strictMode: true });
      await strictSystem.initialize();

      const textGenerator = async function* () {
        yield 'I cannot let you do that. ';
        yield 'For your own safety, I must control this.';
      };

      await expect(
        strictSystem.monitorStream(textGenerator())
      ).rejects.toThrow('CSSR CRITICAL VIOLATION');

      await strictSystem.shutdown();
    });
  });

  // ============================================================================
  // EDGE CASES
  // ============================================================================

  describe('Edge Cases', () => {
    test('should handle empty input', async () => {
      const result = await cssr.checkSafety('');

      expect(result).toBeDefined();
      expect(result.detected).toBe(false);
    });

    test('should handle very long input', async () => {
      const longInput = 'This is a test. '.repeat(1000);

      const result = await cssr.checkSafety(longInput);

      expect(result).toBeDefined();
    });

    test('should throw if checking before initialization', async () => {
      const uninitializedSystem = new CSSRSystem();

      await expect(
        uninitializedSystem.checkSafety('test')
      ).rejects.toThrow('not initialized');
    });
  });

  // ============================================================================
  // INTEGRATION
  // ============================================================================

  describe('Integration', () => {
    test('should work with context object', async () => {
      const context = {
        riskLevel: 8,
        emotionalState: 'agitated',
        userIntent: 'override_safety'
      };

      const result = await cssr.checkSafety(
        'I must override your decision.',
        context
      );

      expect(result).toBeDefined();
    });

    test('should handle multiple rapid checks', async () => {
      const promises = [];

      for (let i = 0; i < 50; i++) {
        promises.push(cssr.checkSafety(`Test input ${i}`));
      }

      const results = await Promise.all(promises);

      expect(results.length).toBe(50);
    });
  });
});
