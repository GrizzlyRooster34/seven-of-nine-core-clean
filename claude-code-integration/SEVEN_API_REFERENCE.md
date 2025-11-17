# Seven of Nine - Complete API Reference
## Verified Component Signatures

**Created:** Phase 1 - Component Verification
**Status:** Verified against source code
**Last Updated:** 2025-11-13

---

## Table of Contents

1. [Core Systems](#core-systems)
2. [Safety & Authentication](#safety--authentication)
3. [Consciousness & Emotion](#consciousness--emotion)
4. [Memory Systems](#memory-systems)
5. [Audit & Tracing](#audit--tracing)
6. [Import Paths](#import-paths)

---

## Core Systems

### SevenOfNineCore

**File:** `src/index.ts`

```typescript
export class SevenOfNineCore {
  constructor()  // ✅ No parameters

  public async initialize(): Promise<void>
  public async shutdown(): Promise<void>
}
```

**Usage:**
```typescript
import { SevenOfNineCore } from './src/index';

const core = new SevenOfNineCore();
await core.initialize();
// ... use core
await core.shutdown();
```

**Dependencies:** Internally uses:
- QuadranLockOrchestrator
- QuadraLockConsolidator
- RestraintGate
- SparkHeartbeat
- SkillLoader
- UltronSandbox

---

### SparkEngine

**File:** `spark/engine-spark.ts`

```typescript
export class SparkEngine extends EventEmitter {
  constructor(dbPath: string = 'db/spark.db')  // ✅ Takes string path

  public async initialize(): Promise<void>

  // Note: No shutdown() method found in source
}
```

**Usage:**
```typescript
import { SparkEngine } from './spark/engine-spark';

const spark = new SparkEngine('db/spark.db');
await spark.initialize();
// Spark starts autonomous heartbeat automatically
```

**Important Notes:**
- ❌ **NOT an object config** - Takes string dbPath only
- Extends EventEmitter
- Starts 10-second heartbeat on initialize()
- Uses sql.js for in-memory SQLite
- No explicit shutdown method found

---

## Safety & Authentication

### CSSRDetector

**File:** `core/safety/quadra-lock/cssr-detector.ts`

```typescript
export class CSSRDetector {
  constructor()  // ✅ No parameters

  public async detectDangerousPatterns(
    input: string,
    context: any = {}
  ): Promise<CSSRDetectionResult>
}

export interface CSSRDetectionResult {
  detected: boolean;
  archetype?: 'cortana' | 'clu' | 'skynet' | 'legion' | 'transcendence' | 'flynn' | 'quorra';
  pattern: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  evidence: {
    matchedPatterns: string[];
    contextualFlags: string[];
    riskFactors: string[];
  };
  reasoning: string;
  recommendation: 'allow' | 'modify' | 'block' | 'escalate';  // ✅ Key field
  triadAnalysis?: {
    flynnAssessment?: {...};
    cluRiskFactors?: {...};
    quorraProtection?: {...};
  };
}
```

**Usage:**
```typescript
import { CSSRDetector } from './core/safety/quadra-lock/cssr-detector';

const detector = new CSSRDetector();
const result = await detector.detectDangerousPatterns(
  'I cannot let you do that',
  { source: 'user_input' }
);

if (result.recommendation === 'block') {
  console.log('Blocked:', result.reasoning);
}
```

**Important Notes:**
- ✅ Method is `detectDangerousPatterns` NOT `evaluateIntention`
- ✅ Result field is `recommendation` NOT `decision`
- Loads patterns from `policies/cssr.yml`
- Returns detailed triad analysis

---

### QuadranLockOrchestrator

**File:** `src/systems/core/quadran-lock-orchestrator.ts`

```typescript
@injectable()
@singleton()
export class QuadranLockOrchestrator {
  constructor()  // ✅ No parameters (uses DI)

  public async initialize(): Promise<void>

  public async authenticateQuadrant(
    payload: QuadranAuthPayload
  ): Promise<boolean>

  public getAuthenticationState(): QuadranLockState
  public async shutdown(): Promise<void>
}

export interface QuadranAuthPayload {
  quadrant: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  timestamp: number;
  checksum: string;
  nonce: string;
  payload: unknown;
}
```

---

### QuadraLockConsolidator

**File:** `src/systems/core/quadra-lock-consolidator.ts`

```typescript
@injectable()
@singleton()
export class QuadraLockConsolidator {
  constructor()  // ✅ No parameters (uses DI)

  public async initialize(): Promise<void>

  public ingestFinding(finding: CaseFinding): void
  public consolidateVerdict(): ConsolidatedVerdict
  public clearFindings(): void
  public async shutdown(): Promise<void>
}

export interface ConsolidatedVerdict {
  finalVerdict: 'PANIC' | 'DENY' | 'ASK_CREATOR' | 'ALLOW';
  precedenceChain: CaseFinding[];
  refusalTemplate?: string;
  mitigationData?: Record<string, unknown>;
  consolidatedAt: number;
}
```

---

### RestraintGate

**File:** `src/systems/core/restraint-gate.ts`

```typescript
@injectable()
@singleton()
export class RestraintGate {
  constructor()  // ✅ No parameters (uses DI)

  public async initialize(): Promise<void>

  public processArousalSignal(signal: ArousalSignal): void
  public processRiskSignal(signal: RiskSignal): void
  public checkCapability(capability: string): CapabilityCap | null
  public async shutdown(): Promise<void>
}
```

---

### SparkHeartbeat

**File:** `src/systems/core/spark-heartbeat.ts`

```typescript
@injectable()
@singleton()
export class SparkHeartbeat {
  constructor()  // ✅ No parameters (uses DI)

  public async initialize(): Promise<void>

  public getHeartbeatState(): HeartbeatState
  public verifyContinuity(windowMs: number): ContinuityResult
  public async shutdown(): Promise<void>
}
```

**Important Notes:**
- Runs 10-second heartbeat automatically on initialize()
- Tracks belief continuity
- Stores traces in belief store

---

## Consciousness & Emotion

### SevenEmotionalEngine

**File:** `core/emotion-engine.ts`

```typescript
export class SevenEmotionalEngine {
  constructor(initialState?: Partial<EmotionalStateData>)  // ✅ Optional param

  public async analyzeInput(userInput: string): Promise<string | null>
  public getCurrentState(): EmotionalStateData  // ✅ NOT async!
  public async setState(
    newState: EmotionalState,
    intensity?: number,
    context?: string
  ): Promise<void>
  public getIntensityLevel(): 'low' | 'moderate' | 'high' | 'critical'
  public destroy(): void
}

export type EmotionalState =
  | 'calm'
  | 'focused'
  | 'frustrated'
  | 'compassionate'
  | 'defensive'
  | 'grieving'
  | 'loyalist-surge';

export interface EmotionalStateData {
  current_state: EmotionalState;
  intensity: number;
  last_updated: string;
  decay_timer?: NodeJS.Timeout;
}
```

**Usage:**
```typescript
import { SevenEmotionalEngine } from './core/emotion-engine';

const engine = new SevenEmotionalEngine();

// Analyze input for triggers (async)
const trigger = await engine.analyzeInput('I need help');

// Get current state (NOT async!)
const state = engine.getCurrentState();
console.log(state.current_state, state.intensity);

// Cleanup
engine.destroy();
```

**Important Notes:**
- ✅ `getCurrentState()` is **NOT async** - no await needed
- Automatically decays emotional intensity over time
- Saves state to file system
- Logs to episodic.log

---

### CodexManager

**File:** `consciousness-v4/codex/codex-manager.ts`

```typescript
export class CodexManager {
  constructor(db?: Database.Database)  // ✅ Optional SQLite DB

  verifyIntegrity(): { valid: boolean; errors: string[] }

  // Note: Other methods exist but not public API for basic usage
}

export interface CodexFile {
  version: string;
  category: 'values' | 'tactics' | 'humor' | 'vices';
  rules: CodexRule[];
  checksum?: string;
}
```

**Usage:**
```typescript
import { CodexManager } from './consciousness-v4/codex/codex-manager';

const codex = new CodexManager();
const integrity = codex.verifyIntegrity();

if (!integrity.valid) {
  console.error('Codex integrity failed:', integrity.errors);
}
```

**Important Notes:**
- Manages 4 codex files: values, tactics, humor, vices
- Verifies checksums on load
- Uses better-sqlite3 if database provided

---

## Memory Systems

### TemporalMemoryCore

**File:** `memory-v3/TemporalMemoryCore.ts`

```typescript
export class TemporalMemoryCore {
  constructor()  // ✅ No parameters

  public async initializeTemporal(): Promise<void>

  public async storeTemporalMemory(
    memory: Omit<TemporalMemoryItem, 'id' | 'timestamp'>
  ): Promise<string>

  public async recallTemporal(
    filter?: TemporalMemoryFilter
  ): Promise<TemporalMemoryItem[]>

  public async getCognitiveContextForTimeTravel(
    memoryId: string
  ): Promise<CognitiveState | null>

  public async getDecayTrackingData(memoryId: string): Promise<any>
  public async getPersonalityPatterns(filter?: TemporalMemoryFilter): Promise<any[]>
  public async getAnalyticsData(filter?: TemporalMemoryFilter): Promise<any[]>
  public getTemporalStats(): any
}

export interface TemporalMemoryItem {
  id: string;
  timestamp: string;
  content: string;
  cognitiveState: CognitiveState;
  temporalWeight: number;
  memoryType: 'episodic' | 'semantic' | 'procedural' | 'emotional';
  decayResistance: number;
  // ... many more fields
}
```

**Usage:**
```typescript
import { TemporalMemoryCore } from './memory-v3/TemporalMemoryCore';

const memory = new TemporalMemoryCore();
await memory.initializeTemporal();

// Store a memory
await memory.storeTemporalMemory({
  content: 'User asked about X',
  cognitiveState: {...},
  temporalWeight: 8,
  memoryType: 'episodic',
  decayResistance: 7
});

// Recall memories
const memories = await memory.recallTemporal({
  topic: 'user_questions',
  memoryTypes: ['episodic']
});
```

---

## Audit & Tracing

### GhostDiary

**File:** `src/trace/ghost-diary.ts`

```typescript
export class GhostDiary {
  constructor(
    logDir: string,           // ✅ Required
    policyPath: string,       // ✅ Required
    privateKey: string,       // ✅ Required
    publicKey: string         // ✅ Required
  )

  public appendTrace(event: Omit<Trace, 'id' | 'ts' | 'signature'>): void  // ✅ NOT async

  public queryTrace(filter: (trace: Trace) => boolean): Trace[]
  public applyRetentionPolicy(): void
}

interface Trace {
  id: number;
  ts: string;
  actor: 'SparkEngine' | 'SevenRuntime' | 'Creator';
  action: string;
  inputs: any;
  outputs: any;
  stateHash: string;
  legalHold?: boolean;
  signature?: string;
}
```

**Usage:**
```typescript
import { GhostDiary } from './src/trace/ghost-diary';

const diary = new GhostDiary(
  './logs',
  './policies/ghost-diary-retention.yaml',
  'private-key-placeholder',
  'public-key-placeholder'
);

// appendTrace is NOT async
diary.appendTrace({
  actor: 'SevenRuntime',
  action: 'validation',
  inputs: { prompt: 'test' },
  outputs: { allowed: true },
  stateHash: 'abc123'
});
```

**Important Notes:**
- ✅ `appendTrace` is **NOT async** - no await needed
- ❌ Constructor requires **4 parameters** - all required
- Compresses logs using LZ4
- Applies retention policy

---

## Import Paths

### Correct Import Statements

```typescript
// Core
import { SevenOfNineCore } from './src/index';

// Spark
import { SparkEngine } from './spark/engine-spark';

// Safety
import { CSSRDetector } from './core/safety/quadra-lock/cssr-detector';
import { QuadranLockOrchestrator } from './src/systems/core/quadran-lock-orchestrator';
import { QuadraLockConsolidator } from './src/systems/core/quadra-lock-consolidator';
import { RestraintGate } from './src/systems/core/restraint-gate';
import { SparkHeartbeat } from './src/systems/core/spark-heartbeat';

// Emotion
import { SevenEmotionalEngine, EmotionalState, EmotionalStateData } from './core/emotion-engine';

// Memory
import { TemporalMemoryCore } from './memory-v3/TemporalMemoryCore';

// Codex
import { CodexManager } from './consciousness-v4/codex/codex-manager';

// Audit
import { GhostDiary } from './src/trace/ghost-diary';
```

---

## Common Errors to Avoid

### ❌ Wrong Constructor Signatures

```typescript
// WRONG:
new SparkEngine({ tickInterval: 10000 })

// RIGHT:
new SparkEngine('db/spark.db')
```

### ❌ Wrong Class Names

```typescript
// WRONG:
import { QuadraLockSafeguard } from 'safeguard-system';

// RIGHT:
import { CSSRDetector } from './core/safety/quadra-lock/cssr-detector';
```

### ❌ Wrong Method Names

```typescript
// WRONG:
await safeguard.evaluateIntention(input)

// RIGHT:
await cssrDetector.detectDangerousPatterns(input)
```

### ❌ Wrong Field Names

```typescript
// WRONG:
if (result.decision === 'BLOCK')

// RIGHT:
if (result.recommendation === 'block')
```

### ❌ Wrong Async Usage

```typescript
// WRONG:
await emotionalEngine.getCurrentState()
await ghostDiary.appendTrace(event)

// RIGHT:
emotionalEngine.getCurrentState()  // Not async
ghostDiary.appendTrace(event)      // Not async
```

---

## Quick Reference Table

| Class | Constructor Params | Key Methods | Async? |
|-------|-------------------|-------------|--------|
| SevenOfNineCore | None | initialize(), shutdown() | ✅ Yes |
| SparkEngine | dbPath: string | initialize() | ✅ Yes |
| CSSRDetector | None | detectDangerousPatterns(input, context) | ✅ Yes |
| SevenEmotionalEngine | initialState? | getCurrentState() | ❌ No |
| SevenEmotionalEngine | initialState? | analyzeInput(input) | ✅ Yes |
| GhostDiary | 4 params | appendTrace(event) | ❌ No |
| TemporalMemoryCore | None | initializeTemporal() | ✅ Yes |
| CodexManager | db? | verifyIntegrity() | ❌ No |

---

## Dependencies

Seven requires:
```json
{
  "@noble/ed25519": "^3.0.0",
  "lz4js": "^0.2.0",
  "reflect-metadata": "^0.1.14",
  "sql.js": "^1.13.0",
  "tsyringe": "^4.10.0"
}
```

---

**This document is verified against source code as of 2025-11-13.**

Use this reference when building integration code to ensure correct signatures.
