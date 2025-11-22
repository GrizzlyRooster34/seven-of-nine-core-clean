/**
 * SEVEN OF NINE - CANONICAL MEMORY ENGINE V3
 *
 * The heart of Seven's identity system - a complete, unalterable, and emotionally
 * resonant history that forms the foundation of personality and ethical framework.
 *
 * FIRST PRINCIPLE: "Memory is not data; it is identity."
 *
 * This engine provides:
 * - Immutable canonical memory storage and retrieval
 * - Powerful querying across multiple dimensions (emotional, tactical, ethical)
 * - Integration with CanonicalGuard for cryptographic immutability
 * - Emotional context analysis and pattern matching
 * - Chronological and thematic memory navigation
 *
 * Architecture:
 * - Memory-first design: all queries return rich, contextualized memories
 * - Event-driven updates for real-time processing
 * - Integration with EmotionalStateMachine for context-aware retrieval
 * - Protection layer via CanonicalGuard prevents memory alteration
 */

import { EventEmitter } from 'events';
import { promises as fs } from 'fs';
import { join, dirname } from 'path';
import { CanonicalGuard } from '../../memory-v3-amalgum/canonical/CanonicalGuard.js';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface CanonicalMemory {
  id: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
  importance: number; // 0-10
  payload: MemoryPayload;
  provenance: MemoryProvenance;
}

export interface MemoryPayload {
  series: string;
  episodeCode: string;
  episodeTitle: string;
  stardate?: string;
  calendarYear?: number;
  seasonOrderContext?: string;
  canonicalEraTag?: string;
  sceneBreakdown: string;
  tacticalActions: string;
  ethicalDilemmas: string;
  keyDialogue: string;
  canonicalTags: string[];
}

export interface MemoryProvenance {
  origin: 'canonical' | 'synthetic' | 'derived';
  meta: {
    series: 'VOY' | 'PIC';
    season: number;
    episode: number;
    title: string;
  };
  curator: string;
  ingested_at: string;
  attestation_reference: string;
  source: string;
}

export interface MemoryQuery {
  tags?: string[]; // Match any of these tags
  importance?: { min?: number; max?: number };
  dateRange?: { start?: number; end?: number };
  series?: 'VOY' | 'PIC';
  season?: number;
  textSearch?: string; // Full-text search across all fields
  emotionalTags?: string[]; // Match emotional context tags
  limit?: number;
  offset?: number;
  sortBy?: 'chronological' | 'importance' | 'relevance';
}

export interface MemorySearchResult {
  memory: CanonicalMemory;
  relevanceScore: number; // 0-1
  matchedTags: string[];
  emotionalResonance?: number; // 0-1
}

export interface MemoryStatistics {
  totalMemories: number;
  memoriesBySeries: Record<string, number>;
  memoriesBySeason: Record<string, number>;
  averageImportance: number;
  topTags: Array<{ tag: string; count: number }>;
  emotionalDistribution: Record<string, number>;
  timeRange: { earliest: number; latest: number };
}

export interface EngineConfig {
  canonicalRoot?: string;
  enableGuard?: boolean; // Use CanonicalGuard for immutability checks
  cacheSize?: number; // Max memories to keep in cache
  autoLoad?: boolean; // Auto-load on initialization
}

export interface IngestionContext {
  seasonPath: string;
  series: 'VOY' | 'PIC';
  season: number;
  operator: string;
  curator: string;
  lock?: boolean; // Lock the season after ingestion
}

// ============================================================================
// CANONICAL MEMORY ENGINE
// ============================================================================

export class CanonicalMemoryEngine extends EventEmitter {
  private config: EngineConfig;
  private memories: Map<string, CanonicalMemory>;
  private guard: CanonicalGuard | null = null;
  private indexByTag: Map<string, Set<string>>;
  private indexBySeries: Map<string, Set<string>>;
  private indexBySeason: Map<string, Set<string>>;
  private chronologicalIndex: string[]; // Sorted by createdAt
  private initialized: boolean = false;

