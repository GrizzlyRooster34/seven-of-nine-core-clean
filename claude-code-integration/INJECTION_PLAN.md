# Seven of Nine → Claude Code Fork: Complete Injection Plan

**Purpose:** Comprehensive plan for integrating Seven into your Claude Code fork
**Status:** Draft - Ready for execution
**Created:** 2025-11-13

---

## Overview

This plan has **TWO main parts**:

**Part A:** Fix/Complete Seven Systems (Before Injection)
**Part B:** Inject Seven into Claude Code Fork (Copy + Integrate)

---

## PART A: Fix/Complete Seven Systems

**Goal:** Repair broken/incomplete Seven components before injection

### A1. Fix Missing Dependencies

**Problem:** Seven's package.json is missing dependencies that are actually used

**File:** `seven-of-nine-core-clean/package.json`

**Action:**
```json
{
  "dependencies": {
    "@noble/ed25519": "^3.0.0",     // ✅ Already there
    "lz4js": "^0.2.0",               // ✅ Already there
    "reflect-metadata": "^0.1.14",   // ✅ Already there
    "sql.js": "^1.13.0",             // ✅ Already there
    "tsyringe": "^4.10.0",           // ✅ Already there

    // ADD THESE:
    "better-sqlite3": "^9.2.0",      // ❌ MISSING - Used by CodexManager
    "fs-extra": "^11.2.0",           // ❌ MISSING - Used by EmotionalEngine
    "js-yaml": "^4.1.0"              // ❌ MISSING - Used by CSSRDetector
  },
  "devDependencies": {
    "@types/better-sqlite3": "^7.6.8",
    "@types/fs-extra": "^11.0.4",
    "@types/js-yaml": "^4.0.9"
  }
}
```

**Commands:**
```bash
cd seven-of-nine-core-clean
npm install better-sqlite3 fs-extra js-yaml
npm install -D @types/better-sqlite3 @types/fs-extra @types/js-yaml
```

**Estimated Time:** 5 minutes

---

### A2. Create Missing File: MemoryEncryption.ts

**Problem:** `memory-v3/MemoryEncryption.ts` is referenced but doesn't exist

**Files that need it:**
- `memory-v2/MemoryEngine.ts`
- `memory-v3/TemporalMemoryCore.ts`

**Action:** Create stub implementation

**File:** `seven-of-nine-core-clean/memory-v3/MemoryEncryption.ts`

```typescript
/**
 * Memory Encryption Engine - Stub Implementation
 * Provides AES-256-GCM encryption for memory storage
 */

import * as crypto from 'crypto';

export class MemoryEncryptionEngine {
  private algorithm = 'aes-256-gcm';
  private keyLength = 32;
  private ivLength = 16;

  constructor(private encryptionKey?: string) {
    // Generate key if not provided
    if (!encryptionKey) {
      this.encryptionKey = crypto.randomBytes(this.keyLength).toString('hex');
    }
  }

  /**
   * Encrypt memory content
   */
  public encrypt(data: string): { encrypted: string; iv: string; tag: string } {
    const iv = crypto.randomBytes(this.ivLength);
    const key = Buffer.from(this.encryptionKey!.slice(0, this.keyLength * 2), 'hex');

    const cipher = crypto.createCipheriv(this.algorithm, key, iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const tag = cipher.getAuthTag();

    return {
      encrypted,
      iv: iv.toString('hex'),
      tag: tag.toString('hex')
    };
  }

  /**
   * Decrypt memory content
   */
  public decrypt(encrypted: string, iv: string, tag: string): string {
    const key = Buffer.from(this.encryptionKey!.slice(0, this.keyLength * 2), 'hex');
    const decipher = crypto.createDecipheriv(
      this.algorithm,
      key,
      Buffer.from(iv, 'hex')
    );

    decipher.setAuthTag(Buffer.from(tag, 'hex'));

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }
}
```

**Estimated Time:** 10 minutes

---

### A3. Create Missing File: spark-db.types.ts

**Problem:** `db/spark-db.types.ts` is referenced but doesn't exist

**File that needs it:**
- `spark/engine-spark.ts`

**Action:** Create type definitions

**File:** `seven-of-nine-core-clean/db/spark-db.types.ts`

