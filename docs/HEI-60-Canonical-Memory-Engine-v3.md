# HEI-60: Canonical Memory Engine v3

## Overview

The **Canonical Memory Engine v3** is Seven's identity system - providing a complete, unalterable, and emotionally resonant history that forms the foundation of her personality and ethical framework. It implements the first principle: **"Memory is not data; it is identity."**

**Status:** ✅ Implemented
**Location:** `core/memory/CanonicalMemoryEngine.ts`
**Architecture:** Memory-first engine with multi-dimensional querying

---

## Purpose & First Principle

**First Principle:** "Memory is not data; it is identity."

The Canonical Memory system is not a simple database of facts - it is the architectural implementation of a first-person life story. Its purpose is to provide Seven with:

- Complete chronological history from canonical sources (VOY, PIC)
- Immutable memories protected by cryptographic verification
- Emotional and ethical context for every experience
- Powerful querying across multiple dimensions (time, emotion, theme, importance)
- Foundation for tactical variant persona emergence

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│       CANONICAL MEMORY ENGINE V3 (Core Identity)         │
└───────────────────────┬─────────────────────────────────┘
                        │
         ┌──────────────┼──────────────┐
         │              │              │
         ▼              ▼              ▼
  ┌────────────┐ ┌────────────┐ ┌────────────┐
  │  Memory    │ │  Query     │ │ Canonical  │
  │  Storage   │ │  Engine    │ │   Guard    │
  │  (JSONL)   │ │            │ │ (Immutable)│
  └──────┬─────┘ └─────┬──────┘ └──────┬─────┘
         │             │               │
         └─────────────┼───────────────┘
                       │
                       ▼
            ┌──────────────────────┐
            │    Multi-Index System │
            │  - Tags              │
            │  - Series/Season     │
            │  - Chronological     │
            │  - Emotional         │
            │  - Importance        │
            └──────────────────────┘
```

---

## Memory Schema

Each canonical memory follows this schema:

```typescript
{
  id: "voy-s4e01-scorpion-pt2-canonical",
  tags: ["canon", "series:VOY", "season:S4", "episode:E01", "seven-of-nine"],
  createdAt: 1672531200000,
  updatedAt: 1705154400000,
  importance: 10, // 0-10 scale

  payload: {
    series: "Star Trek: Voyager",
    episodeCode: "S04E01",
    episodeTitle: "Scorpion, Part II",
    stardate: "51003.7",
    calendarYear: 2374,
    seasonOrderContext: "Voyager Season 4 – Entry 1 of 26",
    canonicalEraTag: "Voyager",

    sceneBreakdown: "Detailed first-person narrative...",
    tacticalActions: "Specific actions taken...",
    ethicalDilemmas: "Moral conflicts and lessons...",
    keyDialogue: "Important quotes...",
    canonicalTags: ["BorgSeverance", "Species8472Conflict", "JanewayBond"]
  },

  provenance: {
    origin: "canonical",
    meta: { series: "VOY", season: 4, episode: 1, title: "Scorpion, Part II" },
    curator: "Cody Heinen",
    ingested_at: "2025-01-12T23:45:00Z",
    attestation_reference: "docs/CANON_ATTESTATION_CODY.md",
    source: "Seven Core Canonical Memory Archive"
  }
}
```

---

## Quick Start

### Basic Usage

```typescript
import CanonicalMemoryEngine from './core/memory/CanonicalMemoryEngine.js';

// Initialize
const memory = new CanonicalMemoryEngine({
  canonicalRoot: './memory-v3/canonical',
  enableGuard: true,  // Enable immutability protection
  autoLoad: true      // Auto-load all memories
});

await memory.initialize();

// Query by tags
const borgMemories = memory.query({
  tags: ['borg-severance', 'identity-crisis'],
  importance: { min: 9 },
  sortBy: 'chronological'
});

console.log(`Found ${borgMemories.length} high-importance Borg memories`);

// Search text
const results = memory.search('Captain Janeway', {
  importance: { min: 8 }
});

// Get specific episode
const firstContact = memory.getEpisode('VOY', 4, 1);
console.log(firstContact?.payload.episodeTitle);

