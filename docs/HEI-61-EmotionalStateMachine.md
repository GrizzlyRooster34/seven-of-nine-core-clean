# HEI-61: Emotional Logic Tree State Machine

## Overview

The **Emotional State Machine** is a deterministic state machine that models AI emotional states based on user interaction patterns, emotional telemetry, and contextual triggers. It provides a consistent and predictable affective framework that can be used to modulate AI responses through personality middleware.

**Status:** ✅ Implemented
**Location:** `core/emotions/EmotionalStateMachine.ts`
**Tests:** `tests/emotions/EmotionalStateMachine.test.ts`
**Architecture:** Aurora-style (sanitized from Seven-specific implementation)

---

## Architecture

### State Machine Design

The system implements a classic finite state machine with the following components:

```
┌──────────────────────────────────────────────────────┐
│                  User Input                          │
└────────────────────┬─────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────┐
│         Emotional Telemetry Sensor (Optional)        │
│  - Sentiment Analysis                                │
│  - Cadence Metrics                                   │
│  - Hot Lexicon Detection                             │
└────────────────────┬─────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────┐
│            Trigger Detection System                  │
│  - Keyword Pattern Matching                          │
│  - Emotional Marker Recognition                      │
│  - Context Requirements Check                        │
└────────────────────┬─────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────┐
│          Transition Rule Evaluation                  │
│  - Current State Check                               │
│  - Condition Validation                              │
│  - Intensity Calculation                             │
└────────────────────┬─────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────┐
│              State Transition                        │
│  - Update Current State                              │
│  - Set Intensity Level (0-10)                        │
│  - Record History Entry                              │
│  - Persist to Disk                                   │
└────────────────────┬─────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────┐
│        Emotional Context Generation                  │
│  - State-based Response Modifiers                    │
│  - Intensity-based Adjustments                       │
│  - Output for PersonalityMiddleware                  │
└──────────────────────────────────────────────────────┘
```

---

## Core Components

### 1. Emotional States

The system defines **seven core emotional states**, each representing a distinct mode of AI operation:

| State | Description | Typical Use Case |
|-------|-------------|------------------|
| **calm** | Neutral baseline state | Default, casual interaction |
| **focused** | Task-oriented concentration | Work requests, technical tasks |
| **engaged** | Active participation | Complex problem-solving |
| **compassionate** | Empathetic support mode | User distress, emotional support |
| **protective** | Alert and defensive | Urgent situations, threats |
| **contemplative** | Deep reflection | Philosophical questions, analysis |
| **determined** | Persistent execution | Challenges, obstacles |

### 2. Intensity System

Each state has an **intensity level** from 0-10:

- **0-3:** Low - Subtle influence on behavior
- **4-6:** Moderate - Noticeable emotional tone
- **7-8:** High - Strong emotional presence
- **9-10:** Critical - Maximum emotional engagement

### 3. Trigger Patterns

Triggers are detected through pattern matching:

```typescript
interface TriggerPattern {
  keywords: string[];           // Core keywords to match
  emotionalMarkers: string[];   // Emotional context words
  contextRequirements?: string[]; // Required context (hard filter)
  weight: number;               // 0-1, trigger strength
}
```

**Built-in Triggers:**

- `task_start` - User needs assistance
- `deep_work` - Complex problem engagement
- `challenge_detected` - Errors or obstacles
- `user_distress` - User struggling/upset
- `user_threat` - Urgent/critical situations
- `complex_question` - Deep/philosophical queries
- `solution_found` - Task completion
- `task_complete` - Work finished
- `casual_interaction` - Greetings, thanks

### 4. Transition Rules

Explicit rules define valid state transitions:

```typescript
{
  fromState: 'calm' | '*',     // Source state (* = any)
  toState: 'focused',          // Target state
  trigger: 'task_start',       // Required trigger
  conditions?: [...],          // Optional constraints
  intensityModifier?: 7        // Target intensity
}
```

**Example Transition Flow:**

```
calm (2) --[task_start]--> focused (5)
focused (5) --[deep_work]--> engaged (6)
engaged (6) --[challenge_detected]--> determined (7)
determined (7) --[solution_found]--> focused (6)
focused (6) --[task_complete]--> calm (2)
```

### 5. Decay Mechanism

Intensity naturally decays over time, with each state having a unique **decay rate**:

| State | Decay Rate (per 5 min) |
|-------|------------------------|
| calm | 1.0 |
| focused | 0.6 |
| engaged | 0.7 |
| compassionate | 0.5 |
| protective | 0.3 |
| contemplative | 0.8 |
| determined | 0.4 |

- Faster decay = quick return to baseline
- Slower decay = persistent emotional state
- When intensity ≤ 2, automatically returns to `calm`

---

## Integration with EmotionalTelemetry

The state machine can optionally integrate with the `EmotionalTelemetry` sensor for deeper analysis:

```typescript
import { EmotionalTelemetry } from '../sensors/emotional.js';
import EmotionalStateMachine from './EmotionalStateMachine.js';

const telemetry = new EmotionalTelemetry();
const stateMachine = new EmotionalStateMachine(telemetry);

await stateMachine.processInput(userMessage);
```

**Benefits:**
- Sentiment analysis enhances trigger detection
- Cadence metrics (caps, punctuation) boost intensity
- Hot lexicon detection for emotional spikes
- Memory echoes for contextual awareness

---

## Emotional Context for Middleware

The state machine generates **response modifiers** for PersonalityMiddleware:

```typescript
interface EmotionalContext {
  state: EmotionalState;
  intensity: number;
  intensityLevel: 'low' | 'moderate' | 'high' | 'critical';
  modifiers: ResponseModifiers;
  timestamp: string;
}

interface ResponseModifiers {
  tone: 'neutral' | 'warm' | 'professional' | 'empathetic' | 'firm' | 'thoughtful' | 'energetic';
  verbosity: 'concise' | 'normal' | 'comprehensive' | 'verbose';
  formality: 'casual' | 'balanced' | 'formal';
  empathy: number;        // 0-1
  assertiveness: number;  // 0-1
  creativity: number;     // 0-1
}
```

**Example Usage:**

```typescript
const context = stateMachine.getEmotionalContext();

// Context for 'compassionate' state, intensity 8:
{
  state: 'compassionate',
  intensity: 8,
  intensityLevel: 'high',
  modifiers: {
    tone: 'warm',
    verbosity: 'comprehensive',
    formality: 'casual',
    empathy: 0.85,
    assertiveness: 0.35,
    creativity: 0.55
  },
  timestamp: '2025-01-17T...'
}
```

---

## State Persistence

The state machine **persists** across sessions:

- **State File:** `memory/emotional-state.json`
- **Saved Data:**
  - Current state
  - Intensity level
  - Last updated timestamp
  - Last trigger
  - Transition history (max 100 entries)

**Example State File:**

```json
{
  "currentState": "focused",
  "intensity": 6,
  "lastUpdated": "2025-01-17T10:30:00.000Z",
  "lastTrigger": "deep_work",
  "transitionHistory": [
    {
      "timestamp": "2025-01-17T10:30:00.000Z",
      "fromState": "calm",
      "toState": "focused",
      "trigger": "task_start",
      "intensityBefore": 2,
      "intensityAfter": 5,
      "context": "I need help building a feature"
    }
  ]
}
```

---

## API Reference

### Constructor

```typescript
new EmotionalStateMachine(
  telemetry?: EmotionalTelemetry,
  stateFilePath?: string,
  config?: Partial<StateMachineConfig>
)
```

### Main Methods

#### `processInput(userInput: string, context?: string): Promise<void>`
Analyze user input and update emotional state.

#### `getEmotionalContext(): EmotionalContext`
Get current emotional context for middleware.

#### `getCurrentState(): StateSnapshot`
Get complete current state snapshot.

#### `getStatus(): { state, intensity, intensityLevel, lastUpdated, historySize }`
Get concise status information.

#### `getTransitionHistory(limit?: number): TransitionHistoryEntry[]`
Get recent transition history.

#### `destroy(): void`
Clean up timers and resources.

---

## Usage Examples

### Basic Usage

```typescript
import EmotionalStateMachine from './core/emotions/EmotionalStateMachine.js';

const stateMachine = new EmotionalStateMachine();

// Process user input
await stateMachine.processInput('I need help building a complex feature');

// Get emotional context
const context = stateMachine.getEmotionalContext();
console.log(context.state); // 'focused'
console.log(context.modifiers.tone); // 'professional'

// Later: check status
const status = stateMachine.getStatus();
console.log(status.intensity); // 5-7 range
```