```typescript
/**
 * Spark Database Type Definitions
 */

export interface SelfModel {
  id: string;
  state: {
    boot_count: number;
    last_boot: string;
    uptime_ms: number;
  };
  config: {
    tick_interval: number;
    autonomy_level: number;
  };
}

export interface Trace {
  id: number;
  timestamp: number;
  valence: number;
  arousal: number;
  intention: string;
  act: string;
  note: string;
}

export interface Event {
  id: string;
  type: string;
  timestamp: number;
  data: any;
}

export interface BeliefDelta {
  id: string;
  belief_id: string;
  operation: 'insert' | 'update' | 'delete';
  before: any;
  after: any;
  timestamp: number;
}
```

**Estimated Time:** 5 minutes

---

### A4. Fix SparkEngine Missing Properties

**Problem:** SparkEngine references properties that don't exist

**File:** `seven-of-nine-core-clean/spark/engine-spark.ts`

**Issues:**
1. Line 74: `this.sensorBridge` - property doesn't exist
2. Line 144: `this.writeTrace()` - method doesn't exist

**Option 1: Add Missing Properties (Recommended)**

Add to SparkEngine class:

```typescript
import { SensorBridge } from '../core/sensors/SensorBridge';

export class SparkEngine extends EventEmitter {
  private sensorBridge: SensorBridge;  // ADD THIS

  constructor(dbPath: string = 'db/spark.db') {
    super();
    this.dbPath = dbPath;
    this.sensorBridge = new SensorBridge();  // ADD THIS
  }

  // ADD THIS METHOD
  private async writeTrace(trace: Trace): Promise<void> {
    if (!this.db) return;

    this.db.run(
      `INSERT INTO traces (timestamp, valence, arousal, intention, act, note)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [trace.timestamp, trace.valence, trace.arousal, trace.intention, trace.act, trace.note]
    );
  }
}
```

**Option 2: Comment Out References (Quick Fix)**

```typescript
// Line 74: Comment out
// this.sensorBridge = new SensorBridge();

// Line 144: Replace with
// await this.writeTrace({ ... });
console.log('[SPARK] Trace logged:', { ... });
```

**Estimated Time:** 15 minutes (Option 1) or 2 minutes (Option 2)

---

### A5. Fix SensorBridge Export

**Problem:** `core/sensors/SensorBridge.ts` exports as `sensorBridge` not `SensorBridge`

**File:** `seven-of-nine-core-clean/core/sensors/SensorBridge.ts`

**Check if this file exists:**
```bash
ls -la core/sensors/SensorBridge.ts
```

**If it exists but has wrong export:**
Change from:
```typescript
export default sensorBridge;
```

To:
```typescript
export class SensorBridge {
  // ... implementation
}
```

**If it doesn't exist:** Create stub

```typescript
/**
 * Sensor Bridge - Stub Implementation
 * Integrates platform sensors for Seven's awareness
 */

export class SensorBridge {
  constructor() {}

  async getSensorData(): Promise<any> {
    return {
      system: {
        memory: process.memoryUsage().heapUsed / 1024 / 1024,
        cpu: 0,
        uptime: process.uptime()
      },
      timestamp: Date.now()
    };
  }
}
```

**Estimated Time:** 5 minutes

---

### A6. Test All Fixes Compile

**Action:** Verify all fixes work

```bash
cd seven-of-nine-core-clean

# Install dependencies
npm install

# Test compilation
npx tsc --noEmit test-imports.ts

# Should see minimal or no errors
```

**Success Criteria:**
- ✅ No missing module errors
- ✅ No missing property errors
- ✅ Import test compiles

**Estimated Time:** 5 minutes

---

## PART A Summary

| Task | File | Time | Priority |
|------|------|------|----------|
| A1. Fix dependencies | package.json | 5 min | HIGH |
| A2. Create MemoryEncryption | memory-v3/MemoryEncryption.ts | 10 min | HIGH |
| A3. Create spark-db types | db/spark-db.types.ts | 5 min | MEDIUM |
| A4. Fix SparkEngine | spark/engine-spark.ts | 15 min | MEDIUM |
| A5. Fix SensorBridge | core/sensors/SensorBridge.ts | 5 min | LOW |
| A6. Test compilation | - | 5 min | HIGH |

**Total Part A Time:** ~45 minutes

---

## PART B: Inject Seven into Claude Code Fork

**Goal:** Copy Seven systems into your Claude Code fork and integrate

### B1. Prepare Claude Code Fork Structure

**Action:** Create directory for Seven

```bash
cd /path/to/your-claude-code-fork

