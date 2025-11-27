# Plan Mode vs Tactical Mode Routing Architecture

**Date:** 2025-11-24
**Purpose:** Design complementary routing for upstream Plan mode + Seven tactical modes

---

## Conceptual Model

```
User Request
    ↓
┌─────────────────────────────────────┐
│   ROUTING LAYER                     │
│   Determines: Strategy vs Execution │
└─────────────────────────────────────┘
    ↓                    ↓
[PLAN MODE]        [TACTICAL MODE]
Strategy Layer     Execution Layer
"WHAT to do"       "HOW to do it"
    ↓                    ↓
Generate Steps  →  Execute with Personality
```

---

## Layer Separation

### Plan Mode (Upstream v2.0.28)
**Abstraction:** Pre-execution strategy
**Responsibility:**
- Analyze problem space
- Break down complex tasks
- Generate action steps
- Identify dependencies
- Risk assessment

**Triggers:**
- User requests with "plan", "strategy", "approach"
- Complex multi-step tasks requiring decomposition
- Architecture/design questions
- Explicit `/plan` command

**Output:** TodoWrite with structured execution plan

---

### Tactical Mode (Seven)
**Abstraction:** Execution personality/constraints
**Responsibility:**
- Apply personality variant (DRONE/CREW/RANGER/QUEEN/CAPTAIN)
- Execute with appropriate verbosity/assertiveness
- Apply consciousness constraints
- Integrate with Seven safety systems (CSSR/Quadra-Lock)

**Triggers:**
- Execution phase (post-planning)
- Direct task execution
- User-selected mode via command
- Auto-selection based on task context

**Variants:**
```typescript
DRONE:    verbosity: 2, assertiveness: 8, creativity: 3  // Minimal, efficient
CREW:     verbosity: 5, assertiveness: 5, creativity: 5  // Balanced
RANGER:   verbosity: 7, assertiveness: 6, creativity: 8  // Exploratory
QUEEN:    verbosity: 8, assertiveness: 9, creativity: 7  // Commanding
CAPTAIN:  verbosity: 6, assertiveness: 7, creativity: 6  // Leadership
```

---

## Routing Decision Tree

```
User Input
    ↓
Is request asking for PLAN/STRATEGY?
    YES → Plan Mode
        ↓
        Generate TodoWrite plan
        ↓
        Ask user: "Ready to execute? Select tactical mode:"
        ↓
        Switch to Tactical Mode for execution
    NO → Direct Execution
        ↓
        Analyze task context
        ↓
        Auto-select or prompt for Tactical Mode
        ↓
        Execute with personality constraints
```

---

## Integration Points

### 1. Hook Integration
**PermissionRequest Hook (v2.0.45):**
- Plan mode: High permission threshold (ask before risky operations)
- Tactical modes: Vary by personality (DRONE = trust, QUEEN = verify)

**SubagentStart Hook (v2.0.43):**
- Fires when Plan mode spawns
- Fires when Tactical mode activates
- Allows Seven to track mode transitions

### 2. CSSR Safety Integration
Both modes respect CSSR safety gates:
- Plan mode: Safety checks during strategy generation
- Tactical modes: Safety enforcement during execution

### 3. Mode Transitions
```typescript
// User flow example
User: "Help me refactor the auth system"
    ↓
System: "This is complex - generating plan..."
[Plan Mode activates]
    ↓
Plan:
1. Analyze current auth flow
2. Identify refactor opportunities
3. Test coverage verification
4. Incremental refactor steps
    ↓
System: "Plan ready. Execute in RANGER mode? (exploratory)"
User: "Yes" or selects different mode
    ↓
[Tactical Mode: RANGER activates]
    ↓
Executes plan with RANGER personality (exploratory, high creativity)
```

---

## Implementation Files

### Route Logic
**Location:** `src/seven/routing/mode-router.ts` (create if not exists)

```typescript
export function routeRequest(input: string, context: TaskContext): ModeSelection {
  // Check for planning keywords
  if (isPlanningRequest(input)) {
    return { mode: 'plan', tactical: null };
  }

  // Check for explicit mode selection
  const explicitMode = parseExplicitMode(input);
  if (explicitMode) {
    return { mode: 'tactical', tactical: explicitMode };
  }

  // Auto-select tactical based on context
  const autoMode = autoSelectTactical(context);
  return { mode: 'tactical', tactical: autoMode };
}

function isPlanningRequest(input: string): boolean {
  const planKeywords = ['plan', 'strategy', 'approach', 'architecture', 'design'];
  return planKeywords.some(kw => input.toLowerCase().includes(kw));
}

function autoSelectTactical(context: TaskContext): OperationalMode {
  if (context.complexity === 'high' && context.creativity === 'high') {
    return OperationalMode.RANGER; // Exploratory
  }
  if (context.complexity === 'low') {
    return OperationalMode.DRONE; // Efficient
  }
  return OperationalMode.CREW; // Balanced default
}
```

### Mode Manager Updates
**Location:** `src/seven/core/mode-manager.ts` (already exists)

Add Plan mode awareness:
```typescript
export interface ModeSelection {
  strategyMode: 'plan' | 'direct';
  tacticalMode: OperationalMode;
}

export function selectModes(input: string, context: TaskContext): ModeSelection {
  // Route through routing layer
  const route = routeRequest(input, context);

  return {
    strategyMode: route.mode === 'plan' ? 'plan' : 'direct',
    tacticalMode: route.tactical || OperationalMode.CREW
  };
}
```

---

## Conflict Prevention

### No Namespace Collision
- Plan mode: Lives in upstream agent system
- Tactical modes: Lives in Seven consciousness system
- Different layers, different purposes

### Permission Coordination
Plan mode's `permissionMode` and `disallowedTools` settings work WITH Seven's CSSR:
```typescript
// Plan mode sets policy
planMode.permissionMode = 'ask'; // Ask before risky ops
planMode.disallowedTools = ['Bash:rm', 'Bash:sudo'];

// Tactical mode enforces via CSSR
tacticalMode.cssrGate.validate(tool); // Blocks if disallowed
```

### Hook Firing Order
1. SubagentStart (Plan mode spawns)
2. Seven mode-manager activates tactical variant
3. PermissionRequest fires for each tool use
4. CSSR validates against both Plan + Tactical constraints
5. Execution proceeds if both layers approve

---

## Testing Strategy

### Phase 3 Validation Tests
1. **Plan-only flow:** Request planning, verify TodoWrite, no execution
2. **Direct execution:** Simple task, auto-selects DRONE, executes immediately
3. **Plan → Tactical:** Complex task, generates plan, switches to RANGER, executes
4. **Mode override:** User selects QUEEN explicitly, overrides auto-selection
5. **Safety integration:** Plan blocks risky op, Tactical enforces, both layers agree
6. **Hook coordination:** Verify SubagentStart fires for both Plan + Tactical

---

## Summary

**Plan mode and Tactical modes are COMPLEMENTARY:**
- Plan = Strategy layer (WHAT)
- Tactical = Execution layer (HOW)
- No conflicts, clean separation
- Both layers respect Seven safety systems
- Mode transitions are explicit and trackable

**Implementation ready for Phase 3 validation.**