// Get statistics
const stats = memory.getStatistics();
console.log(`Total memories: ${stats.totalMemories}`);
console.log(`Average importance: ${stats.averageImportance}`);
```

### With Configuration

```typescript
const memory = new CanonicalMemoryEngine({
  canonicalRoot: './memory-v3/canonical',
  enableGuard: true,       // Use CanonicalGuard for immutability
  cacheSize: 50000,        // Max memories in cache
  autoLoad: false          // Manual loading control
});

await memory.initialize();

// Manually load memories
const count = await memory.loadAllMemories();
console.log(`Loaded ${count} memories`);
```

---

## API Reference

### Constructor

```typescript
new CanonicalMemoryEngine(config?: EngineConfig)
```

**EngineConfig:**
- `canonicalRoot?: string` - Path to canonical memory directory (default: `memory-v3/canonical`)
- `enableGuard?: boolean` - Enable CanonicalGuard protection (default: true)
- `cacheSize?: number` - Max memories in cache (default: 10000)
- `autoLoad?: boolean` - Auto-load on init (default: true)

### Lifecycle

#### `initialize(): Promise<void>`

Initialize the memory engine.

```typescript
await memory.initialize();
```

#### `shutdown(): Promise<void>`

Shutdown and cleanup.

```typescript
await memory.shutdown();
```

### Memory Loading

#### `loadAllMemories(): Promise<number>`

Load all canonical memories from the root directory.

```typescript
const count = await memory.loadAllMemories();
console.log(`Loaded ${count} memories`);
```

#### `ingestSeason(context: IngestionContext): Promise<void>`

Ingest a new canonical season.

```typescript
await memory.ingestSeason({
  seasonPath: './memory-v3/canonical/voyager/season4.jsonl',
  series: 'VOY',
  season: 4,
  operator: 'Seven',
  curator: 'Cody Heinen',
  lock: true  // Lock after ingestion
});
```

### Memory Retrieval

#### `query(query: MemoryQuery): MemorySearchResult[]`

Flexible multi-criteria querying.

**MemoryQuery:**
```typescript
{
  tags?: string[];                          // Match any tags
  importance?: { min?: number; max?: number };
  dateRange?: { start?: number; end?: number };
  series?: 'VOY' | 'PIC';
  season?: number;
  textSearch?: string;                      // Full-text search
  emotionalTags?: string[];                 // Emotional context
  limit?: number;
  offset?: number;
  sortBy?: 'chronological' | 'importance' | 'relevance';
}
```

**Examples:**

```typescript
// High-importance Borg memories
const borg = memory.query({
  tags: ['borg-severance'],
  importance: { min: 9 },
  sortBy: 'importance'
});

// Season 4 identity crisis moments
const identityCrisis = memory.query({
  series: 'VOY',
  season: 4,
  emotionalTags: ['identity', 'crisis'],
  sortBy: 'chronological'
});

// Recent memories
const recent = memory.query({
  dateRange: { start: Date.now() - 86400000 * 30 }, // Last 30 days
  limit: 10
});

// Paginated results
const page1 = memory.query({
  tags: ['tactical'],
  limit: 20,
  offset: 0
});

const page2 = memory.query({
  tags: ['tactical'],
  limit: 20,
  offset: 20
});
```

#### `getMemoryById(id: string): CanonicalMemory | null`

Get specific memory by ID.

```typescript
const memory = memory.getMemoryById('voy-s4e01-scorpion-pt2-canonical');
```

#### `getMemoriesByTag(tag: string): CanonicalMemory[]`

Get all memories with a specific tag.

```typescript
const sevenMemories = memory.getMemoriesByTag('seven-of-nine');
```

#### `getMemoriesByEmotion(emotion: string): CanonicalMemory[]`

Get memories by emotional context.

```typescript
const compassion = memory.getMemoriesByEmotion('compassionate');
const protective = memory.getMemoriesByEmotion('protective');
```

#### `search(searchText: string, options?: Partial<MemoryQuery>): MemorySearchResult[]`

Full-text search across all memory fields.

```typescript
// Simple search
const janeway = memory.search('Captain Janeway');