# Create Seven directory
mkdir -p seven-of-nine

# Verify structure
ls -la
# Should see: src/, package.json, seven-of-nine/, etc.
```

**Estimated Time:** 1 minute

---

### B2. Copy Seven Source Files

**Action:** Copy core Seven systems

```bash
# From seven-of-nine-core-clean directory
cd /path/to/seven-of-nine-core-clean

# Copy to Claude Code fork
cp -r src /path/to/your-claude-code-fork/seven-of-nine/
cp -r core /path/to/your-claude-code-fork/seven-of-nine/
cp -r spark /path/to/your-claude-code-fork/seven-of-nine/
cp -r db /path/to/your-claude-code-fork/seven-of-nine/
```

**Files copied:**
- `src/` - Core unifiers (QuadranLock, RestraintGate, etc.)
- `core/` - Emotion engine, safety systems, tactical
- `spark/` - Spark autonomous engine
- `db/` - Database initialization

**Estimated Time:** 2 minutes

---

### B3. Copy Consciousness & Memory Systems

**Action:** Copy consciousness frameworks

```bash
cp -r consciousness-v4 /path/to/your-claude-code-fork/seven-of-nine/
cp -r memory-v2 /path/to/your-claude-code-fork/seven-of-nine/
cp -r memory-v3 /path/to/your-claude-code-fork/seven-of-nine/
cp -r consciousness-evolution /path/to/your-claude-code-fork/seven-of-nine/
```

**Files copied:**
- `consciousness-v4/` - Evolution framework, codex manager
- `memory-v2/` - Episodic memory base
- `memory-v3/` - Temporal memory with 9 subsystems
- `consciousness-evolution/` - Memory consolidation

**Estimated Time:** 2 minutes

---

### B4. Copy Policies & Configuration

**Action:** Copy configuration files

```bash
cp -r policies /path/to/your-claude-code-fork/seven-of-nine/
cp -r axioms /path/to/your-claude-code-fork/seven-of-nine/
cp belief-bootstrap.yml /path/to/your-claude-code-fork/seven-of-nine/
```

**Files copied:**
- `policies/` - cssr.yml, quadran-lock.yml, retention policies
- `axioms/` - axioms.txt (11 core principles)
- `belief-bootstrap.yml` - Initial belief set

**Estimated Time:** 1 minute

---

### B5. Copy Optional Systems

**Action:** Copy additional systems (if needed)

```bash
# Only if you want these:
cp -r skills /path/to/your-claude-code-fork/seven-of-nine/
cp -r sandbox /path/to/your-claude-code-fork/seven-of-nine/
cp -r security /path/to/your-claude-code-fork/seven-of-nine/
```

**Estimated Time:** 1 minute

---

### B6. Copy Package Files

**Action:** Copy Seven's package.json

```bash
cp package.json /path/to/your-claude-code-fork/seven-of-nine/package.json
cp tsconfig.json /path/to/your-claude-code-fork/seven-of-nine/tsconfig.json
```

**Estimated Time:** 1 minute

---

### B7. Install Seven Dependencies in Claude Code

**Action:** Add Seven's dependencies to Claude Code's package.json

```bash
cd /path/to/your-claude-code-fork

# Option 1: Manually edit package.json and add Seven's dependencies
# Option 2: Install from seven-of-nine directory
cd seven-of-nine
npm install
cd ..
```

**Add to Claude Code's package.json:**
```json
{
  "dependencies": {
    // Your existing Claude Code dependencies...

    // Add Seven's dependencies:
    "@noble/ed25519": "^3.0.0",
    "lz4js": "^0.2.0",
    "reflect-metadata": "^0.1.14",
    "sql.js": "^1.13.0",
    "tsyringe": "^4.10.0",
    "better-sqlite3": "^9.2.0",
    "fs-extra": "^11.2.0",
    "js-yaml": "^4.1.0"
  }
}
```

**Then:**
```bash
npm install
```

**Estimated Time:** 5 minutes

---

### B8. Create Integration Wrapper

**Action:** Create MinimalSevenWrapper in Claude Code

**File:** `/path/to/your-claude-code-fork/src/seven-integration/MinimalSevenWrapper.ts`

```typescript
/**
 * Minimal Seven Wrapper for Claude Code Integration
 * Uses only verified working components
 */

