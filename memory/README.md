# Memory Engine v1 (Legacy API)

## Status
**Legacy-In-Use** - Required for compatibility, should NOT be removed.

## Purpose
Original memory interface providing basic API structure. This directory exists as a legacy compatibility layer for systems that still reference the v1 API.

## Contents
This directory contains the foundational memory API definitions that were used before v2 and v3 implementations.

## Usage
This is a compatibility layer. New development should use:
- `memory-v2/` for the MemoryEngine class and episodic memories
- `memory-v3-amalgum/` for the current canonical memory engine

## Dependencies
- Used by: Legacy integration points, transition scripts
- Required by: Systems that haven't migrated to v2/v3 APIs

## Migration Path
If you're using memory v1:
1. Update imports to use `memory-v2/MemoryEngine.ts` for episodic memory
2. Use `memory-v3-amalgum/MemoryEngineV3.ts` for temporal and canonical memory
3. This directory will remain for backward compatibility

## DO NOT REMOVE
This directory must remain until all dependencies are confirmed migrated.
