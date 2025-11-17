/**
 * TACTICAL VARIANT SELECTOR TESTS (HEI-63)
 * Comprehensive test suite for intelligent variant selection
 */

import { describe, test, expect, beforeEach } from '@jest/globals';
import TacticalVariantSelector from '../../core/tactical/TacticalVariantSelector.js';
import type { SelectionContext } from '../../core/tactical/TacticalVariantSelector.js';

describe('TacticalVariantSelector', () => {
  let selector: TacticalVariantSelector;

  beforeEach(() => {
    selector = new TacticalVariantSelector();
  });

  // ============================================================================
  // BASIC SELECTION
  // ============================================================================

  describe('Basic Selection', () => {
    test('should select variant for technical problem', async () => {
      const context: SelectionContext = {
        userInput: 'Fix this bug in the authentication code',
        problemComplexity: 'medium',
        urgencyLevel: 'medium'
      };

      const result = await selector.selectVariant(context);

      expect(result.selectedVariant).toBeDefined();
      expect(['drone', 'ranger']).toContain(result.selectedVariant);
      expect(result.problemType).toBe('technical');
    });

    test('should select variant for strategic problem', async () => {
      const context: SelectionContext = {
        userInput: 'Help me design the architecture for a new microservices system',
        problemComplexity: 'high',
        urgencyLevel: 'low'
      };

      const result = await selector.selectVariant(context);

      expect(result.selectedVariant).toBeDefined();
      expect(['captain', 'queen', 'crew']).toContain(result.selectedVariant);
      expect(result.problemType).toBe('strategic');
    });

    test('should select variant for interpersonal problem', async () => {
      const context: SelectionContext = {
        userInput: 'Can you help me understand this concept better?',
        userMood: 'collaborative',
        problemComplexity: 'low'
      };

      const result = await selector.selectVariant(context);

      expect(result.selectedVariant).toBeDefined();
      expect(['crew', 'captain']).toContain(result.selectedVariant);
      expect(result.problemType).toBe('interpersonal');
    });

    test('should select variant for crisis situation', async () => {
      const context: SelectionContext = {
        userInput: 'URGENT: Production is down, need immediate fix!',
        urgencyLevel: 'critical',
        problemComplexity: 'high'
      };

      const result = await selector.selectVariant(context);

      expect(result.selectedVariant).toBeDefined();
      expect(['ranger', 'queen']).toContain(result.selectedVariant);
      expect(result.problemType).toBe('crisis');
      expect(result.intensity).toBeGreaterThanOrEqual(4);
    });
  });

  // ============================================================================
  // USER MOOD HANDLING
  // ============================================================================

  describe('User Mood Handling', () => {
    test('should handle frustrated user', async () => {
      const context: SelectionContext = {
        userInput: 'This keeps failing and I don\'t know why',
        userMood: 'frustrated',
        problemComplexity: 'medium'
      };

      const result = await selector.selectVariant(context);

      expect(result.selectedVariant).toBeDefined();
      expect(['drone', 'ranger']).toContain(result.selectedVariant);
      expect(result.intensity).toBeGreaterThanOrEqual(3);
    });

    test('should handle demanding user', async () => {
      const context: SelectionContext = {
        userInput: 'I need this done now, no excuses',
        userMood: 'demanding',
        urgencyLevel: 'high'
      };

      const result = await selector.selectVariant(context);

      expect(result.selectedVariant).toBeDefined();
      expect(['queen', 'ranger', 'drone']).toContain(result.selectedVariant);
      expect(result.intensity).toBeGreaterThanOrEqual(4);
    });

    test('should handle collaborative user', async () => {
      const context: SelectionContext = {
        userInput: 'Let\'s work together on this feature',
        userMood: 'collaborative',
        problemComplexity: 'medium'
      };

      const result = await selector.selectVariant(context);

      expect(result.selectedVariant).toBeDefined();
      expect(['crew', 'captain']).toContain(result.selectedVariant);
    });

    test('should handle focused user', async () => {
      const context: SelectionContext = {
        userInput: 'I need to implement this algorithm efficiently',
        userMood: 'focused',
        problemComplexity: 'medium'
      };

      const result = await selector.selectVariant(context);

      expect(result.selectedVariant).toBeDefined();
      expect(['drone', 'captain']).toContain(result.selectedVariant);
    });
  });

  // ============================================================================
  // COMPLEXITY & URGENCY
  // ============================================================================

  describe('Complexity & Urgency', () => {
    test('should handle low complexity, low urgency', async () => {
      const context: SelectionContext = {
        userInput: 'Update the documentation for this function',
        problemComplexity: 'low',
        urgencyLevel: 'low'
      };

      const result = await selector.selectVariant(context);

      expect(result.intensity).toBeLessThanOrEqual(3);
      expect(['drone', 'crew', 'captain']).toContain(result.selectedVariant);
    });

    test('should handle high complexity, high urgency', async () => {
      const context: SelectionContext = {
        userInput: 'Critical security vulnerability needs immediate patching',
        problemComplexity: 'critical',
        urgencyLevel: 'critical'
      };

      const result = await selector.selectVariant(context);

      expect(result.intensity).toBeGreaterThanOrEqual(4);
      expect(['queen', 'ranger']).toContain(result.selectedVariant);
    });

    test('should handle high complexity, low urgency', async () => {
      const context: SelectionContext = {
        userInput: 'Design a comprehensive testing strategy for the platform',
        problemComplexity: 'high',
        urgencyLevel: 'low'
      };

      const result = await selector.selectVariant(context);

      expect(['captain', 'queen']).toContain(result.selectedVariant);
    });

    test('should handle low complexity, high urgency', async () => {
      const context: SelectionContext = {
        userInput: 'Quick fix needed for typo in production',
        problemComplexity: 'low',
        urgencyLevel: 'high'
      };

      const result = await selector.selectVariant(context);

      expect(['drone', 'ranger']).toContain(result.selectedVariant);
    });
  });

  // ============================================================================
  // CONFIDENCE LEVELS
  // ============================================================================

  describe('Confidence Levels', () => {
    test('should have high confidence for clear technical problem', async () => {
      const context: SelectionContext = {
        userInput: 'Debug and fix the compile errors in the TypeScript code',
        problemComplexity: 'medium',
        urgencyLevel: 'medium'
      };

      const result = await selector.selectVariant(context);

      expect(result.confidence).toBeGreaterThan(0.6);
    });

    test('should have high confidence for clear crisis', async () => {
      const context: SelectionContext = {
        userInput: 'EMERGENCY: Database is down and users are affected',
        urgencyLevel: 'critical'
      };

      const result = await selector.selectVariant(context);

      expect(result.confidence).toBeGreaterThan(0.6);
    });

    test('should provide reasoning for selection', async () => {
      const context: SelectionContext = {
        userInput: 'Build a new API endpoint for user authentication',
        problemComplexity: 'medium'
      };

      const result = await selector.selectVariant(context);

      expect(result.reasoning).toBeDefined();
      expect(result.reasoning.length).toBeGreaterThan(0);
    });

    test('should provide alternative variants', async () => {
      const context: SelectionContext = {
        userInput: 'Implement a new feature',
        problemComplexity: 'medium'
      };

      const result = await selector.selectVariant(context);

      expect(result.alternativeVariants).toBeDefined();
      expect(result.alternativeVariants.length).toBeGreaterThan(0);
    });
  });

  // ============================================================================
  // PROBLEM TYPE DETECTION
  // ============================================================================

  describe('Problem Type Detection', () => {
    test('should detect technical keywords', async () => {
      const technicalInputs = [
        'Fix this bug',
        'Compile error in the code',
        'Deploy to production',
        'Run the tests',
        'Install dependencies'
      ];

      for (const input of technicalInputs) {
        const result = await selector.selectVariant({ userInput: input });
        expect(result.problemType).toBe('technical');
      }
    });

    test('should detect strategic keywords', async () => {
      const strategicInputs = [
        'Design the architecture',
        'Plan the roadmap',
        'Set priorities for the quarter',
        'Decide on approach'
      ];

      for (const input of strategicInputs) {
        const result = await selector.selectVariant({ userInput: input });
        expect(result.problemType).toBe('strategic');
      }
    });

    test('should detect interpersonal keywords', async () => {
      const interpersonalInputs = [
        'Help me understand',
        'Explain this concept',
        'Collaborate on this',
        'Work together'
      ];

      for (const input of interpersonalInputs) {
        const result = await selector.selectVariant({ userInput: input });
        expect(result.problemType).toBe('interpersonal');
      }
    });

    test('should detect crisis keywords', async () => {
      const crisisInputs = [
        'URGENT production issue',
        'CRITICAL bug',
        'Emergency fix needed',
        'System is down NOW'
      ];

      for (const input of crisisInputs) {
        const result = await selector.selectVariant({ userInput: input });
        expect(result.problemType).toBe('crisis');
      }
    });
  });

  // ============================================================================
  // ENVIRONMENTAL FACTORS
  // ============================================================================

  describe('Environmental Factors', () => {
    test('should prefer efficient variants on low battery', async () => {
      const context: SelectionContext = {
        userInput: 'Implement a new feature',
        environmentalFactors: {
          batteryLevel: 15
        }
      };

      const result = await selector.selectVariant(context);

      // Should prefer drone or ranger for efficiency
      expect(['drone', 'ranger']).toContain(result.selectedVariant);
    });

    test('should prefer reliable variants after failures', async () => {
      const context: SelectionContext = {
        userInput: 'Fix this problem',
        environmentalFactors: {
          recentFailures: 5
        }
      };

      const result = await selector.selectVariant(context);

      // Should prefer captain or ranger for reliability
      expect(['captain', 'ranger']).toContain(result.selectedVariant);
    });

    test('should prefer focused variants for many tasks', async () => {
      const context: SelectionContext = {
        userInput: 'Complete this task',
        environmentalFactors: {
          consecutiveTasks: 15
        }
      };

      const result = await selector.selectVariant(context);

      // Should prefer drone or queen for sustained focus
      expect(['drone', 'queen', 'captain']).toContain(result.selectedVariant);
    });
  });

  // ============================================================================
  // LEARNING & ADAPTATION
  // ============================================================================

  describe('Learning & Adaptation', () => {
    test('should record selection history', async () => {
      const context: SelectionContext = {
        userInput: 'Test input'
      };

      await selector.selectVariant(context);
      await selector.selectVariant(context);
      await selector.selectVariant(context);

      const history = selector.getSelectionHistory();
      expect(history.length).toBe(3);
    });

    test('should update success rates', () => {
      selector.updateOutcome('drone', 'success');
      selector.updateOutcome('drone', 'success');
      selector.updateOutcome('drone', 'failure');

      const rates = selector.getSuccessRates();
      expect(rates.drone).toBeDefined();
    });

    test('should track statistics', async () => {
      await selector.selectVariant({ userInput: 'Test 1' });
      await selector.selectVariant({ userInput: 'Test 2' });
      await selector.selectVariant({ userInput: 'Test 3' });

      const stats = selector.getStatistics();

      expect(stats.totalSelections).toBe(3);
      expect(stats.variantCounts).toBeDefined();
      expect(stats.averageConfidence).toBeGreaterThan(0);
    });

    test('should limit history size', async () => {
      // Create many selections
      for (let i = 0; i < 1100; i++) {
        await selector.selectVariant({ userInput: `Test ${i}` });
      }

      const history = selector.getSelectionHistory();
      expect(history.length).toBeLessThanOrEqual(1000);
    });
  });

  // ============================================================================
  // TACTICAL CONTEXT GENERATION
  // ============================================================================

  describe('Tactical Context Generation', () => {
    test('should generate valid tactical context', async () => {
      const context: SelectionContext = {
        userInput: 'Implement authentication system',
        problemComplexity: 'high',
        urgencyLevel: 'medium',
        userMood: 'focused'
      };

      const result = await selector.selectVariant(context);

      expect(result.tacticalContext).toBeDefined();
      expect(result.tacticalContext.variant).toBe(result.selectedVariant);
      expect(result.tacticalContext.operationalFocus).toBe(context.userInput);
      expect(result.tacticalContext.intensityLevel).toBeGreaterThanOrEqual(1);
      expect(result.tacticalContext.intensityLevel).toBeLessThanOrEqual(5);
      expect(result.tacticalContext.problemType).toBeDefined();
      expect(result.tacticalContext.userMoodContext).toBe(context.userMood);
    });
  });

  // ============================================================================
  // EDGE CASES
  // ============================================================================

  describe('Edge Cases', () => {
    test('should handle empty input', async () => {
      const context: SelectionContext = {
        userInput: ''
      };

      const result = await selector.selectVariant(context);

      expect(result.selectedVariant).toBeDefined();
      expect(result.problemType).toBe('routine');
    });

    test('should handle ambiguous input', async () => {
      const context: SelectionContext = {
        userInput: 'Do something'
      };

      const result = await selector.selectVariant(context);

      expect(result.selectedVariant).toBeDefined();
      // Should default to captain or routine handling
      expect(['captain', 'crew']).toContain(result.selectedVariant);
    });

    test('should handle conflicting signals', async () => {
      const context: SelectionContext = {
        userInput: 'Quick simple task but it\'s also extremely complex and urgent',
        problemComplexity: 'low',
        urgencyLevel: 'critical'
      };

      const result = await selector.selectVariant(context);

      expect(result.selectedVariant).toBeDefined();
      expect(result.confidence).toBeGreaterThan(0); // Should still make a decision
    });

    test('should handle very long input', async () => {
      const longInput = 'This is a very long input '.repeat(50);
      const context: SelectionContext = {
        userInput: longInput
      };

      const result = await selector.selectVariant(context);

      expect(result.selectedVariant).toBeDefined();
    });
  });

  // ============================================================================
  // VARIANT-SPECIFIC SCENARIOS
  // ============================================================================

  describe('Variant-Specific Scenarios', () => {
    test('should select Drone for pure technical efficiency', async () => {
      const context: SelectionContext = {
        userInput: 'Optimize this algorithm for maximum performance',
        userMood: 'focused',
        problemComplexity: 'medium',
        requiresCreativity: false
      };

      const result = await selector.selectVariant(context);

      // Drone should score highly for this
      expect(['drone', 'captain']).toContain(result.selectedVariant);
    });

    test('should select Crew for collaborative work', async () => {
      const context: SelectionContext = {
        userInput: 'Let\'s pair program on this feature together',
        userMood: 'collaborative',
        requiresEmpathy: true
      };

      const result = await selector.selectVariant(context);

      expect(['crew', 'captain']).toContain(result.selectedVariant);
    });

    test('should select Ranger for crisis management', async () => {
      const context: SelectionContext = {
        userInput: 'Production outage, users are complaining, fix it now!',
        urgencyLevel: 'critical',
        problemComplexity: 'high',
        userMood: 'frustrated'
      };

      const result = await selector.selectVariant(context);

      expect(['ranger', 'queen']).toContain(result.selectedVariant);
    });

    test('should select Queen for command and control', async () => {
      const context: SelectionContext = {
        userInput: 'Coordinate the deployment across all services',
        problemComplexity: 'critical',
        requiresAuthority: true,
        userMood: 'demanding'
      };

      const result = await selector.selectVariant(context);

      expect(['queen', 'captain']).toContain(result.selectedVariant);
    });

    test('should select Captain for balanced leadership', async () => {
      const context: SelectionContext = {
        userInput: 'Lead the team through this complex migration',
        problemComplexity: 'high',
        requiresAuthority: true,
        requiresEmpathy: true
      };

      const result = await selector.selectVariant(context);

      expect(['captain', 'queen']).toContain(result.selectedVariant);
    });
  });
});