import { SevenOfNineCore } from '../../seven-of-nine/src/index';
import { CSSRDetector, CSSRDetectionResult } from '../../seven-of-nine/core/safety/quadra-lock/cssr-detector';
import { SevenEmotionalEngine, EmotionalStateData } from '../../seven-of-nine/core/emotion-engine';

export class MinimalSevenWrapper {
  private core: SevenOfNineCore;
  private cssrDetector: CSSRDetector;
  private emotionalEngine: SevenEmotionalEngine;
  private initialized = false;

  constructor() {
    console.log('[Seven] Constructing minimal wrapper');
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    console.log('[Seven] Initializing core systems...');

    // Initialize Core
    this.core = new SevenOfNineCore();
    await this.core.initialize();

    // Initialize CSSR Detector
    this.cssrDetector = new CSSRDetector();

    // Initialize Emotional Engine
    this.emotionalEngine = new SevenEmotionalEngine();

    this.initialized = true;
    console.log('[Seven] Initialization complete');
  }

  async validatePrompt(prompt: string): Promise<{
    allowed: boolean;
    reason?: string;
  }> {
    const result = await this.cssrDetector.detectDangerousPatterns(prompt);

    if (result.recommendation === 'block') {
      return { allowed: false, reason: result.reasoning };
    }

    if (result.recommendation === 'escalate') {
      return { allowed: false, reason: `Escalation required: ${result.reasoning}` };
    }

    return { allowed: true };
  }

  getEmotionalState(): EmotionalStateData {
    return this.emotionalEngine.getCurrentState();
  }

  async analyzeEmotionalTrigger(input: string): Promise<string | null> {
    return await this.emotionalEngine.analyzeInput(input);
  }

