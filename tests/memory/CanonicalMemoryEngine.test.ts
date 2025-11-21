/**
 * CANONICAL MEMORY ENGINE V3 TESTS (HEI-60)
 * Comprehensive test suite for canonical memory loading, querying, and statistics
 */

import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import CanonicalMemoryEngine from '../../core/memory/CanonicalMemoryEngine.js';
import type { CanonicalMemory, MemoryQuery, IngestionContext } from '../../core/memory/CanonicalMemoryEngine.js';
import { promises as fs } from 'fs';
import { join } from 'path';

describe('CanonicalMemoryEngine', () => {
  let engine: CanonicalMemoryEngine;
  const testDataDir = join(__dirname, '../../memory-v3-amalgum/canonical');

  beforeEach(async () => {
    engine = new CanonicalMemoryEngine({
      canonicalRoot: testDataDir,
      enableGuard: false, // Disable guard for faster tests
      autoLoad: false
    });
    await engine.initialize();
  });

  afterEach(async () => {
    await engine.shutdown();
  });

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  describe('Initialization', () => {
    test('should initialize with default config', async () => {
      const newEngine = new CanonicalMemoryEngine({
        autoLoad: false
      });

      await newEngine.initialize();
      expect(newEngine).toBeDefined();

      await newEngine.shutdown();
    });

    test('should initialize with custom config', async () => {
      const newEngine = new CanonicalMemoryEngine({
        canonicalRoot: testDataDir,
        enableGuard: false,
        cacheSize: 5000,
        autoLoad: false
      });

      await newEngine.initialize();
      expect(newEngine).toBeDefined();

      await newEngine.shutdown();
    });

    test('should emit initialized event', (done) => {
      const newEngine = new CanonicalMemoryEngine({ autoLoad: false });

      newEngine.on('initialized', (event) => {
        expect(event.timestamp).toBeDefined();
        expect(event.memoriesLoaded).toBeDefined();
        newEngine.shutdown().then(() => done());
      });

      newEngine.initialize();
    });

    test('should auto-load memories when configured', async () => {
      const newEngine = new CanonicalMemoryEngine({
        canonicalRoot: testDataDir,
        enableGuard: false,
        autoLoad: true
      });

      await newEngine.initialize();

      const stats = newEngine.getStatistics();
      expect(stats.totalMemories).toBeGreaterThan(0);

      await newEngine.shutdown();
    });
  });

  // ============================================================================
  // MEMORY LOADING
  // ============================================================================

  describe('Memory Loading', () => {
    test('should load memories from canonical directory', async () => {
      const count = await engine.loadAllMemories();

      expect(count).toBeGreaterThan(0);
      const stats = engine.getStatistics();
      expect(stats.totalMemories).toBe(count);
    });

    test('should load Voyager season 4 memories', async () => {
      await engine.loadAllMemories();

      const season4 = engine.query({ series: 'VOY', season: 4 });
      expect(season4.length).toBeGreaterThan(0);
    });

    test('should parse memory structure correctly', async () => {
      await engine.loadAllMemories();

      const memories = engine.getChronological({ limit: 1 });
      expect(memories.length).toBe(1);

      const memory = memories[0];
      expect(memory).toHaveProperty('id');
      expect(memory).toHaveProperty('tags');
      expect(memory).toHaveProperty('importance');
      expect(memory).toHaveProperty('payload');
      expect(memory).toHaveProperty('provenance');
    });

    test('should handle missing directory gracefully', async () => {
      const badEngine = new CanonicalMemoryEngine({
        canonicalRoot: '/nonexistent/path',
        enableGuard: false,
        autoLoad: false
      });

      await badEngine.initialize();
      const count = await badEngine.loadAllMemories();

      expect(count).toBe(0);

      await badEngine.shutdown();
    });
  });

  // ============================================================================
  // MEMORY RETRIEVAL
  // ============================================================================

  describe('Memory Retrieval', () => {
    beforeEach(async () => {
      await engine.loadAllMemories();
    });

    test('should retrieve memory by ID', async () => {
      const allMemories = engine.getChronological();
      const firstMemory = allMemories[0];

      const retrieved = engine.getMemoryById(firstMemory.id);

      expect(retrieved).toBeDefined();
      expect(retrieved?.id).toBe(firstMemory.id);
    });

    test('should return null for non-existent ID', () => {
      const retrieved = engine.getMemoryById('non-existent-id');
      expect(retrieved).toBeNull();
    });

    test('should retrieve memories by tag', () => {
      const memories = engine.getMemoriesByTag('canon');

      expect(memories.length).toBeGreaterThan(0);
      memories.forEach(m => {
        expect(
          [...m.tags, ...m.payload.canonicalTags].some(t => t === 'canon')
        ).toBe(true);
      });
    });

    test('should retrieve memories chronologically', () => {
      const memories = engine.getChronological();

      expect(memories.length).toBeGreaterThan(0);

      // Verify chronological order
      for (let i = 1; i < memories.length; i++) {
        expect(memories[i].createdAt).toBeGreaterThanOrEqual(
          memories[i - 1].createdAt
        );
      }
    });

    test('should retrieve memories in reverse chronological order', () => {
      const memories = engine.getChronological({ reverse: true });

      expect(memories.length).toBeGreaterThan(0);

      // Verify reverse chronological order
      for (let i = 1; i < memories.length; i++) {
        expect(memories[i].createdAt).toBeLessThanOrEqual(
          memories[i - 1].createdAt
        );
      }
    });

    test('should limit chronological results', () => {
      const memories = engine.getChronological({ limit: 5 });

      expect(memories.length).toBe(5);
    });
  });

  // ============================================================================
  // MEMORY QUERYING
  // ============================================================================

  describe('Memory Querying', () => {
    beforeEach(async () => {
      await engine.loadAllMemories();
    });

    test('should query by tags', () => {
      const results = engine.query({
        tags: ['seven-of-nine'],
        sortBy: 'relevance'
      });

      expect(results.length).toBeGreaterThan(0);
      results.forEach(r => {
        expect(r.relevanceScore).toBeGreaterThan(0);
        expect(r.matchedTags.length).toBeGreaterThan(0);
      });
    });

    test('should query by importance range', () => {
      const results = engine.query({
        importance: { min: 9, max: 10 },
        sortBy: 'importance'
      });

      expect(results.length).toBeGreaterThan(0);
      results.forEach(r => {
        expect(r.memory.importance).toBeGreaterThanOrEqual(9);
        expect(r.memory.importance).toBeLessThanOrEqual(10);
      });
    });

    test('should query by series', () => {
      const results = engine.query({
        series: 'VOY',
        sortBy: 'chronological'
      });

      expect(results.length).toBeGreaterThan(0);
      results.forEach(r => {
        expect(r.memory.provenance.meta.series).toBe('VOY');
      });
    });

    test('should query by season', () => {
      const results = engine.query({
        series: 'VOY',
        season: 4
      });

      expect(results.length).toBeGreaterThan(0);
      results.forEach(r => {
        expect(r.memory.provenance.meta.season).toBe(4);
      });
    });

    test('should perform text search', () => {
      const results = engine.query({
        textSearch: 'borg',
        sortBy: 'relevance'
      });

      expect(results.length).toBeGreaterThan(0);
    });

    test('should query by emotional tags', () => {
      const results = engine.query({
        emotionalTags: ['identity'],
        sortBy: 'relevance'
      });

      expect(results.length).toBeGreaterThan(0);
      results.forEach(r => {
        expect(r.emotionalResonance).toBeGreaterThan(0);
      });
    });

    test('should apply limit and offset', () => {
      const page1 = engine.query({
        tags: ['canon'],
        limit: 5,
        offset: 0
      });

      const page2 = engine.query({
        tags: ['canon'],
        limit: 5,
        offset: 5
      });

      expect(page1.length).toBe(5);
      expect(page2.length).toBeGreaterThan(0);
      expect(page1[0].memory.id).not.toBe(page2[0].memory.id);
    });

    test('should sort by chronological', () => {
      const results = engine.query({
        tags: ['canon'],
        sortBy: 'chronological',
        limit: 10
      });

      for (let i = 1; i < results.length; i++) {
        expect(results[i].memory.createdAt).toBeGreaterThanOrEqual(
          results[i - 1].memory.createdAt
        );
      }
    });

    test('should sort by importance', () => {
      const results = engine.query({
        tags: ['canon'],
        sortBy: 'importance',
        limit: 10
      });

      for (let i = 1; i < results.length; i++) {
        expect(results[i].memory.importance).toBeLessThanOrEqual(
          results[i - 1].memory.importance
        );
      }
    });

    test('should combine multiple query criteria', () => {
      const results = engine.query({
        series: 'VOY',
        season: 4,
        tags: ['seven-of-nine'],
        importance: { min: 8 },
        sortBy: 'importance'
      });

      expect(results.length).toBeGreaterThan(0);
      results.forEach(r => {
        expect(r.memory.provenance.meta.series).toBe('VOY');
        expect(r.memory.provenance.meta.season).toBe(4);
        expect(r.memory.importance).toBeGreaterThanOrEqual(8);
      });
    });
  });

  // ============================================================================
  // SEARCH FUNCTIONALITY
  // ============================================================================

  describe('Search Functionality', () => {
    beforeEach(async () => {
      await engine.loadAllMemories();
    });

    test('should search for specific terms', () => {
      const results = engine.search('Captain Janeway');

      expect(results.length).toBeGreaterThan(0);
    });

    test('should search with additional filters', () => {
      const results = engine.search('Collective', {
        importance: { min: 9 }
      });

      expect(results.length).toBeGreaterThan(0);
      results.forEach(r => {
        expect(r.memory.importance).toBeGreaterThanOrEqual(9);
      });
    });

    test('should return results sorted by relevance', () => {
      const results = engine.search('Borg');

      expect(results.length).toBeGreaterThan(0);
      // First result should have highest relevance
      if (results.length > 1) {
        expect(results[0].relevanceScore).toBeGreaterThanOrEqual(
          results[1].relevanceScore
        );
      }
    });
  });

  // ============================================================================
  // EPISODE RETRIEVAL
  // ============================================================================

  describe('Episode Retrieval', () => {
    beforeEach(async () => {
      await engine.loadAllMemories();
    });

    test('should get specific episode', () => {
      const episode = engine.getEpisode('VOY', 4, 1);

      expect(episode).toBeDefined();
      expect(episode?.provenance.meta.series).toBe('VOY');
      expect(episode?.provenance.meta.season).toBe(4);
      expect(episode?.provenance.meta.episode).toBe(1);
    });

    test('should return null for non-existent episode', () => {
      const episode = engine.getEpisode('VOY', 99, 99);

      expect(episode).toBeNull();
    });

    test('should retrieve episode with correct payload', () => {
      const episode = engine.getEpisode('VOY', 4, 1);

      expect(episode?.payload).toBeDefined();
      expect(episode?.payload.sceneBreakdown).toBeDefined();
      expect(episode?.payload.tacticalActions).toBeDefined();
      expect(episode?.payload.ethicalDilemmas).toBeDefined();
      expect(episode?.payload.keyDialogue).toBeDefined();
    });
  });

  // ============================================================================
  // SIMILAR MEMORIES
  // ============================================================================

  describe('Similar Memories', () => {
    beforeEach(async () => {
      await engine.loadAllMemories();
    });

    test('should find similar memories', () => {
      const allMemories = engine.getChronological({ limit: 1 });
      const sourceMemory = allMemories[0];

      const similar = engine.getSimilarMemories(sourceMemory.id, 5);

      expect(similar.length).toBeGreaterThan(0);
      expect(similar.length).toBeLessThanOrEqual(5);

      // Should not include source memory
      similar.forEach(r => {
        expect(r.memory.id).not.toBe(sourceMemory.id);
      });
    });

    test('should return empty array for non-existent memory', () => {
      const similar = engine.getSimilarMemories('non-existent', 5);

      expect(similar.length).toBe(0);
    });

    test('should find memories with overlapping tags', () => {
      const allMemories = engine.getChronological({ limit: 1 });
      const sourceMemory = allMemories[0];

      const similar = engine.getSimilarMemories(sourceMemory.id, 3);

      if (similar.length > 0) {
        similar.forEach(r => {
          expect(r.matchedTags.length).toBeGreaterThan(0);
        });
      }
    });
  });

  // ============================================================================
  // EMOTIONAL CONTEXT
  // ============================================================================

  describe('Emotional Context', () => {
    beforeEach(async () => {
      await engine.loadAllMemories();
    });

    test('should retrieve memories by emotion', () => {
      const memories = engine.getMemoriesByEmotion('identity');

      expect(memories.length).toBeGreaterThan(0);
    });

    test('should calculate emotional resonance', () => {
      const results = engine.query({
        emotionalTags: ['bond', 'trust'],
        sortBy: 'relevance'
      });

      if (results.length > 0) {
        results.forEach(r => {
          expect(r.emotionalResonance).toBeDefined();
          expect(r.emotionalResonance).toBeGreaterThanOrEqual(0);
          expect(r.emotionalResonance).toBeLessThanOrEqual(1);
        });
      }
    });
  });

  // ============================================================================
  // STATISTICS
  // ============================================================================

  describe('Statistics', () => {
    beforeEach(async () => {
      await engine.loadAllMemories();
    });

    test('should generate comprehensive statistics', () => {
      const stats = engine.getStatistics();

      expect(stats.totalMemories).toBeGreaterThan(0);
      expect(stats.memoriesBySeries).toBeDefined();
      expect(stats.memoriesBySeason).toBeDefined();
      expect(stats.averageImportance).toBeGreaterThan(0);
      expect(stats.topTags).toBeDefined();
      expect(stats.topTags.length).toBeGreaterThan(0);
      expect(stats.timeRange).toBeDefined();
    });

    test('should count memories by series', () => {
      const stats = engine.getStatistics();

      expect(stats.memoriesBySeries['VOY']).toBeGreaterThan(0);
    });

    test('should count memories by season', () => {
      const stats = engine.getStatistics();

      const seasonKeys = Object.keys(stats.memoriesBySeason);
      expect(seasonKeys.length).toBeGreaterThan(0);
    });

    test('should calculate average importance', () => {
      const stats = engine.getStatistics();

      expect(stats.averageImportance).toBeGreaterThan(0);
      expect(stats.averageImportance).toBeLessThanOrEqual(10);
    });

    test('should provide top tags', () => {
      const stats = engine.getStatistics();

      expect(stats.topTags.length).toBeGreaterThan(0);
      stats.topTags.forEach(tag => {
        expect(tag.tag).toBeDefined();
        expect(tag.count).toBeGreaterThan(0);
      });

      // Verify sorted by count
      for (let i = 1; i < stats.topTags.length; i++) {
        expect(stats.topTags[i].count).toBeLessThanOrEqual(
          stats.topTags[i - 1].count
        );
      }
    });

    test('should track time range', () => {
      const stats = engine.getStatistics();

      expect(stats.timeRange.earliest).toBeLessThan(stats.timeRange.latest);
      expect(stats.timeRange.earliest).toBeGreaterThan(0);
    });
  });

  // ============================================================================
  // EVENTS
  // ============================================================================

  describe('Events', () => {
    test('should emit initialized event', (done) => {
      const newEngine = new CanonicalMemoryEngine({ autoLoad: false });

      newEngine.on('initialized', (event) => {
        expect(event.timestamp).toBeDefined();
        newEngine.shutdown().then(() => done());
      });

      newEngine.initialize();
    });

    test('should emit shutdown event', (done) => {
      const newEngine = new CanonicalMemoryEngine({ autoLoad: false });

      newEngine.on('shutdown', (event) => {
        expect(event.timestamp).toBeDefined();
        done();
      });

      newEngine.initialize().then(() => {
        newEngine.shutdown();
      });
    });
  });

  // ============================================================================
  // EDGE CASES
  // ============================================================================

  describe('Edge Cases', () => {
    test('should handle empty query', async () => {
      await engine.loadAllMemories();

      const results = engine.query({});

      expect(results.length).toBe(engine.getStatistics().totalMemories);
    });

    test('should handle query with no results', async () => {
      await engine.loadAllMemories();

      const results = engine.query({
        tags: ['nonexistent-tag-12345'],
        importance: { min: 11 } // Invalid range
      });

      expect(results.length).toBe(0);
    });

    test('should handle zero limit', async () => {
      await engine.loadAllMemories();

      const results = engine.query({
        tags: ['canon'],
        limit: 0
      });

      expect(results.length).toBe(0);
    });

    test('should handle very large offset', async () => {
      await engine.loadAllMemories();

      const results = engine.query({
        tags: ['canon'],
        offset: 999999
      });

      expect(results.length).toBe(0);
    });
  });

  // ============================================================================
  // PERFORMANCE
  // ============================================================================

  describe('Performance', () => {
    test('should load memories efficiently', async () => {
      const startTime = Date.now();
      await engine.loadAllMemories();
      const duration = Date.now() - startTime;

      // Should complete within reasonable time (adjust as needed)
      expect(duration).toBeLessThan(10000); // 10 seconds
    });

    test('should query memories efficiently', async () => {
      await engine.loadAllMemories();

      const startTime = Date.now();
      const results = engine.query({
        tags: ['canon'],
        importance: { min: 8 },
        sortBy: 'relevance',
        limit: 100
      });
      const duration = Date.now() - startTime;

      expect(results).toBeDefined();
      expect(duration).toBeLessThan(1000); // 1 second
    });
  });
});