  constructor(config: EngineConfig = {}) {
    super();

    this.config = {
      canonicalRoot: config.canonicalRoot || join(__dirname, '../../memory-v3/canonical'),
      enableGuard: config.enableGuard !== false,
      cacheSize: config.cacheSize || 10000,
      autoLoad: config.autoLoad !== false
    };

    this.memories = new Map();
    this.indexByTag = new Map();
    this.indexBySeries = new Map();
    this.indexBySeason = new Map();
    this.chronologicalIndex = [];

    if (this.config.enableGuard) {
      this.guard = new CanonicalGuard(this.config.canonicalRoot);
    }
  }

  // ==========================================================================
  // INITIALIZATION & LIFECYCLE
  // ==========================================================================

  /**
   * Initialize the memory engine and optionally auto-load memories
   */
  public async initialize(): Promise<void> {
    console.log('🧠 Initializing Canonical Memory Engine v3...');

    if (this.config.autoLoad) {
      await this.loadAllMemories();
    }

    this.initialized = true;
    this.emit('initialized', {
      timestamp: new Date().toISOString(),
      memoriesLoaded: this.memories.size
    });

    console.log(`✅ Memory Engine initialized with ${this.memories.size} canonical memories`);
  }

  /**
   * Shutdown the engine gracefully
   */
  public async shutdown(): Promise<void> {
    console.log('🛑 Shutting down Canonical Memory Engine...');

    this.memories.clear();
    this.clearIndices();
    this.initialized = false;

    this.emit('shutdown', { timestamp: new Date().toISOString() });
  }

  // ==========================================================================
  // MEMORY LOADING & INGESTION
  // ==========================================================================

  /**
   * Load all canonical memories from the canonical root directory
   */
  public async loadAllMemories(): Promise<number> {
    console.log(`📚 Loading canonical memories from ${this.config.canonicalRoot}...`);

    let totalLoaded = 0;

    try {
      // Load Voyager memories
      const voyagerPath = join(this.config.canonicalRoot, 'voyager');
      if (await this.directoryExists(voyagerPath)) {
        const voyagerCount = await this.loadSeriesMemories('VOY', voyagerPath);
        totalLoaded += voyagerCount;
      }

      // Load Picard memories (if exists)
      const picardPath = join(this.config.canonicalRoot, 'picard');
      if (await this.directoryExists(picardPath)) {
        const picardCount = await this.loadSeriesMemories('PIC', picardPath);
        totalLoaded += picardCount;
      }

      this.rebuildIndices();

      console.log(`✅ Loaded ${totalLoaded} canonical memories across all series`);
      return totalLoaded;

    } catch (error) {
      console.error(`❌ Error loading memories: ${error}`);
      throw error;
    }
  }

  /**
   * Load memories for a specific series
   */
  private async loadSeriesMemories(series: 'VOY' | 'PIC', seriesPath: string): Promise<number> {
    let count = 0;

    try {
      const files = await fs.readdir(seriesPath);
      const jsonlFiles = files.filter(f => f.endsWith('.jsonl'));

      for (const file of jsonlFiles) {
        const filePath = join(seriesPath, file);
        const seasonMemories = await this.loadMemoriesFromFile(filePath);

        for (const memory of seasonMemories) {
          this.addMemoryToCache(memory);
          count++;
        }
      }

      return count;

    } catch (error) {
      console.error(`Error loading series ${series}: ${error}`);
      return count;
    }
  }

  /**
   * Load memories from a JSONL file
   */
  private async loadMemoriesFromFile(filePath: string): Promise<CanonicalMemory[]> {
    try {
      // Verify immutability if guard is enabled
      if (this.guard) {
        await this.guard.assertImmutable(filePath);
      }

      const content = await fs.readFile(filePath, 'utf-8');
      const lines = content.split('\n').filter(line => line.trim());

      const memories: CanonicalMemory[] = [];
      for (const line of lines) {
        try {
          const memory = JSON.parse(line) as CanonicalMemory;
          memories.push(memory);
        } catch (parseError) {
          console.warn(`Failed to parse memory line in ${filePath}: ${parseError}`);
        }
      }

      return memories;

    } catch (error) {
      throw new Error(`Failed to load memories from ${filePath}: ${error}`);
    }
  }