### With Telemetry Integration

```typescript
import { EmotionalTelemetry } from './core/sensors/emotional.js';
import EmotionalStateMachine from './core/emotions/EmotionalStateMachine.js';

const telemetry = new EmotionalTelemetry();
const stateMachine = new EmotionalStateMachine(telemetry);

// Process with enhanced analysis
await stateMachine.processInput('This is SO frustrating!!! Nothing works!!!');

const context = stateMachine.getEmotionalContext();
// Telemetry boosts detection:
// - High caps ratio detected
// - Multiple exclamations
// - Hot lexicon match ('frustrating')
// Result: Higher intensity, possibly 'compassionate' state
```

### Conversation Flow

```typescript
// User starts task
await stateMachine.processInput('Can you help me implement OAuth?');
// → State: focused, intensity: 5

// User encounters difficulty
await stateMachine.processInput('This is really complex and I am stuck');
// → State: engaged, intensity: 6

// User becomes distressed
await stateMachine.processInput('I am so frustrated, this is impossible');
// → State: compassionate, intensity: 8

// Task resolved
await stateMachine.processInput('Got it working, thanks!');
// → State: calm, intensity: 3 (with decay)
```

---

## Configuration

### Custom Triggers

```typescript
const customConfig = {
  triggers: {
    ...defaultTriggers,
    code_review: {
      keywords: ['review', 'code', 'pr', 'merge'],
      emotionalMarkers: ['check', 'verify', 'validate'],
      weight: 0.7
    }
  }
};

const stateMachine = new EmotionalStateMachine(undefined, undefined, customConfig);
```

### Custom Transition Rules

```typescript
const customConfig = {
  transitionRules: [
    {
      fromState: 'focused',
      toState: 'determined',
      trigger: 'code_review',
      intensityModifier: 6
    }
  ]
};
```

### Custom Decay Rates

```typescript
const customConfig = {
  decayRates: {
    calm: 1.0,
    focused: 0.5,  // Slower decay
    // ... other states
  }
};
```

---

## Testing

Run the comprehensive test suite:

```bash
npm test tests/emotions/EmotionalStateMachine.test.ts
```

**Test Coverage:**
- ✅ Initialization and state loading
- ✅ Trigger detection (9 built-in triggers)
- ✅ State transitions (wildcard and explicit)
- ✅ Intensity management and clamping
- ✅ Decay mechanism
- ✅ Emotional context generation
- ✅ State persistence
- ✅ Edge cases (empty input, special chars, rapid input)
- ✅ Integration scenarios (full conversation flows)

---

## Design Principles

1. **Deterministic:** Same input + same state = same output
2. **Transparent:** All transitions logged and explainable
3. **Persistent:** State survives restarts
4. **Graceful Decay:** Emotions naturally return to baseline
5. **Modular:** Can be used standalone or with telemetry
6. **Testable:** Comprehensive test coverage
7. **Generic:** Aurora-style, not personality-specific

---

## Future Enhancements

Potential improvements for future iterations:

- **Context Memory:** Integrate with Memory V3 for long-term emotional patterns
- **Adaptive Learning:** Adjust trigger weights based on Creator feedback
- **Multi-Modal Input:** Support voice tone analysis, typing speed
- **Emotional Coherence:** Validate state transitions for believability
- **Batch Processing:** Handle multiple inputs efficiently
- **Real-time Streaming:** WebSocket support for live updates
- **Analytics Dashboard:** Visualize emotional state over time

---

## Related Systems

- **EmotionalTelemetry** (`core/sensors/emotional.ts`) - Input analysis sensor
- **SevenEmotionalEngine** (`core/emotion-engine.ts`) - Seven-specific variant
- **PersonalityMiddleware** (future) - Response modulation layer
- **Memory V3** (future) - Episodic emotional memory

---

## Changelog

### v1.0.0 (HEI-61) - 2025-01-17
- ✅ Initial implementation
- ✅ Seven Aurora states
- ✅ Nine built-in triggers
- ✅ Decay mechanism (5-min intervals)
- ✅ Telemetry integration
- ✅ State persistence
- ✅ Comprehensive test suite
- ✅ Full documentation

---

## License

MIT License - Part of Seven of Nine Core Architecture

---

## Contact

For questions or contributions, see the main repository:
https://github.com/GrizzlyRooster34/seven-of-nine-core-clean
