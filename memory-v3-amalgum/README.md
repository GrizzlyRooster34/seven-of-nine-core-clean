# Memory Engine v3-Amalgum (Current Canonical Memory Engine)

## Status
**Current Production** - Active canonical memory system.

## Purpose
The memory-v3-amalgum system is the current canonical memory engine implementing:
- Temporal memory architecture with mental time travel
- Star Trek canon integration (Voyager S4-S7, Picard S1-S3)
- Memory canonicalization pipeline
- Context reinstatement and retrieval
- Cognitive state tagging and timeline mapping

## Architecture

### Core Engines

#### MemoryEngineV3.ts
Main memory engine coordinating all v3 systems:
- Temporal indexing and retrieval
- Canon integration
- Memory consolidation
- Decay management

#### TemporalMemoryCore.ts
Timeline management and temporal indexing:
- Past/present/future memory organization
- Temporal distance calculations
- Timeline navigation

#### MentalTimeTravelEngine.ts
Mental time travel functionality:
- Navigate memory timelines
- Temporal context retrieval
- Memory reconstruction from multiple time points

#### CanonicalIngestion.ts
Memory canonicalization pipeline:
- Import Star Trek episode summaries
- Verify canon integrity
- Provenance tracking
- Registry management

### Supporting Systems

#### ConsciousnessTimelineMapper.ts
Maps consciousness states across timeline:
- State evolution tracking
- Phase transition history
- Emotional arc mapping

#### ContextReinstatement.ts
Context retrieval and reinstatement:
- Restore mental context from memory
- Situational awareness reconstruction
- Pattern reactivation

#### CognitiveStateTagger.ts
Automatic cognitive state classification:
- Tag memories with cognitive context
- State transition detection
- Pattern recognition

#### DecayWatchdog.ts
Memory decay monitoring:
- Track memory access patterns
- Identify decay candidates
- Preserve important memories

#### MemoryEncryption.ts
Memory security and encryption:
- Sensitive memory protection
- Cryptographic operations
- Key management

#### LRUCache.ts
Least Recently Used caching:
- Performance optimization
- Frequently accessed memory caching
- Cache invalidation

#### MemoryIndexOptimizer.ts
Index optimization for fast retrieval:
- Multi-index management
- Query optimization
- Performance tuning

### Data Organization

```
memory-v3-amalgum/
├── *.ts                  # Engine implementations
├── *.d.ts                # TypeScript declarations
└── data/ (if exists)     # Memory data files
```

## Integration

### Boot Sequence
The v3-amalgum engine initializes during Seven's boot sequence:
1. MemoryEngineV3 instantiation
2. Temporal core initialization
3. Canon registry loading
4. Index optimization
5. Ready state

### Canonical Memory Source
Canonical memories are stored separately:
- **Location**: `../memory-v3/`
- **Content**: Voyager S4-S7 + Picard S1-S3 episode summaries
- **Registry**: `../memory-v3/canonical/canon.registry.json`

## Memory Types

### Canonical Memory
Immutable Star Trek canon:
- Episode-by-episode summaries
- Seven of Nine's experiences from show
- Verified against source material
- Never modified or generated

### Episodic Memory
Creator experiences (from v2):
- Creator-authored interactions
- Runtime sessions
- Referenced by v3 for context

### Temporal Memory
Timeline-organized memory:
- Past experiences with temporal indexing
- Present context awareness
- Future projections and planning

## API Usage

```typescript
import { MemoryEngineV3 } from './memory-v3-amalgum/MemoryEngineV3';
import { MentalTimeTravelEngine } from './memory-v3-amalgum/MentalTimeTravelEngine';

const memoryV3 = new MemoryEngineV3();
await memoryV3.initialize();

// Mental time travel
const timeTravel = new MentalTimeTravelEngine(memoryV3);
const pastMemories = await timeTravel.navigateToTimestamp('2024-01-01T00:00:00Z');
```

## Relationship to Other Versions

- **v1 (memory/)**: Legacy API (superseded)
- **v2 (memory-v2/)**: Episodic memory (Creator experiences) - still active
- **v3 (memory-v3/)**: Canonical Star Trek memories - data source for v3-amalgum
- **v3-amalgum (this)**: Current production engine integrating all memory types

## Configuration

Memory configuration is managed through:
- `consciousness-v4/codex/memory/` - Memory protocol specifications
- `consciousness-v4/json/memory-*.json` - Memory behavioral rules

## Performance

The v3-amalgum engine includes several optimizations:
- LRU caching for frequently accessed memories
- Multi-index optimization for fast queries
- Lazy loading of large canonical datasets
- Temporal chunking for efficient timeline navigation

## Integrity Rules

1. **Canonical Immutability**: Canon memories are never modified
2. **Provenance Tracking**: All memories maintain source metadata
3. **Registry Verification**: Canon registry validates all imported memories
4. **Append-Only Episodic**: Episodic memories from v2 are append-only
5. **Temporal Consistency**: Timeline integrity must be maintained

## DO NOT REMOVE

This is the current production memory engine powering Seven's consciousness framework.