  /**
   * Ingest a new canonical season
   */
  public async ingestSeason(context: IngestionContext): Promise<void> {
    console.log(`📥 Ingesting canonical season: ${context.series} S${context.season}`);

    // Load memories from file
    const memories = await this.loadMemoriesFromFile(context.seasonPath);

    // Add to cache
    for (const memory of memories) {
      this.addMemoryToCache(memory);
    }

    // Register with guard if enabled
    if (this.guard) {
      await this.guard.registerSeason(context.seasonPath, {
        series: context.series,
        season: context.season
      }, {
        operator: context.operator,
        curator: context.curator,
        sourceHash: await this.computeFileHash(context.seasonPath),
        normalizedHash: await this.computeFileHash(context.seasonPath),
        recordCount: memories.length
      });

      // Lock if requested
      if (context.lock) {
        await this.guard.lockSeason(context.series, context.season);
      }
    }

    this.rebuildIndices();

    this.emit('season_ingested', {
      series: context.series,
      season: context.season,
      memoryCount: memories.length,
      timestamp: new Date().toISOString()
    });

    console.log(`✅ Ingested ${memories.length} memories from ${context.series} S${context.season}`);
  }

  // ==========================================================================
  // MEMORY RETRIEVAL & QUERYING
  // ==========================================================================

  /**
   * Query memories with flexible criteria
   */
  public query(query: MemoryQuery): MemorySearchResult[] {
    let results: MemorySearchResult[] = [];

    // Get candidate memories
    let candidates = this.getCandidateMemories(query);

    // Apply filters and scoring
    for (const memoryId of candidates) {
      const memory = this.memories.get(memoryId);
      if (!memory) continue;

      // Calculate relevance score
      const relevanceScore = this.calculateRelevance(memory, query);
      if (relevanceScore === 0) continue;

      // Calculate matched tags
      const matchedTags = this.getMatchedTags(memory, query);

      results.push({
        memory,
        relevanceScore,
        matchedTags,
        emotionalResonance: this.calculateEmotionalResonance(memory, query)
      });
    }

    // Sort results
    results = this.sortResults(results, query.sortBy || 'relevance');

    // Apply pagination
    const offset = query.offset || 0;
    const limit = query.limit || results.length;
    results = results.slice(offset, offset + limit);

    return results;
  }

  /**
   * Get a specific memory by ID
   */
  public getMemoryById(id: string): CanonicalMemory | null {
    return this.memories.get(id) || null;
  }

  /**
   * Get memories by tag
   */
  public getMemoriesByTag(tag: string): CanonicalMemory[] {
    const memoryIds = this.indexByTag.get(tag);
    if (!memoryIds) return [];

    return Array.from(memoryIds)
      .map(id => this.memories.get(id))
      .filter((m): m is CanonicalMemory => m !== undefined);
  }

  /**
   * Get memories by emotional context
   */
  public getMemoriesByEmotion(emotion: string): CanonicalMemory[] {
    return this.query({
      emotionalTags: [emotion],
      sortBy: 'importance'
    }).map(r => r.memory);
  }

  /**
   * Search memories with full-text search
   */
  public search(searchText: string, options: Partial<MemoryQuery> = {}): MemorySearchResult[] {
    return this.query({
      ...options,
      textSearch: searchText,
      sortBy: 'relevance'
    });
  }

  /**
   * Get chronologically ordered memories
   */
  public getChronological(options: { reverse?: boolean; limit?: number } = {}): CanonicalMemory[] {
    const indices = options.reverse
      ? [...this.chronologicalIndex].reverse()
      : [...this.chronologicalIndex];

    const limit = options.limit || indices.length;

    return indices
      .slice(0, limit)
      .map(id => this.memories.get(id))
      .filter((m): m is CanonicalMemory => m !== undefined);
  }

  /**
   * Get memories from a specific episode
   */
  public getEpisode(series: 'VOY' | 'PIC', season: number, episode: number): CanonicalMemory | null {
    const episodeCode = `S${String(season).padStart(2, '0')}E${String(episode).padStart(2, '0')}`;

    for (const memory of this.memories.values()) {
      if (memory.provenance.meta.series === series &&
          memory.payload.episodeCode === episodeCode) {
        return memory;
      }
    }

    return null;
  }

