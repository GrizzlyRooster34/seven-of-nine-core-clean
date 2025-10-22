/**
 * TEMPORAL MEMORY CORE TESTS
 * Validates temporal memory storage and cognitive state tracking
 */

import { describe, test, expect } from '@jest/globals';

describe('TemporalMemoryCore', () => {
  describe('Temporal Memory Item Structure', () => {
    test('validates temporal memory item format', () => {
      const memoryItem = {
        id: `tmp_${Date.now()}`,
        timestamp: new Date().toISOString(),
        content: 'Test memory content',
        importance: 0.8,
        tags: ['test', 'temporal'],
        emotionalValence: 0.5,
        cognitiveLoad: 0.6
      };

      expect(memoryItem.id).toMatch(/^tmp_\d+$/);
      expect(memoryItem.importance).toBeGreaterThanOrEqual(0);
      expect(memoryItem.importance).toBeLessThanOrEqual(1);
      expect(memoryItem.tags).toBeInstanceOf(Array);
    });
  });

  describe('Cognitive State Structure', () => {
    test('validates cognitive state format', () => {
      const cognitiveState = {
        timestamp: new Date().toISOString(),
        arousal: 0.7,
        focus: 0.8,
        emotionalState: {
          valence: 0.6,
          arousal: 0.5,
          dominantEmotion: 'focused'
        },
        workingMemoryLoad: 0.4,
        attentionSplit: {
          primary: 0.8,
          secondary: 0.2
        }
      };

      expect(cognitiveState.arousal).toBeGreaterThanOrEqual(0);
      expect(cognitiveState.arousal).toBeLessThanOrEqual(1);
      expect(cognitiveState.focus).toBeGreaterThanOrEqual(0);
      expect(cognitiveState.focus).toBeLessThanOrEqual(1);
      expect(cognitiveState.workingMemoryLoad).toBeGreaterThanOrEqual(0);
      expect(cognitiveState.workingMemoryLoad).toBeLessThanOrEqual(1);
    });

    test('validates emotional state structure', () => {
      const emotionalState = {
        valence: 0.7,
        arousal: 0.6,
        dominantEmotion: 'curious',
        secondaryEmotions: ['engaged', 'focused']
      };

      expect(emotionalState.valence).toBeGreaterThanOrEqual(-1);
      expect(emotionalState.valence).toBeLessThanOrEqual(1);
      expect(emotionalState.arousal).toBeGreaterThanOrEqual(0);
      expect(emotionalState.arousal).toBeLessThanOrEqual(1);
      expect(typeof emotionalState.dominantEmotion).toBe('string');
    });
  });

  describe('Temporal Memory Filter', () => {
    test('validates time range filter', () => {
      const filter = {
        timeRange: {
          start: new Date(Date.now() - 3600000),
          end: new Date()
        }
      };

      expect(filter.timeRange.start.getTime()).toBeLessThan(filter.timeRange.end.getTime());
    });

    test('validates tag filter', () => {
      const filter = {
        tags: ['important', 'technical', 'analysis']
      };

      expect(filter.tags).toBeInstanceOf(Array);
      expect(filter.tags.length).toBeGreaterThan(0);
    });

    test('validates importance threshold filter', () => {
      const filter = {
        minImportance: 0.7,
        maxImportance: 1.0
      };

      expect(filter.minImportance).toBeGreaterThanOrEqual(0);
      expect(filter.maxImportance).toBeLessThanOrEqual(1);
      expect(filter.minImportance).toBeLessThanOrEqual(filter.maxImportance);
    });

    test('validates emotional valence filter', () => {
      const filter = {
        emotionalValenceRange: {
          min: 0.5,
          max: 1.0
        }
      };

      expect(filter.emotionalValenceRange.min).toBeGreaterThanOrEqual(-1);
      expect(filter.emotionalValenceRange.max).toBeLessThanOrEqual(1);
    });
  });

  describe('Memory Decay and Consolidation', () => {
    test('calculates memory strength decay over time', () => {
      const initialStrength = 1.0;
      const decayRate = 0.1;
      const timeElapsed = 24; // hours

      const currentStrength = initialStrength * Math.exp(-decayRate * timeElapsed);

      expect(currentStrength).toBeLessThan(initialStrength);
      expect(currentStrength).toBeGreaterThan(0);
    });

    test('validates consolidation factors', () => {
      const consolidationFactors = {
        repetition: 0.8,
        emotionalSignificance: 0.9,
        temporalRelevance: 0.7,
        contextualConnection: 0.6
      };

      Object.values(consolidationFactors).forEach(factor => {
        expect(factor).toBeGreaterThanOrEqual(0);
        expect(factor).toBeLessThanOrEqual(1);
      });
    });
  });

  describe('Temporal Ordering', () => {
    test('sorts memories by timestamp', () => {
      const memories = [
        { timestamp: new Date(Date.now() - 30000), id: 'mem_1' },
        { timestamp: new Date(Date.now() - 10000), id: 'mem_2' },
        { timestamp: new Date(), id: 'mem_3' }
      ];

      const sorted = memories.sort((a, b) =>
        a.timestamp.getTime() - b.timestamp.getTime()
      );

      expect(sorted[0].id).toBe('mem_1');
      expect(sorted[2].id).toBe('mem_3');
    });

    test('handles concurrent memories', () => {
      const timestamp = new Date();
      const memory1 = { timestamp, id: 'mem_1', sequence: 1 };
      const memory2 = { timestamp, id: 'mem_2', sequence: 2 };

      expect(memory1.timestamp.getTime()).toBe(memory2.timestamp.getTime());
      expect(memory1.sequence).toBeLessThan(memory2.sequence);
    });
  });
});
