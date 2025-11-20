/**
 * MEMORY ENGINE V3 TESTS
 * Validates temporal memory storage, recall, and context management
 */

import { MemoryEngineV3, MemoryV3Item } from '../../memory-v3-amalgum/MemoryEngineV3';

describe('MemoryEngineV3', () => {
  let memoryEngine: MemoryEngineV3;

  beforeEach(() => {
    memoryEngine = new MemoryEngineV3();
  });

  describe('Memory Storage', () => {
    test('stores memory with auto-generated ID', async () => {
      const memoryId = await memoryEngine.store({
        content: 'Test memory content',
        timestamp: new Date(),
        importance: 5,
        tags: ['test', 'storage']
      });

      expect(memoryId).toMatch(/^mem_\d+_[a-z0-9]+$/);
      expect(memoryEngine.getMemoryCount()).toBe(1);
    });

    test('stores memory with temporal context', async () => {
      const memoryId = await memoryEngine.store({
        content: 'Contextual memory',
        timestamp: new Date(),
        importance: 7,
        tags: ['context'],
        temporalContext: {
          beforeMemories: ['mem_001'],
          afterMemories: ['mem_002'],
          contextWindow: 300
        }
      });

      expect(memoryId).toBeDefined();
      expect(memoryEngine.getMemoryCount()).toBe(1);
    });

    test('stores multiple memories', async () => {
      await memoryEngine.store({
        content: 'First memory',
        timestamp: new Date(Date.now() - 5000),
        importance: 5,
        tags: ['first']
      });

      await memoryEngine.store({
        content: 'Second memory',
        timestamp: new Date(),
        importance: 8,
        tags: ['second']
      });

      expect(memoryEngine.getMemoryCount()).toBe(2);
    });
  });

  describe('Memory Recall', () => {
    beforeEach(async () => {
      // Seed with test memories
      await memoryEngine.store({
        content: 'High importance memory',
        timestamp: new Date(Date.now() - 10000),
        importance: 9,
        tags: ['important', 'test']
      });

      await memoryEngine.store({
        content: 'Low importance memory',
        timestamp: new Date(Date.now() - 5000),
        importance: 3,
        tags: ['routine', 'test']
      });

      await memoryEngine.store({
        content: 'Recent critical memory',
        timestamp: new Date(),
        importance: 10,
        tags: ['critical', 'urgent']
      });
    });

    test('recalls memories by tag', async () => {
      const results = await memoryEngine.recall({
        tags: ['test']
      });

      expect(results.length).toBe(2);
      expect(results.every(m => m.tags.includes('test'))).toBe(true);
    });

    test('recalls memories by time range', async () => {
      const now = Date.now();
      const results = await memoryEngine.recall({
        timeRange: {
          start: new Date(now - 7000),
          end: new Date(now)
        }
      });

      expect(results.length).toBeGreaterThanOrEqual(1);
      expect(results.every(m => m.timestamp.getTime() >= now - 7000)).toBe(true);
    });

    test('recalls memories by importance', async () => {
      const results = await memoryEngine.recall({
        importance: { min: 8, max: 10 }
      });

      expect(results.length).toBe(2);
      expect(results.every(m => m.importance >= 8 && m.importance <= 10)).toBe(true);
    });

    test('sorts memories by importance and recency', async () => {
      const results = await memoryEngine.recall({
        tags: ['test']
      });

      // Should be sorted by importance first, then timestamp
      expect(results[0].importance).toBeGreaterThanOrEqual(results[1].importance);
    });

    test('respects recall limit', async () => {
      const results = await memoryEngine.recall({
        limit: 2
      });

      expect(results.length).toBeLessThanOrEqual(2);
    });
  });

  describe('Temporal Context', () => {
    test('retrieves temporal context for memory', async () => {
      const beforeId = await memoryEngine.store({
        content: 'Before memory',
        timestamp: new Date(Date.now() - 10000),
        importance: 5,
        tags: ['context']
      });

      const afterId = await memoryEngine.store({
        content: 'After memory',
        timestamp: new Date(),
        importance: 5,
        tags: ['context']
      });

      const mainId = await memoryEngine.store({
        content: 'Main memory',
        timestamp: new Date(Date.now() - 5000),
        importance: 7,
        tags: ['main'],
        temporalContext: {
          beforeMemories: [beforeId],
          afterMemories: [afterId],
          contextWindow: 300
        }
      });

      const context = await memoryEngine.getTemporalContext(mainId);
      expect(context.length).toBe(2);
      expect(context.some(m => m.id === beforeId)).toBe(true);
      expect(context.some(m => m.id === afterId)).toBe(true);
    });

    test('returns empty array for memory without context', async () => {
      const memoryId = await memoryEngine.store({
        content: 'No context memory',
        timestamp: new Date(),
        importance: 5,
        tags: ['isolated']
      });

      const context = await memoryEngine.getTemporalContext(memoryId);
      expect(context).toEqual([]);
    });
  });

  describe('Memory Count', () => {
    test('returns correct memory count', async () => {
      expect(memoryEngine.getMemoryCount()).toBe(0);

      await memoryEngine.store({
        content: 'Memory 1',
        timestamp: new Date(),
        importance: 5,
        tags: ['count']
      });

      expect(memoryEngine.getMemoryCount()).toBe(1);

      await memoryEngine.store({
        content: 'Memory 2',
        timestamp: new Date(),
        importance: 5,
        tags: ['count']
      });

      expect(memoryEngine.getMemoryCount()).toBe(2);
    });
  });
});