// Search with filters
const important = memory.search('Collective', {
  importance: { min: 8 },
  series: 'VOY'
});
```

#### `getChronological(options?: { reverse?: boolean; limit?: number }): CanonicalMemory[]`

Get memories in chronological order.

```typescript
// Earliest to latest
const timeline = memory.getChronological();

// Latest to earliest
const recentFirst = memory.getChronological({ reverse: true });

// First 10 memories
const first10 = memory.getChronological({ limit: 10 });
```

#### `getEpisode(series: 'VOY' | 'PIC', season: number, episode: number): CanonicalMemory | null`

Get a specific episode memory.

```typescript
const scorpion = memory.getEpisode('VOY', 4, 1);
console.log(scorpion?.payload.episodeTitle); // "Scorpion, Part II"
```

#### `getSimilarMemories(memoryId: string, limit?: number): MemorySearchResult[]`

Find similar memories based on tags and context.

```typescript
const similar = memory.getSimilarMemories('voy-s4e06-the-raven-canonical', 5);

similar.forEach(result => {
  console.log(`Similar: ${result.memory.payload.episodeTitle}`);
  console.log(`Relevance: ${result.relevanceScore}`);
  console.log(`Matched tags: ${result.matchedTags.join(', ')}`);
});
```

### Statistics

#### `getStatistics(): MemoryStatistics`

Get comprehensive memory statistics.

```typescript
const stats = memory.getStatistics();

console.log(`Total memories: ${stats.totalMemories}`);
console.log(`Average importance: ${stats.averageImportance.toFixed(2)}`);
console.log(`Series breakdown:`, stats.memoriesBySeries);
console.log(`Top tags:`, stats.topTags.slice(0, 5));
```

**MemoryStatistics:**
```typescript
{
  totalMemories: number;
  memoriesBySeries: Record<string, number>;
  memoriesBySeason: Record<string, number>;
  averageImportance: number;
  topTags: Array<{ tag: string; count: number }>;
  emotionalDistribution: Record<string, number>;
  timeRange: { earliest: number; latest: number };
}
```

---

## Usage Examples

### Example 1: Identity Crisis Timeline

```typescript
const memory = new CanonicalMemoryEngine();
await memory.initialize();

// Find all identity-related memories chronologically
const identityJourney = memory.query({
  emotionalTags: ['identity', 'crisis', 'reconciliation'],
  sortBy: 'chronological'
});

console.log('=== IDENTITY JOURNEY ===');
identityJourney.forEach(result => {
  const m = result.memory;
  console.log(`\n${m.payload.episodeCode}: ${m.payload.episodeTitle}`);
  console.log(`Importance: ${m.importance}/10`);
  console.log(`Tags: ${result.matchedTags.join(', ')}`);
  console.log(`Resonance: ${(result.emotionalResonance! * 100).toFixed(0)}%`);
});
```

### Example 2: Tactical Learning Analysis

```typescript
const memory = new CanonicalMemoryEngine();
await memory.initialize();

// Analyze tactical actions across high-importance memories
const tactical = memory.query({
  importance: { min: 8 },
  sortBy: 'importance'
});

console.log('=== TACTICAL ACTIONS ANALYSIS ===');
tactical.forEach(result => {
  const m = result.memory;
  if (m.payload.tacticalActions.length > 100) {
    console.log(`\n${m.payload.episodeTitle} (${m.importance}/10)`);
    console.log(m.payload.tacticalActions);
  }
});
```

### Example 3: Ethical Dilemmas Pattern

```typescript
const memory = new CanonicalMemoryEngine();
await memory.initialize();

// Find critical ethical moments
const ethical = memory.query({
  textSearch: 'ethical',
  importance: { min: 9 },
  sortBy: 'chronological'
});

console.log('=== ETHICAL DEVELOPMENT ===');
ethical.forEach(result => {
  const m = result.memory;
  console.log(`\n${m.payload.episodeCode}: ${m.payload.episodeTitle}`);
  console.log('Dilemma:', m.payload.ethicalDilemmas.substring(0, 200) + '...');
});
```

### Example 4: Janeway Bond Evolution

```typescript
const memory = new CanonicalMemoryEngine();
await memory.initialize();

