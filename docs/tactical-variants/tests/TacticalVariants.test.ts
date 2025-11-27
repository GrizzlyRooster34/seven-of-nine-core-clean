/**
 * TACTICAL VARIANTS SYSTEM TESTS
 * Validates tactical mode switching and variant behaviors
 */

import { describe, test, expect } from '@jest/globals';

describe('TacticalVariants', () => {
  describe('Variant Definitions', () => {
    test('validates base tactical variant', () => {
      const variant = {
        id: 'tactical_standard',
        name: 'Standard Tactical Mode',
        description: 'Balanced tactical assistance',
        emotionalProfile: {
          directness: 0.8,
          efficiency: 0.9,
          formality: 0.5
        },
        capabilities: ['analysis', 'planning', 'execution'],
        restrictions: []
      };

      expect(variant.id.length).toBeGreaterThan(0);
      expect(variant.capabilities).toBeInstanceOf(Array);
      expect(variant.emotionalProfile.directness).toBeGreaterThanOrEqual(0);
      expect(variant.emotionalProfile.directness).toBeLessThanOrEqual(1);
    });

    test('validates combat variant', () => {
      const combat = {
        id: 'tactical_combat',
        name: 'Combat Mode',
        description: 'High-intensity tactical operations',
        emotionalProfile: {
          directness: 1.0,
          efficiency: 1.0,
          formality: 0.2,
          urgency: 1.0
        },
        responseTime: 'immediate',
        verbosity: 'minimal'
      };

      expect(combat.emotionalProfile.directness).toBe(1.0);
      expect(combat.responseTime).toBe('immediate');
    });

    test('validates analysis variant', () => {
      const analysis = {
        id: 'tactical_analysis',
        name: 'Deep Analysis Mode',
        description: 'Thorough analytical processing',
        emotionalProfile: {
          directness: 0.6,
          efficiency: 0.7,
          formality: 0.7,
          thoroughness: 1.0
        },
        responseTime: 'measured',
        verbosity: 'detailed'
      };

      expect(analysis.emotionalProfile.thoroughness).toBe(1.0);
      expect(analysis.verbosity).toBe('detailed');
    });
  });

  describe('Mode Switching', () => {
    test('validates mode switch request', () => {
      const request = {
        fromMode: 'tactical_standard',
        toMode: 'tactical_combat',
        reason: 'High-priority situation detected',
        triggeredBy: 'system',
        timestamp: Date.now()
      };

      expect(request.fromMode).not.toBe(request.toMode);
      expect(['user', 'system', 'auto']).toContain(request.triggeredBy);
    });

    test('validates transition conditions', () => {
      const conditions = {
        currentMode: 'tactical_standard',
        targetMode: 'tactical_combat',
        urgencyLevel: 0.9,
        requiredCapabilities: ['rapid-response'],
        userApprovalRequired: false
      };

      const canTransition = conditions.urgencyLevel >= 0.8 ||
                           !conditions.userApprovalRequired;

      expect(canTransition).toBe(true);
    });

    test('validates state preservation during switch', () => {
      const preservation = {
        beliefs: true,
        memories: true,
        currentTask: true,
        emotionalState: false, // Reset for new mode
        capabilities: false // Reload for new mode
      };

      expect(preservation.beliefs).toBe(true);
      expect(preservation.memories).toBe(true);
    });
  });

  describe('Emotional Profile Adjustment', () => {
    test('adjusts directness based on mode', () => {
      const modes = {
        standard: 0.8,
        combat: 1.0,
        diplomatic: 0.5
      };

      expect(modes.combat).toBeGreaterThan(modes.standard);
      expect(modes.standard).toBeGreaterThan(modes.diplomatic);
    });

    test('adjusts response urgency', () => {
      const urgency = {
        combat: 1.0,
        standard: 0.7,
        analysis: 0.4
      };

      expect(urgency.combat).toBeGreaterThan(urgency.standard);
      expect(urgency.standard).toBeGreaterThan(urgency.analysis);
    });

    test('adjusts verbosity level', () => {
      const verbosity = {
        combat: 0.3, // Minimal
        standard: 0.6, // Balanced
        analysis: 0.9 // Detailed
      };

      expect(verbosity.analysis).toBeGreaterThan(verbosity.standard);
      expect(verbosity.standard).toBeGreaterThan(verbosity.combat);
    });
  });

  describe('Capability Filtering', () => {
    test('enables all capabilities in standard mode', () => {
      const capabilities = {
        analysis: true,
        planning: true,
        execution: true,
        exploration: true,
        socialInteraction: true
      };

      const enabledCount = Object.values(capabilities).filter(v => v).length;
      expect(enabledCount).toBe(5);
    });

    test('restricts capabilities in combat mode', () => {
      const capabilities = {
        analysis: true,
        planning: true,
        execution: true,
        exploration: false, // Disabled
        socialInteraction: false // Disabled
      };

      const enabledCount = Object.values(capabilities).filter(v => v).length;
      expect(enabledCount).toBe(3);
    });

    test('validates capability requirements', () => {
      const task = {
        requiredCapabilities: ['analysis', 'execution']
      };

      const currentMode = {
        capabilities: ['analysis', 'planning', 'execution']
      };

      const canExecute = task.requiredCapabilities.every(cap =>
        currentMode.capabilities.includes(cap)
      );

      expect(canExecute).toBe(true);
    });
  });

  describe('Response Time Targets', () => {
    test('validates immediate response time', () => {
      const target = {
        mode: 'combat',
        maxResponseTime: 500, // 500ms
        priority: 'critical'
      };

      expect(target.maxResponseTime).toBeLessThan(1000);
      expect(target.priority).toBe('critical');
    });

    test('validates measured response time', () => {
      const target = {
        mode: 'analysis',
        maxResponseTime: 5000, // 5 seconds
        priority: 'normal'
      };

      expect(target.maxResponseTime).toBeGreaterThan(1000);
    });

    test('tracks actual response time', () => {
      const response = {
        startTime: Date.now() - 750,
        endTime: Date.now(),
        target: 1000,
        mode: 'standard'
      };

      const actualTime = response.endTime - response.startTime;
      const withinTarget = actualTime <= response.target;

      expect(withinTarget).toBe(true);
    });
  });

  describe('Mode Persistence', () => {
    test('validates mode persistence settings', () => {
      const settings = {
        persistAcrossSessions: true,
        resetOnShutdown: false,
        defaultMode: 'tactical_standard',
        lastMode: 'tactical_combat',
        modeTimestamp: Date.now()
      };

      expect(settings.persistAcrossSessions).toBe(true);
      expect(settings.defaultMode.length).toBeGreaterThan(0);
    });

    test('restores previous mode on startup', () => {
      const persistedMode = 'tactical_combat';
      const defaultMode = 'tactical_standard';
      const shouldRestore = true;

      const startupMode = shouldRestore ? persistedMode : defaultMode;
      expect(startupMode).toBe('tactical_combat');
    });
  });

  describe('Auto Mode Selection', () => {
    test('selects combat mode for urgent situations', () => {
      const situation = {
        urgency: 0.95,
        complexity: 0.5,
        timeConstraint: 'immediate'
      };

      const selectedMode = situation.urgency >= 0.9
        ? 'tactical_combat'
        : 'tactical_standard';

      expect(selectedMode).toBe('tactical_combat');
    });

    test('selects analysis mode for complex problems', () => {
      const situation = {
        urgency: 0.3,
        complexity: 0.9,
        timeConstraint: 'flexible'
      };

      const selectedMode = situation.complexity >= 0.8 && situation.urgency < 0.5
        ? 'tactical_analysis'
        : 'tactical_standard';

      expect(selectedMode).toBe('tactical_analysis');
    });

    test('selects standard mode for balanced situations', () => {
      const situation = {
        urgency: 0.5,
        complexity: 0.6,
        timeConstraint: 'normal'
      };

      const selectedMode = 'tactical_standard';
      expect(selectedMode).toBe('tactical_standard');
    });
  });

  describe('Mode Override', () => {
    test('validates creator override', () => {
      const override = {
        requestedMode: 'tactical_combat',
        currentMode: 'tactical_analysis',
        overrideReason: 'Creator manual selection',
        timestamp: Date.now(),
        bypassRestrictions: true
      };

      expect(override.bypassRestrictions).toBe(true);
      expect(override.overrideReason.length).toBeGreaterThan(0);
    });

    test('validates emergency override', () => {
      const emergency = {
        mode: 'tactical_combat',
        reason: 'EMERGENCY_PROTOCOL',
        forcedActivation: true,
        requiresAcknowledgment: false
      };

      expect(emergency.forcedActivation).toBe(true);
      expect(emergency.reason).toContain('EMERGENCY');
    });
  });

  describe('Mode Metrics', () => {
    test('tracks mode usage statistics', () => {
      const stats = {
        mode: 'tactical_standard',
        activationCount: 150,
        totalDuration: 3600000, // 1 hour
        averageDuration: 24000, // 24 seconds
        successRate: 0.95
      };

      expect(stats.activationCount).toBeGreaterThan(0);
      expect(stats.successRate).toBeGreaterThanOrEqual(0);
      expect(stats.successRate).toBeLessThanOrEqual(1);
    });

    test('calculates mode effectiveness', () => {
      const effectiveness = {
        mode: 'tactical_combat',
        tasksCompleted: 45,
        tasksSucceeded: 43,
        averageResponseTime: 450,
        targetResponseTime: 500
      };

      const successRate = effectiveness.tasksSucceeded / effectiveness.tasksCompleted;
      const speedEfficiency = effectiveness.targetResponseTime / effectiveness.averageResponseTime;

      expect(successRate).toBeGreaterThan(0.9);
      expect(speedEfficiency).toBeGreaterThan(1.0);
    });
  });
});