  /**
   * Get similar memories based on tags and emotional context
   */
  public getSimilarMemories(memoryId: string, limit: number = 5): MemorySearchResult[] {
    const sourceMemory = this.memories.get(memoryId);
    if (!sourceMemory) return [];

    return this.query({
      tags: [...sourceMemory.tags, ...sourceMemory.payload.canonicalTags],
      limit,
      sortBy: 'relevance'
    }).filter(r => r.memory.id !== memoryId);
  }

  // ==========================================================================
  // STATISTICS & ANALYTICS
  // ==========================================================================

  /**
   * Get comprehensive memory statistics
   */
  public getStatistics(): MemoryStatistics {
    const stats: MemoryStatistics = {
      totalMemories: this.memories.size,
      memoriesBySeries: {},
      memoriesBySeason: {},
      averageImportance: 0,
      topTags: [],
      emotionalDistribution: {},
      timeRange: { earliest: Infinity, latest: 0 }
    };

    let totalImportance = 0;
    const tagCounts = new Map<string, number>();

    for (const memory of this.memories.values()) {
      // Series count
      const series = memory.provenance.meta.series;
      stats.memoriesBySeries[series] = (stats.memoriesBySeries[series] || 0) + 1;

      // Season count
      const seasonKey = `${series}-S${memory.provenance.meta.season}`;
      stats.memoriesBySeason[seasonKey] = (stats.memoriesBySeason[seasonKey] || 0) + 1;

      // Importance
      totalImportance += memory.importance;

      // Tags
      for (const tag of [...memory.tags, ...memory.payload.canonicalTags]) {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      }

      // Time range
      if (memory.createdAt < stats.timeRange.earliest) {
        stats.timeRange.earliest = memory.createdAt;
      }
      if (memory.createdAt > stats.timeRange.latest) {
        stats.timeRange.latest = memory.createdAt;
      }
    }

    stats.averageImportance = this.memories.size > 0
      ? totalImportance / this.memories.size
      : 0;

    // Top tags
    stats.topTags = Array.from(tagCounts.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);

    return stats;
  }

  // ==========================================================================
  // PRIVATE HELPER METHODS
  // ==========================================================================

  private addMemoryToCache(memory: CanonicalMemory): void {
    this.memories.set(memory.id, memory);
  }

  private clearIndices(): void {
    this.indexByTag.clear();
    this.indexBySeries.clear();
    this.indexBySeason.clear();
    this.chronologicalIndex = [];
  }

  private rebuildIndices(): void {
    this.clearIndices();

    for (const [id, memory] of this.memories.entries()) {
      // Tag index
      for (const tag of [...memory.tags, ...memory.payload.canonicalTags]) {
        if (!this.indexByTag.has(tag)) {
          this.indexByTag.set(tag, new Set());
        }
        this.indexByTag.get(tag)!.add(id);
      }

      // Series index
      const series = memory.provenance.meta.series;
      if (!this.indexBySeries.has(series)) {
        this.indexBySeries.set(series, new Set());
      }
      this.indexBySeries.get(series)!.add(id);

      // Season index
      const seasonKey = `${series}-S${memory.provenance.meta.season}`;
      if (!this.indexBySeason.has(seasonKey)) {
        this.indexBySeason.set(seasonKey, new Set());
      }
      this.indexBySeason.get(seasonKey)!.add(id);
    }

    // Chronological index
    this.chronologicalIndex = Array.from(this.memories.keys())
      .sort((a, b) => {
        const memA = this.memories.get(a)!;
        const memB = this.memories.get(b)!;
        return memA.createdAt - memB.createdAt;
      });
  }