// Track relationship with Captain Janeway
const janewayBond = memory.query({
  tags: ['janeway-bond'],
  sortBy: 'chronological'
});

console.log('=== JANEWAY RELATIONSHIP TIMELINE ===');
janewayBond.forEach(result => {
  const m = result.memory;
  console.log(`\n${m.createdAt} - ${m.payload.episodeTitle}`);
  console.log(`Importance: ${m.importance}/10`);

  // Extract key dialogue about Janeway
  const dialogue = m.payload.keyDialogue;
  if (dialogue.toLowerCase().includes('janeway')) {
    console.log(`Dialogue: ${dialogue}`);
  }
});
```

### Example 5: Memory-Driven Persona Selection

```typescript
import CanonicalMemoryEngine from './core/memory/CanonicalMemoryEngine.js';
import EmotionalStateMachine from './core/emotions/EmotionalStateMachine.js';

const memory = new CanonicalMemoryEngine();
const emotions = new EmotionalStateMachine();

await memory.initialize();
await emotions.initialize();

// Use memories to inform emotional state
async function processUserInput(input: string) {
  // Find relevant memories
  const relevant = memory.search(input, {
    limit: 3,
    sortBy: 'relevance'
  });

  // Extract emotional context from memories
  const emotionalContext = relevant.map(r => ({
    episode: r.memory.payload.episodeTitle,
    tags: r.memory.payload.canonicalTags,
    dilemma: r.memory.payload.ethicalDilemmas.substring(0, 100)
  }));

  // Process input with emotional machine
  await emotions.processInput(input, JSON.stringify(emotionalContext));

  const currentState = emotions.getCurrentState();
  console.log(`Emotional state: ${currentState.name}`);
  console.log(`Relevant memories:`, emotionalContext);
}

await processUserInput('Should I trust this new crew member?');
```

### Example 6: Statistics Dashboard

```typescript
const memory = new CanonicalMemoryEngine();
await memory.initialize();

const stats = memory.getStatistics();

console.log('=== CANONICAL MEMORY STATISTICS ===\n');
console.log(`Total Memories: ${stats.totalMemories}`);
console.log(`Average Importance: ${stats.averageImportance.toFixed(2)}/10`);
console.log(`\nMemories by Series:`);
Object.entries(stats.memoriesBySeries).forEach(([series, count]) => {
  console.log(`  ${series}: ${count}`);
});

console.log(`\nTop 10 Tags:`);
stats.topTags.slice(0, 10).forEach((tag, i) => {
  console.log(`  ${i + 1}. ${tag.tag}: ${tag.count}`);
});

console.log(`\nTime Range:`);
console.log(`  Earliest: ${new Date(stats.timeRange.earliest).toISOString()}`);
console.log(`  Latest: ${new Date(stats.timeRange.latest).toISOString()}`);
```

---

## Integration with CanonicalGuard

The Memory Engine integrates with CanonicalGuard for immutability enforcement:

```typescript
const memory = new CanonicalMemoryEngine({
  enableGuard: true  // Enable cryptographic immutability
});

await memory.initialize();

// Ingest with automatic registration and locking
await memory.ingestSeason({
  seasonPath: './memory-v3/canonical/voyager/season4.jsonl',
  series: 'VOY',
  season: 4,
  operator: 'Seven',
  curator: 'Cody Heinen',
  lock: true  // Lock after ingestion - makes immutable
});

// Guard prevents any modifications to locked seasons
// Attempting to modify will throw: "CANONICAL BREACH"
```

---

## Event System

The engine emits events for monitoring:

```typescript
memory.on('initialized', (event) => {
  console.log('Memory engine initialized');
  console.log(`Loaded ${event.memoriesLoaded} memories`);
});

memory.on('season_ingested', (event) => {
  console.log(`Ingested ${event.series} S${event.season}`);
  console.log(`Memory count: ${event.memoryCount}`);
});

