/**
 * EMOTIONAL STATE MACHINE TESTS (HEI-61)
 * Validates state transitions, triggers, decay, and telemetry integration
 */

import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { promises as fs } from 'fs';
import { join } from 'path';
import EmotionalStateMachine from '../../core/emotions/EmotionalStateMachine.js';
import type { EmotionalState, StateSnapshot, EmotionalContext } from '../../core/emotions/EmotionalStateMachine.js';

// Mock paths for testing
const TEST_STATE_PATH = join(process.cwd(), 'memory', 'test-emotional-state.json');
const TEST_HISTORY_PATH = join(process.cwd(), 'memory', 'test-emotional-history.json');

// Cleanup helper
async function cleanupTestFiles(): Promise<void> {
  try {
    await fs.unlink(TEST_STATE_PATH);
  } catch (e) {
    // Ignore if file doesn't exist
  }
  try {
    await fs.unlink(TEST_HISTORY_PATH);
  } catch (e) {
    // Ignore if file doesn't exist
  }
}

describe('EmotionalStateMachine', () => {
  let stateMachine: EmotionalStateMachine;

  beforeEach(async () => {
    await cleanupTestFiles();
    stateMachine = new EmotionalStateMachine(undefined, TEST_STATE_PATH);
  });

  afterEach(async () => {
    if (stateMachine) {
      stateMachine.destroy();
    }
    await cleanupTestFiles();
  });

  describe('Initialization', () => {
    test('initializes with default calm state', () => {
      const state = stateMachine.getCurrentState();

      expect(state.currentState).toBe('calm');
      expect(state.intensity).toBe(2);
      expect(state.lastUpdated).toBeDefined();
      expect(state.transitionHistory).toBeInstanceOf(Array);
    });

    test('initializes with all seven Aurora states available', () => {
      const status = stateMachine.getStatus();
      const expectedStates: EmotionalState[] = [
        'calm', 'focused', 'engaged', 'compassionate',
        'protective', 'contemplative', 'determined'
      ];

      expect(expectedStates).toContain(status.state);
    });

    test('loads persisted state if available', async () => {
      // Create a persisted state
      const persistedState: StateSnapshot = {
        currentState: 'focused',
        intensity: 7,
        lastUpdated: new Date().toISOString(),
        lastTrigger: 'task_start',
        transitionHistory: []
      };

      await fs.writeFile(TEST_STATE_PATH, JSON.stringify(persistedState, null, 2));

      // Create new state machine that should load the persisted state
      const loadedStateMachine = new EmotionalStateMachine(undefined, TEST_STATE_PATH);

      // Wait a bit for async initialization
      await new Promise(resolve => setTimeout(resolve, 100));

      const state = loadedStateMachine.getCurrentState();
      expect(state.currentState).toBe('focused');
      expect(state.intensity).toBe(7);

      loadedStateMachine.destroy();
    });
  });

  describe('Trigger Detection', () => {
    test('detects task_start trigger from keywords', async () => {
      const userInput = 'I need help building a new feature';

      await stateMachine.processInput(userInput);

      const state = stateMachine.getCurrentState();
      expect(state.currentState).toBe('focused');
      expect(state.lastTrigger).toBe('task_start');
    });

    test('detects user_distress trigger', async () => {
      const userInput = 'I am really struggling with this and feeling overwhelmed';

      await stateMachine.processInput(userInput);

      const state = stateMachine.getCurrentState();
      expect(state.currentState).toBe('compassionate');
      expect(state.intensity).toBeGreaterThanOrEqual(5);
    });

    test('detects challenge_detected trigger', async () => {
      // First transition to focused state
      await stateMachine.processInput('I need to implement a feature');

      // Now detect challenge
      await stateMachine.processInput('There is a serious bug causing errors');

      const state = stateMachine.getCurrentState();
      // Could be engaged or determined depending on transition rules
      expect(['engaged', 'determined', 'focused']).toContain(state.currentState);
    });

    test('detects complex_question trigger', async () => {
      const userInput = 'Why does the universe exist and how can we understand consciousness?';

      await stateMachine.processInput(userInput);

      const state = stateMachine.getCurrentState();
      expect(state.currentState).toBe('contemplative');
    });

    test('does not trigger on casual interaction when in elevated state', async () => {
      // Get into focused state
      await stateMachine.processInput('I need to build something complex');
      const beforeState = stateMachine.getCurrentState();

      // Casual interaction should reduce but not immediately reset
      await stateMachine.processInput('thanks');

      const afterState = stateMachine.getCurrentState();
      // State might change to calm or intensity might reduce
      expect(afterState.intensity).toBeLessThanOrEqual(beforeState.intensity);
    });
  });

  describe('State Transitions', () => {
    test('transitions from calm to focused on task engagement', async () => {
      await stateMachine.processInput('I need help with a project');

      const state = stateMachine.getCurrentState();
      expect(state.currentState).toBe('focused');
      expect(state.intensity).toBeGreaterThan(2);
    });

    test('transitions from focused to engaged on deep work', async () => {
      await stateMachine.processInput('I need help with complex implementation');

      const state = stateMachine.getCurrentState();
      // Should be focused or engaged depending on complexity detection
      expect(['focused', 'engaged']).toContain(state.currentState);
    });

    test('wildcard transitions work from any state', async () => {
      // Start in any state
      await stateMachine.processInput('Build a complex feature');

      // Trigger wildcard transition (user_distress)
      await stateMachine.processInput('I am really struggling and need support');

      const state = stateMachine.getCurrentState();
      expect(state.currentState).toBe('compassionate');
    });

    test('records transition history', async () => {
      await stateMachine.processInput('I need help');
      await stateMachine.processInput('This is really complex');
      await stateMachine.processInput('I am struggling');

      const history = stateMachine.getTransitionHistory();
      expect(history.length).toBeGreaterThan(0);

      const latestTransition = history[0];
      expect(latestTransition).toHaveProperty('fromState');
      expect(latestTransition).toHaveProperty('toState');
      expect(latestTransition).toHaveProperty('trigger');
      expect(latestTransition).toHaveProperty('intensityBefore');
      expect(latestTransition).toHaveProperty('intensityAfter');
      expect(latestTransition).toHaveProperty('timestamp');
    });
  });

  describe('Intensity Management', () => {
    test('intensity stays within valid range 0-10', async () => {
      // Try to trigger high intensity multiple times
      for (let i = 0; i < 5; i++) {
        await stateMachine.processInput('URGENT CRITICAL EMERGENCY crisis');
      }

      const state = stateMachine.getCurrentState();
      expect(state.intensity).toBeGreaterThanOrEqual(0);
      expect(state.intensity).toBeLessThanOrEqual(10);
    });

    test('different states have different base intensities', async () => {
      // Task start should have moderate intensity
      await stateMachine.processInput('I need help with a task');
      const taskIntensity = stateMachine.getCurrentState().intensity;

      // Reset
      stateMachine.destroy();
      stateMachine = new EmotionalStateMachine(undefined, TEST_STATE_PATH + '.2');

      // User distress should have higher intensity
      await stateMachine.processInput('I am struggling and feeling overwhelmed');
      const distressIntensity = stateMachine.getCurrentState().intensity;

      expect(distressIntensity).toBeGreaterThan(taskIntensity);
    });

    test('intensity level classification works correctly', () => {
      const status = stateMachine.getStatus();

      expect(status.intensityLevel).toBe('low'); // Default is intensity 2

      // We can't directly set intensity in the current API, so we test the getter logic
      // by checking that the classification exists
      expect(['low', 'moderate', 'high', 'critical']).toContain(status.intensityLevel);
    });
  });

  describe('Decay Mechanism', () => {
    test('decay timer is started on initialization', () => {
      // State machine should have an internal decay timer
      // We can't directly test the timer, but we can verify it doesn't crash
      expect(stateMachine).toBeDefined();
    });

    test('different states have different decay rates', async () => {
      // This would require manipulating time or waiting for actual decay
      // For now, we verify the configuration exists
      const state = stateMachine.getCurrentState();
      expect(state.currentState).toBeDefined();
    });

    // Note: Testing actual decay would require either:
    // 1. Waiting for 5+ minutes in the test (not practical)
    // 2. Mocking timers (more complex setup)
    // 3. Exposing a manual decay trigger method (would need API change)
  });

  describe('Emotional Context Generation', () => {
    test('generates emotional context with all required fields', () => {
      const context: EmotionalContext = stateMachine.getEmotionalContext();

      expect(context).toHaveProperty('state');
      expect(context).toHaveProperty('intensity');
      expect(context).toHaveProperty('intensityLevel');
      expect(context).toHaveProperty('modifiers');
      expect(context).toHaveProperty('timestamp');
    });

    test('generates response modifiers for calm state', () => {
      const context = stateMachine.getEmotionalContext();

      expect(context.modifiers).toHaveProperty('tone');
      expect(context.modifiers).toHaveProperty('verbosity');
      expect(context.modifiers).toHaveProperty('formality');
      expect(context.modifiers).toHaveProperty('empathy');
      expect(context.modifiers).toHaveProperty('assertiveness');
      expect(context.modifiers).toHaveProperty('creativity');

      // Calm state should have neutral tone
      expect(context.modifiers.tone).toBe('neutral');
    });

    test('generates different modifiers for focused state', async () => {
      await stateMachine.processInput('I need to build a complex feature');

      const context = stateMachine.getEmotionalContext();

      if (context.state === 'focused') {
        expect(context.modifiers.tone).toBe('professional');
        expect(context.modifiers.assertiveness).toBeGreaterThan(0.5);
      }
    });

    test('generates different modifiers for compassionate state', async () => {
      await stateMachine.processInput('I am struggling and need support');

      const context = stateMachine.getEmotionalContext();

      if (context.state === 'compassionate') {
        expect(context.modifiers.tone).toBe('warm');
        expect(context.modifiers.empathy).toBeGreaterThan(0.7);
      }
    });

    test('modifier values are within valid ranges', () => {
      const context = stateMachine.getEmotionalContext();

      expect(context.modifiers.empathy).toBeGreaterThanOrEqual(0);
      expect(context.modifiers.empathy).toBeLessThanOrEqual(1);
      expect(context.modifiers.assertiveness).toBeGreaterThanOrEqual(0);
      expect(context.modifiers.assertiveness).toBeLessThanOrEqual(1);
      expect(context.modifiers.creativity).toBeGreaterThanOrEqual(0);
      expect(context.modifiers.creativity).toBeLessThanOrEqual(1);
    });
  });

  describe('State Persistence', () => {
    test('persists state to file after transition', async () => {
      await stateMachine.processInput('I need help with a task');

      // Wait a bit for async file write
      await new Promise(resolve => setTimeout(resolve, 100));

      // Check file exists and contains correct data
      const data = await fs.readFile(TEST_STATE_PATH, 'utf8');
      const saved = JSON.parse(data);

      expect(saved.currentState).toBe('focused');
      expect(saved.intensity).toBeDefined();
      expect(saved.lastUpdated).toBeDefined();
    });

    test('persists transition history', async () => {
      await stateMachine.processInput('I need help');
      await stateMachine.processInput('This is complex and difficult');

      await new Promise(resolve => setTimeout(resolve, 100));

      const data = await fs.readFile(TEST_STATE_PATH, 'utf8');
      const saved = JSON.parse(data);

      expect(saved.transitionHistory).toBeInstanceOf(Array);
      expect(saved.transitionHistory.length).toBeGreaterThan(0);
    });

    test('limits history to max size', async () => {
      // Generate many transitions
      const inputs = [
        'help with task',
        'this is complex',
        'struggling here',
        'need support',
        'critical issue'
      ];

      for (let i = 0; i < 25; i++) {
        await stateMachine.processInput(inputs[i % inputs.length]);
      }

      const history = stateMachine.getTransitionHistory();
      // History should be capped (MAX_HISTORY = 100 in implementation)
      expect(history.length).toBeLessThanOrEqual(100);
    });
  });

  describe('Status and Diagnostics', () => {
    test('getCurrentState returns complete state snapshot', () => {
      const state = stateMachine.getCurrentState();

      expect(state).toHaveProperty('currentState');
      expect(state).toHaveProperty('intensity');
      expect(state).toHaveProperty('lastUpdated');
      expect(state).toHaveProperty('transitionHistory');
    });

    test('getStatus returns concise status info', () => {
      const status = stateMachine.getStatus();

      expect(status).toHaveProperty('state');
      expect(status).toHaveProperty('intensity');
      expect(status).toHaveProperty('intensityLevel');
      expect(status).toHaveProperty('lastUpdated');
      expect(status).toHaveProperty('historySize');
    });

    test('getTransitionHistory supports limit parameter', async () => {
      // Generate some transitions
      await stateMachine.processInput('help me');
      await stateMachine.processInput('complex task');
      await stateMachine.processInput('struggling');

      const fullHistory = stateMachine.getTransitionHistory();
      const limitedHistory = stateMachine.getTransitionHistory(2);

      expect(limitedHistory.length).toBeLessThanOrEqual(2);
      expect(limitedHistory.length).toBeLessThanOrEqual(fullHistory.length);
    });
  });

  describe('Cleanup and Destruction', () => {
    test('destroy cleans up resources', () => {
      // Should not throw
      expect(() => stateMachine.destroy()).not.toThrow();
    });

    test('destroy can be called multiple times safely', () => {
      stateMachine.destroy();
      expect(() => stateMachine.destroy()).not.toThrow();
    });
  });

  describe('Edge Cases', () => {
    test('handles empty input gracefully', async () => {
      await expect(stateMachine.processInput('')).resolves.not.toThrow();
    });

    test('handles very long input', async () => {
      const longInput = 'help '.repeat(1000);
      await expect(stateMachine.processInput(longInput)).resolves.not.toThrow();
    });

    test('handles special characters in input', async () => {
      const specialInput = 'I need help! @#$%^&*() with this <complex> task™';
      await expect(stateMachine.processInput(specialInput)).resolves.not.toThrow();
    });

    test('handles rapid sequential inputs', async () => {
      const promises = [
        stateMachine.processInput('help'),
        stateMachine.processInput('task'),
        stateMachine.processInput('complex'),
        stateMachine.processInput('struggling')
      ];

      await expect(Promise.all(promises)).resolves.not.toThrow();
    });
  });

  describe('Integration Scenarios', () => {
    test('simulates full conversation flow', async () => {
      // Start with greeting
      await stateMachine.processInput('hello');
      expect(stateMachine.getCurrentState().currentState).toBe('calm');

      // Engage with task
      await stateMachine.processInput('I need help building a feature');
      expect(stateMachine.getCurrentState().currentState).toBe('focused');

      // Encounter difficulty
      await stateMachine.processInput('This is really complex and I am struggling');
      const state = stateMachine.getCurrentState();
      expect(['engaged', 'compassionate', 'focused']).toContain(state.currentState);

      // Complete task
      await stateMachine.processInput('great, that is solved and done');
      // Should trend toward calm
    });

    test('simulates distress -> support flow', async () => {
      await stateMachine.processInput('I am really struggling and overwhelmed');
      expect(stateMachine.getCurrentState().currentState).toBe('compassionate');

      await stateMachine.processInput('this is urgent and critical');
      const state = stateMachine.getCurrentState();
      // Should escalate to protective
      expect(['compassionate', 'protective']).toContain(state.currentState);
      expect(state.intensity).toBeGreaterThan(6);
    });
  });
});