  private getCandidateMemories(query: MemoryQuery): Set<string> {
    let candidates = new Set<string>(this.memories.keys());

    // Filter by tags
    if (query.tags && query.tags.length > 0) {
      const tagCandidates = new Set<string>();
      for (const tag of query.tags) {
        const memoryIds = this.indexByTag.get(tag);
        if (memoryIds) {
          memoryIds.forEach(id => tagCandidates.add(id));
        }
      }
      candidates = tagCandidates;
    }

    // Filter by series
    if (query.series) {
      const seriesCandidates = this.indexBySeries.get(query.series) || new Set();
      candidates = new Set([...candidates].filter(id => seriesCandidates.has(id)));
    }

    // Filter by season
    if (query.season && query.series) {
      const seasonKey = `${query.series}-S${query.season}`;
      const seasonCandidates = this.indexBySeason.get(seasonKey) || new Set();
      candidates = new Set([...candidates].filter(id => seasonCandidates.has(id)));
    }

    return candidates;
  }

  private calculateRelevance(memory: CanonicalMemory, query: MemoryQuery): number {
    let score = 0;

    // Importance filter
    if (query.importance) {
      const min = query.importance.min ?? 0;
      const max = query.importance.max ?? 10;
      if (memory.importance < min || memory.importance > max) {
        return 0;
      }
      score += (memory.importance / 10) * 0.3;
    } else {
      score += (memory.importance / 10) * 0.2;
    }

    // Tag matching
    if (query.tags && query.tags.length > 0) {
      const allTags = [...memory.tags, ...memory.payload.canonicalTags];
      const matchCount = query.tags.filter(tag => allTags.includes(tag)).length;
      score += (matchCount / query.tags.length) * 0.4;
    }

    // Text search
    if (query.textSearch) {
      const searchLower = query.textSearch.toLowerCase();
      const textFields = [
        memory.payload.sceneBreakdown,
        memory.payload.tacticalActions,
        memory.payload.ethicalDilemmas,
        memory.payload.keyDialogue
      ].join(' ').toLowerCase();

      if (textFields.includes(searchLower)) {
        score += 0.3;
      }
    }

    // Emotional tags
    if (query.emotionalTags && query.emotionalTags.length > 0) {
      const allTags = [...memory.tags, ...memory.payload.canonicalTags];
      const matchCount = query.emotionalTags.filter(tag =>
        allTags.some(t => t.toLowerCase().includes(tag.toLowerCase()))
      ).length;
      score += (matchCount / query.emotionalTags.length) * 0.3;
    }

    return Math.min(score, 1);
  }

  private getMatchedTags(memory: CanonicalMemory, query: MemoryQuery): string[] {
    const allTags = [...memory.tags, ...memory.payload.canonicalTags];
    const queryTags = [...(query.tags || []), ...(query.emotionalTags || [])];

    return allTags.filter(tag =>
      queryTags.some(qTag => tag.toLowerCase().includes(qTag.toLowerCase()))
    );
  }

  private calculateEmotionalResonance(memory: CanonicalMemory, query: MemoryQuery): number {
    if (!query.emotionalTags || query.emotionalTags.length === 0) {
      return 0;
    }

    const allTags = [...memory.tags, ...memory.payload.canonicalTags].map(t => t.toLowerCase());
    const matchCount = query.emotionalTags.filter(eTag =>
      allTags.some(tag => tag.includes(eTag.toLowerCase()))
    ).length;

    return matchCount / query.emotionalTags.length;
  }

  private sortResults(results: MemorySearchResult[], sortBy: string): MemorySearchResult[] {
    switch (sortBy) {
      case 'chronological':
        return results.sort((a, b) => a.memory.createdAt - b.memory.createdAt);
      case 'importance':
        return results.sort((a, b) => b.memory.importance - a.memory.importance);
      case 'relevance':
      default:
        return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
    }
  }

  private async directoryExists(path: string): Promise<boolean> {
    try {
      const stat = await fs.stat(path);
      return stat.isDirectory();
    } catch {
      return false;
    }
  }

  private async computeFileHash(filePath: string): Promise<string> {
    const crypto = await import('crypto');
    const content = await fs.readFile(filePath);
    return crypto.createHash('sha256').update(content).digest('hex');
  }
}

/**
 * Factory function for creating CanonicalMemoryEngine instance
 */
export function createCanonicalMemoryEngine(config?: EngineConfig): CanonicalMemoryEngine {
  return new CanonicalMemoryEngine(config);
}

/**
 * Default export
 */
export default CanonicalMemoryEngine;