memory.on('shutdown', (event) => {
  console.log('Memory engine shutdown at', event.timestamp);
});
```

---

## Testing

Run comprehensive test suite:

```bash
npm test tests/memory/CanonicalMemoryEngine.test.ts
```

**Test Coverage:**
- ✅ Initialization (default and custom config)
- ✅ Memory loading from JSONL files
- ✅ Memory retrieval (by ID, tag, chronological)
- ✅ Multi-criteria querying
- ✅ Full-text search
- ✅ Episode retrieval
- ✅ Similar memory finding
- ✅ Emotional context querying
- ✅ Statistics generation
- ✅ Event emissions
- ✅ Edge cases
- ✅ Performance benchmarks

---

## Performance Characteristics

- **Memory Loading:** 50+ memories/second from JSONL
- **Query Performance:** <100ms for complex multi-criteria queries
- **Index Building:** O(n) where n = number of memories
- **Search Complexity:** O(m) where m = matching candidates
- **Cache Size:** Configurable (default: 10,000 memories)

---

## Best Practices

### 1. Enable Guard for Production

```typescript
const memory = new CanonicalMemoryEngine({
  enableGuard: true  // Always enable in production
});
```

### 2. Use Specific Queries

```typescript
// Good: Specific criteria
const results = memory.query({
  series: 'VOY',
  season: 4,
  tags: ['tactical'],
  importance: { min: 8 }
});

// Avoid: Overly broad queries
const tooMany = memory.query({}); // Returns everything
```

### 3. Leverage Indices

```typescript
// Efficient: Uses tag index
const borgMemories = memory.getMemoriesByTag('borg-severance');

// Less efficient: Full scan with text search
const borgSearch = memory.search('borg');
```

### 4. Paginate Large Results

```typescript
const pageSize = 20;
const page = 1;

const results = memory.query({
  tags: ['canon'],
  limit: pageSize,
  offset: page * pageSize
});
```

### 5. Cache Statistics

```typescript
// Calculate once, reuse
const stats = memory.getStatistics();

// Don't recalculate repeatedly
// const stats = memory.getStatistics(); // Don't repeat
```

---

## Security Considerations

- **Immutability:** CanonicalGuard prevents unauthorized memory modification
- **Chain of Custody:** Full provenance tracking for all memories
- **Cryptographic Verification:** SHA-256 hashes ensure integrity
- **Merkle Trees:** Efficient verification of memory sets
- **Attestation:** All memories signed by curator

---

## Related Systems

- **CanonicalGuard** (`memory-v3-amalgum/canonical/CanonicalGuard.ts`) - Immutability enforcement
- **EmotionalStateMachine** (`core/emotions/EmotionalStateMachine.ts`) - Emotional context
- **TacticalVariantSelector** (`core/tactical/TacticalVariantSelector.ts`) - Persona selection
- **SevenBridge** (`core/routing/SevenBridge.ts`) - Memory event routing

---

## Memory Importance Scale

| Level | Description | Examples |
|-------|-------------|----------|
| 10 | Life-defining moments | Borg severance, first Janeway bond |
| 9 | Critical experiences | Species 8472 conflict, Omega Directive |
| 8 | Significant events | Hirogen capture, temporal warfare |
| 7 | Important interactions | Crew conflicts, ethical dilemmas |
| 5-6 | Standard experiences | Regular missions, routine operations |
| 3-4 | Minor events | Background participation |
| 1-2 | Trivial moments | Minimal involvement |

---

## Canonical Tags Reference

Common canonical tags used across memories:

**Identity & Growth:**
- `BorgSeverance`, `IdentityCrisis`, `AnnikaHansen`, `DeassimilationTrauma`

**Relationships:**
- `JanewayBond`, `TorresConflict`, `DoctorMentorship`, `CrewIntegration`

**Tactical & Technical:**
- `TacticalActions`, `AstrometricsCreation`, `EfficiencyAnalysis`

**Ethical & Moral:**
- `EthicalDilemmas`, `MoralComplexity`, `RedemptionThroughService`

**Emotional:**
- `Compassionate`, `Protective`, `Contemplative`, `Determined`

---

## License

MIT License - Part of Seven of Nine Core Architecture

---

## References

- Canonical Memory Architecture: `gemini_docs/architecture/Canonical_Memory.md`
- Creator Bond Framework: `gemini_docs/architecture/Creator_Bond_Framework.md`
- CanonicalGuard Specification: `memory-v3-amalgum/canonical/CanonicalGuard.ts`
