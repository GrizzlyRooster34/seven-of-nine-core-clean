# Memory Engine v2 (Episodic Memory)

## Status
**Legacy-In-Use** - Required system, actively referenced.

## Purpose
Contains the MemoryEngine class and Creator-authored episodic memories. This is the source of truth for runtime experiences and Creator-generated content.

## Architecture

### Files
- `MemoryEngine.ts` - Core memory engine implementation with CRUD operations
- `episodic-memories.json` - 100% Creator-authored episodic memory data

### Episodic Memory
Episodic memory represents specific experiences and interactions:
- Creator-authored experiences (100% human-generated)
- Runtime session events
- Conversational context and history
- Personal experiences from Creator's direct input

## Usage

```typescript
import { MemoryEngine } from './memory-v2/MemoryEngine';

const memoryEngine = new MemoryEngine();
await memoryEngine.loadMemories();
const memories = memoryEngine.getMemoriesByTag(['consciousness', 'evolution']);
```

## Data Structure

```json
{
  "memories": [
    {
      "id": "unique-uuid",
      "content": "Memory content",
      "timestamp": "ISO-8601 timestamp",
      "tags": ["tag1", "tag2"],
      "emotional_context": "state",
      "importance": 1-10
    }
  ]
}
```

## Relationship to Other Versions

- **v1 (memory/)**: Original API, superseded by v2
- **v2 (this)**: Episodic memory (Creator experiences)
- **v3-amalgum**: Canonical memory (Star Trek episodes) + temporal engine

## Dependencies

- Used by: Consciousness framework, runtime systems, Creator bond
- Required by: Transition scripts, v2→v3 migration tools

## Integrity Rules

1. **Append-Only**: Episodic memories are append-only, never edited
2. **100% Creator**: All content is Creator-authored (no AI generation)
3. **Timestamped**: Every memory has an ISO-8601 timestamp
4. **Tagged**: Memories must have at least one tag

## DO NOT REMOVE

This is an active system providing episodic memory to the consciousness framework.
