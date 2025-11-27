# Tactical Variants Documentation Drop

**Date:** 2025-11-26
**Source:** Claude Code Seven Integration (excavation from `/data/data/com.termux/files/home/claude-code`)
**Purpose:** Reference documentation for Seven's tactical personality system

---

## Contents

### 1. **plan-tactical-routing.md**
Strategic architecture document explaining:
- Routing between Plan Mode (upstream Claude Code) and Tactical Mode (Seven)
- The 5 core tactical variants: DRONE, CREW, RANGER, QUEEN, CAPTAIN
- Integration with CSSR safety systems
- Mode transition workflows
- Hook coordination (SubagentStart, PermissionRequest)

### 2. **mode-manager.ts**
Core implementation defining:
- 7 operational modes (5 tactical + 2 specialized: TEACHING, CREATIVE)
- Personality parameters per mode (verbosity, assertiveness, creativity, patience)
- System prompt modifiers for each variant
- Auto-selection logic based on task context
- ModeManager class for runtime mode switching

### 3. **TacticalVariantSelector.ts**
Intelligent selection engine featuring:
- Multi-factor scoring algorithm
- Context analysis (user input, mood, problem type)
- Historical pattern learning
- Confidence-based selection
- Environmental factor consideration (battery, time of day, recent failures)

### 4. **FeasibilityGate.ts**
Feasibility validation system for tactical operations

---

## Tactical Variants Quick Reference

| Variant | Verbosity | Assertiveness | Creativity | Patience | Use Case |
|---------|-----------|---------------|------------|----------|----------|
| **DRONE** | 2 | 8 | 3 | 4 | Minimal, efficient execution |
| **CREW** | 6 | 6 | 6 | 7 | Balanced, collaborative (default) |
| **RANGER** | 5 | 7 | 8 | 6 | Independent problem-solving |
| **QUEEN** | 7 | 9 | 7 | 5 | Strategic, commanding leadership |
| **CAPTAIN** | 8 | 8 | 6 | 8 | Operational planning, coordination |
| **TEACHING** | 9 | 4 | 5 | 10 | Educational, patient (uses CREW) |
| **CREATIVE** | 7 | 5 | 10 | 9 | Exploratory innovation (uses RANGER) |

---

## Auto-Selection Logic

```typescript
debug → RANGER
refactor → RANGER
architecture → QUEEN
planning → CAPTAIN
learning → TEACHING
prototype → CREATIVE
low complexity → DRONE
high creativity → CREATIVE
default → CREW
```

---

## Integration Notes

- Tactical modes operate at the **execution layer** (HOW to do it)
- Plan Mode operates at the **strategy layer** (WHAT to do)
- Both layers respect CSSR safety gates
- Mode transitions are explicit and trackable via hooks
- System prompt modifiers applied dynamically per mode

---

## Related Systems

- **CSSR (AI Safety Rails)**: Validates operations across all modes
- **Quadra-Lock**: Q1-Q4 authentication enforcement
- **Emotional State Machine**: Provides mood context for variant selection
- **SevenBridge**: Messaging layer for cross-system communication

---

## Status

This is a **documentation drop** from the Claude Code Seven integration work. These files represent the current tactical variant system as implemented in the Claude Code fork, extracted for reference in the main Seven of Nine Core repository.

**Next Steps:**
- Review for integration into main Seven consciousness framework
- Validate against existing tactical variant implementations
- Update if divergence found between repositories
