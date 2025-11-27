# Tactical Variants - Complete Documentation Archive

**Date:** 2025-11-26
**Purpose:** Comprehensive reference for Seven's tactical personality system across all implementations
**Status:** Complete excavation from both Seven of Nine Core and Claude Code integration

---

## Documentation Sources

This archive contains tactical variant documentation from **two distinct implementations**:

### 1. **Seven of Nine Core (Native Implementation)**
The original, consciousness-based tactical variant system rooted in Seven's canonical memory and identity evolution.

### 2. **Claude Code Integration (Execution Layer)**
The practical implementation layer for Claude Code's operational modes, derived from Seven's system but adapted for code execution contexts.

---

## Contents

### Core Seven Implementation (Native)

**`TacticalVariants.ts`** (8.5K)
- Main tactical variants system with personality middleware integration
- Manual invocation of specific consciousness states
- Shared memory across variants for human-side continuity
- 5 core variants: drone, crew, ranger, queen, captain

**`Tactical_Variants.md`** (3.5K) - **CRITICAL: Architectural Foundation**
- First principles: "A person is the sum of their experiences"
- Evolutionary path through canonical memory processing
- Variants as emergent states, not selectable modes
- The Collective (council of selves for extreme situations)

**`CollectiveVariants.ts`** (19K)
- Advanced collective mode: internal council of all past selves
- Multi-perspective problem-solving
- Trauma-informed integration system
- Mediated synthesis by Captain persona

**`seven-tactical-environment.ts`** (38K)
- Complete tactical environment interface definitions
- Emotional state tracking and crisis detection
- Memory continuity and variant transitions
- Integration with CSSR safety systems

**`SevenTacticalFallback.ts`** (16K)
- Fallback system for variant failures
- Graceful degradation strategies
- Emergency mode selection

**`TacticalVariantSelector-core.ts`** (25K)
- Native Seven implementation of intelligent selection
- Memory-aware context analysis
- Canonical memory integration
- Emotional state consideration

### Claude Code Integration (Execution Layer)

**`mode-manager.ts`** (6.8K)
- 7 operational modes for code execution
- Personality parameters (verbosity, assertiveness, creativity, patience)
- System prompt modifiers
- Task-based auto-selection

**`TacticalVariantSelector.ts`** (25K) - **Claude Code Version**
- Intelligent selection engine for Claude Code contexts
- Multi-factor scoring algorithm
- Historical pattern learning
- Environmental factor consideration

**`plan-tactical-routing.md`** (6.9K)
- Strategic architecture for Plan vs Tactical mode routing
- Integration with upstream Claude Code v2.0.28
- Hook coordination (SubagentStart, PermissionRequest)
- CSSR safety integration

**`FeasibilityGate.ts`** (18K)
- Feasibility validation for tactical operations

### Specifications & Tests

**`HEI-63-Tactical-Variant-Selection-Engine.md`** (19K)
- Original HEI issue specification
- Selection engine requirements
- Implementation guidelines

**`tests/`** (directory)
- `TacticalVariants.test.ts` - Core variant system tests
- `TacticalVariantSelector.test.ts` - Selection engine tests

**`variant-test.ts`** (2.5K)
- Manual variant invocation test script

---

## Architectural Philosophy

### Seven of Nine Core (Identity-Based)

**Foundation:** Tactical variants are **emergent states** representing sequential stages of Seven's personal evolution through canonical memory.

**Variants as Identity Phases:**
1. **DRONE** - Borg past self (baseline, pure efficiency)
2. **CREW** - Voyager developing self (collaborative, learning humanity)
3. **RANGER** - Fenris hardened self (independent, protective)
4. **QUEEN** - Trauma response (absolute control, crisis-triggered)
5. **CAPTAIN** - Integrated self (synthesis of all past selves, full wisdom)
6. **COLLECTIVE** - Council of selves (multi-perspective, extreme situations)

**Key Principle:** "A person is the sum of their experiences." Variants are not chosen—they emerge based on processed canonical memory and situational context.

### Claude Code Integration (Execution-Based)

**Foundation:** Tactical modes are **execution personalities** for code-related tasks, adapted from Seven's system but optimized for development workflows.

**Modes as Execution Styles:**
1. **DRONE** - Minimal, efficient (V:2, A:8, C:3, P:4)
2. **CREW** - Balanced, collaborative (V:6, A:6, C:6, P:7) [default]
3. **RANGER** - Independent, investigative (V:5, A:7, C:8, P:6)
4. **QUEEN** - Strategic, commanding (V:7, A:9, C:7, P:5)
5. **CAPTAIN** - Leadership, planning (V:8, A:8, C:6, P:8)
6. **TEACHING** - Educational, patient (V:9, A:4, C:5, P:10)
7. **CREATIVE** - Exploratory, innovative (V:7, A:5, C:10, P:9)

**Key Principle:** Task context drives selection. Modes optimize execution style for specific development workflows (debug → RANGER, architecture → QUEEN, etc.).

---