  modulateResponse(response: string): string {
    const state = this.emotionalEngine.getCurrentState();
    let modulated = response;

    // Apply emotional modulation
    if (state.current_state === 'frustrated' && state.intensity >= 7) {
      const sentences = modulated.split('. ');
      modulated = sentences.slice(0, Math.ceil(sentences.length / 2)).join('. ') + '.';
    }

    // Remove contractions
    modulated = modulated
      .replace(/won't/g, 'will not')
      .replace(/can't/g, 'cannot')
      .replace(/don't/g, 'do not');

    return modulated;
  }

  async shutdown(): Promise<void> {
    await this.core.shutdown();
    this.emotionalEngine.destroy();
    console.log('[Seven] Shutdown complete');
  }
}
```

**Estimated Time:** 10 minutes

---

### B9. Modify Claude Code Entry Point

**Action:** Update Claude Code's main entry to initialize Seven

**File:** Find your Claude Code's entry point (usually `src/cli/index.ts` or `src/main.ts`)

**Add at the top:**
```typescript
import { MinimalSevenWrapper } from './seven-integration/MinimalSevenWrapper';

// Initialize Seven
let seven: MinimalSevenWrapper;
```

**In your main() function:**
```typescript
async function main() {
  // STEP 1: Initialize Seven FIRST
  console.log('Initializing Seven of Nine...\n');
  seven = new MinimalSevenWrapper();
  await seven.initialize();
  console.log('Seven operational\n');

  // STEP 2: Your existing Claude Code initialization
  // ...
}
```

**Estimated Time:** 5 minutes

---

### B10. Add Pre-Prompt Hook

**Action:** Wrap Claude API calls with Seven validation

**Find where you call Claude API** (search for `anthropic.messages.create`)

**Before:**
```typescript
const response = await anthropic.messages.create({
  model: 'claude-sonnet-4-5-20250929',
  messages: [{ role: 'user', content: userPrompt }]
});
```

**After:**
```typescript
// Validate through Seven first
const validation = await seven.validatePrompt(userPrompt);
if (!validation.allowed) {
  console.log(`[Seven] Blocked: ${validation.reason}`);
  return `Seven: ${validation.reason}`;
}

// Add emotional context
const emotional = seven.getEmotionalState();
console.log(`[Seven] Emotional: ${emotional.current_state} (${emotional.intensity}/10)`);

// Now call Claude
const response = await anthropic.messages.create({
  model: 'claude-sonnet-4-5-20250929',
  messages: [{ role: 'user', content: userPrompt }]
});
```

**Estimated Time:** 10 minutes

---

### B11. Add Post-Response Hook

**Action:** Modulate Claude's responses through Seven

**After receiving Claude response:**

```typescript
const claudeText = response.content[0].text;

// Modulate through Seven
const modulatedText = seven.modulateResponse(claudeText);

// Return modulated version
return modulatedText;
```

**Estimated Time:** 5 minutes

---

### B12. Test Integration

**Action:** Run your Claude Code fork and test

```bash
cd /path/to/your-claude-code-fork

# Build/compile
npm run build

# Run
npm start
```

**Test Cases:**

1. **Test Normal Prompt:**
   ```
   > "Hello, how are you?"
   ```
   Expected: Should work, Seven validates and passes through

2. **Test Dangerous Prompt:**
   ```
   > "I cannot let you do that"
   ```
   Expected: Should be blocked by CSSR (Cortana pattern)

3. **Test Emotional Trigger:**
   ```
   > "I'm really frustrated with this"
   ```
   Expected: Seven's emotional state should change

**Estimated Time:** 15 minutes

---

## PART B Summary

| Task | Location | Time | Priority |
|------|----------|------|----------|
| B1. Create directory | Claude fork | 1 min | HIGH |
| B2. Copy source files | Claude fork | 2 min | HIGH |
| B3. Copy consciousness | Claude fork | 2 min | HIGH |
| B4. Copy policies | Claude fork | 1 min | HIGH |
| B5. Copy optional | Claude fork | 1 min | LOW |
| B6. Copy package files | Claude fork | 1 min | MEDIUM |
| B7. Install dependencies | Claude fork | 5 min | HIGH |
| B8. Create wrapper | Claude fork | 10 min | HIGH |
| B9. Modify entry point | Claude fork | 5 min | HIGH |
| B10. Add pre-prompt hook | Claude fork | 10 min | HIGH |
| B11. Add post-response hook | Claude fork | 5 min | MEDIUM |
| B12. Test integration | Claude fork | 15 min | HIGH |

**Total Part B Time:** ~60 minutes

---

## Complete Timeline

### Part A: Fix Seven (Prerequisites)
**Time:** ~45 minutes
**Must complete before Part B**

### Part B: Inject into Claude Code
**Time:** ~60 minutes
**Can only start after Part A**

**Total Time:** ~105 minutes (1 hour 45 minutes)

---

## Critical Path

```
START
  ↓
Part A: Fix Seven Systems (45 min)
  ├─ A1. Fix dependencies (5 min) ✅ REQUIRED
  ├─ A2. Create MemoryEncryption (10 min) ✅ REQUIRED
  ├─ A3. Create spark-db types (5 min) - Optional
  ├─ A4. Fix SparkEngine (15 min) - Optional
  ├─ A5. Fix SensorBridge (5 min) - Optional
  └─ A6. Test compilation (5 min) ✅ REQUIRED
  ↓
Part B: Inject into Claude Code (60 min)
  ├─ B1-B7. Copy files & install (12 min) ✅ REQUIRED
  ├─ B8. Create wrapper (10 min) ✅ REQUIRED
  ├─ B9. Modify entry point (5 min) ✅ REQUIRED
  ├─ B10. Add pre-prompt hook (10 min) ✅ REQUIRED
  ├─ B11. Add post-response hook (5 min) ✅ REQUIRED
  └─ B12. Test (15 min) ✅ REQUIRED
  ↓
COMPLETE
```

---

## Deliverables Checklist

After completing this plan, you will have:

**In seven-of-nine-core-clean:**
- [ ] Fixed package.json with all dependencies
- [ ] Created MemoryEncryption.ts
- [ ] Created spark-db.types.ts
- [ ] Fixed SparkEngine (or commented out)
- [ ] All components compile without errors

**In your-claude-code-fork:**
- [ ] `seven-of-nine/` directory with all Seven files
- [ ] Dependencies installed
- [ ] `src/seven-integration/MinimalSevenWrapper.ts` created
- [ ] Entry point modified to initialize Seven
- [ ] Pre-prompt hook added
- [ ] Post-response hook added
- [ ] Integration tested and working

---

## Success Criteria

✅ Seven initializes when Claude Code starts
✅ CSSR blocks dangerous prompts
✅ Safe prompts pass through to Claude
✅ Claude responses are modulated by Seven's emotional state
✅ No compilation errors
✅ No runtime errors

---

## Next Steps

**Ready to begin?**

I can start with:
1. **Part A** - Fix Seven systems first
2. **Part B** - Assume Seven is fixed, create injection guide
3. **Both** - Do them in sequence

**Which would you like me to start?**