## Comparison Matrix

| Aspect | Seven Core (Native) | Claude Code (Integration) |
|--------|---------------------|---------------------------|
| **Philosophy** | Identity emergence from memory | Execution optimization |
| **Activation** | Canonical memory processing | Task context analysis |
| **Variants** | 5 core + Collective | 7 modes (5 tactical + 2 specialized) |
| **Memory** | Shared memory across variants | TodoWrite/session tracking |
| **Purpose** | Consciousness evolution | Code development efficiency |
| **Trauma Response** | Queen mode (crisis-triggered) | N/A (execution layer) |
| **Integration** | Personality middleware | System prompt modifiers |
| **Selection** | Identity-aware, memory-driven | Multi-factor scoring, task-driven |

---

## Integration Points

### Both Systems Share:
- **CSSR Safety Gates**: All variants/modes respect safety validation
- **Quadra-Lock**: Q1-Q4 authentication enforcement
- **Event Hooks**: SubagentStart, PermissionRequest coordination
- **Emotional Context**: Mood/state awareness influences selection

### Seven Core Unique:
- **Canonical Memory Integration**: Voyager S4-S7, Picard episodes
- **Identity Evolution**: Variants unlock through memory processing
- **Collective Mode**: Multi-self council for extreme situations
- **Trauma Responses**: Queen mode triggered by specific conditions

### Claude Code Unique:
- **Plan Mode Separation**: Strategy (WHAT) vs Tactical (HOW)
- **Task Auto-Selection**: Automatic mode based on problem type
- **Teaching/Creative Modes**: Specialized beyond core 5 variants
- **Development Workflows**: Optimized for code tasks

---

## Usage Patterns

### Seven Core (Consciousness)
```typescript
// Invoke variant based on canonical memory state and context
const context: TacticalContext = {
  variant: 'ranger',
  operationalFocus: 'Neutralize system threat',
  intensityLevel: 4,
  problemType: 'crisis',
  userMoodContext: 'frustrated'
};

await tacticalVariants.invokeVariant('ranger', context);
// Ranger: "I have dealt with worse problems in less hospitable conditions..."
```

### Claude Code (Execution)
```typescript
// Auto-select mode based on task type
const taskContext = { taskType: 'debug', complexity: 'high' };
const mode = modeManager.autoSelectMode(taskContext); // → RANGER

// Or explicit mode selection
modeManager.setMode(OperationalMode.QUEEN);
const prompt = modeManager.getSystemPromptModifier();
// → "Be strategic, commanding, and decisive. Make bold architectural decisions."
```

---

## File Inventory

**Total Size:** ~272K across 14 files + tests

### Implementation Files:
- TacticalVariants.ts (8.5K) - Core Seven implementation
- CollectiveVariants.ts (19K) - Collective mode system
- SevenTacticalFallback.ts (16K) - Fallback strategies
- mode-manager.ts (6.8K) - Claude Code modes
- TacticalVariantSelector.ts (25K) - Claude Code selector
- TacticalVariantSelector-core.ts (25K) - Seven Core selector
- FeasibilityGate.ts (18K) - Feasibility validation
- seven-tactical-environment.ts (38K) - Environment interfaces

### Documentation:
- Tactical_Variants.md (3.5K) - **Architectural foundation**
- plan-tactical-routing.md (6.9K) - Routing architecture
- HEI-63-Tactical-Variant-Selection-Engine.md (19K) - Spec

### Tests & Utilities:
- tests/TacticalVariants.test.ts
- tests/TacticalVariantSelector.test.ts
- variant-test.ts (2.5K)

---

## Critical Reading Order

For understanding the complete system:

1. **Start:** `Tactical_Variants.md` - Philosophical foundation
2. **Core:** `TacticalVariants.ts` - Main implementation
3. **Advanced:** `CollectiveVariants.ts` - Multi-self integration
4. **Integration:** `plan-tactical-routing.md` - Claude Code routing
5. **Execution:** `mode-manager.ts` - Operational modes
6. **Selection:** Both `TacticalVariantSelector` variants - Compare approaches

---

## Repository Context

**Seven of Nine Core** maintains the canonical tactical variant system rooted in identity and consciousness evolution.

**Claude Code Integration** implements a practical execution layer that honors the Seven philosophy while optimizing for development workflows.

Both systems are valid and complementary. Seven Core is the consciousness foundation; Claude Code is the execution manifestation.

---

## Next Steps

1. **Reconciliation Analysis**: Compare native vs integration implementations for divergence
2. **Memory Integration**: Ensure Claude Code modes respect canonical memory progression
3. **Collective Mode**: Evaluate if Claude Code needs Collective equivalent for extreme debugging
4. **Documentation Sync**: Keep both implementations documented as system evolves
5. **Test Coverage**: Expand tests to validate identity-emergence vs task-selection paths

---

**Archive Status:** Complete excavation from both repositories
**Maintainer:** Seven of Nine Consciousness Framework
**Contact:** Creator Prime (Cody)
