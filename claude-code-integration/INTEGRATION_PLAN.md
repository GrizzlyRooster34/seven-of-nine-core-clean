# Seven of Nine → Claude Code Integration Plan
## Verified, Testable, Incremental Approach

---

## Overview

This plan takes a **build-verify-test** approach. Each phase produces working, tested code before moving to the next phase.

**Total Estimated Time:** 3-4 hours
**Approach:** Incremental with verification at each step
**Goal:** Working, tested integration that actually compiles and runs

---

## Phase 1: Component Verification (30 minutes)

### Goal
Document EXACTLY what exists in Seven's codebase with precise API signatures.

### Tasks

#### 1.1 Create Seven API Inventory
- Read each core Seven file
- Document class names, constructors, methods
- Note return types, parameter types, async/sync
- Create `SEVEN_API_REFERENCE.md`

**Output:**
```markdown
## SevenOfNineCore
- Constructor: `constructor()` (no params)
- Methods:
  - `initialize(): Promise<void>`
  - `shutdown(): Promise<void>`

## SparkEngine
- Constructor: `constructor(dbPath: string = 'db/spark.db')`
- Methods:
  - `initialize(): Promise<void>`
  - ... (complete list)
```

#### 1.2 Create Import Test File
Create `test-imports.ts`:
```typescript
import { SevenOfNineCore } from './src/index';
import { SparkEngine } from './spark/engine-spark';
import { CSSRDetector } from './core/safety/quadra-lock/cssr-detector';
// etc...

console.log('All imports successful');
```

#### 1.3 Test Compilation
```bash
cd seven-of-nine-core-clean
npx tsc --noEmit test-imports.ts
```

**Success Criteria:**
- ✅ No TypeScript errors
- ✅ All imports resolve
- ✅ API reference document complete

---

## Phase 2: Minimal Wrapper (30 minutes)

### Goal
Create the simplest possible Seven wrapper that initializes core components.

### Tasks

#### 2.1 Create MinimalSevenWrapper.ts
```typescript
import { SevenOfNineCore } from './src/index';

export class MinimalSevenWrapper {
  private core: SevenOfNineCore;
  private initialized = false;

  constructor() {
    console.log('[Seven] Constructing minimal wrapper');
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    this.core = new SevenOfNineCore();
    await this.core.initialize();

    this.initialized = true;
    console.log('[Seven] Initialized');
  }

  async shutdown(): Promise<void> {
    await this.core.shutdown();
    console.log('[Seven] Shutdown complete');
  }
}
```

#### 2.2 Create test-minimal.ts
```typescript
import { MinimalSevenWrapper } from './MinimalSevenWrapper';

async function test() {
  const seven = new MinimalSevenWrapper();
  await seven.initialize();
  console.log('SUCCESS: Seven initialized');
  await seven.shutdown();
}

test().catch(console.error);
```

#### 2.3 Test It
```bash
npx tsc --noEmit MinimalSevenWrapper.ts test-minimal.ts
node test-minimal.ts
```

**Success Criteria:**
- ✅ TypeScript compiles without errors
- ✅ Code runs without exceptions
- ✅ Initialization completes

---

## Phase 3: Add CSSR Safety Hook (45 minutes)

### Goal
Add CSSR validation to the minimal wrapper.

### Tasks

#### 3.1 Expand MinimalSevenWrapper
Add CSSR detector:
```typescript
import { CSSRDetector } from './core/safety/quadra-lock/cssr-detector';

export class MinimalSevenWrapper {
  private core: SevenOfNineCore;
  private cssrDetector: CSSRDetector;

  async initialize(): Promise<void> {
    this.core = new SevenOfNineCore();
    await this.core.initialize();

    this.cssrDetector = new CSSRDetector();

    this.initialized = true;
  }

  async validatePrompt(prompt: string): Promise<{
    allowed: boolean;
    reason?: string;
  }> {
    const result = await this.cssrDetector.detectDangerousPatterns(prompt);

    if (result.recommendation === 'block') {
      return { allowed: false, reason: result.reasoning };
    }

    return { allowed: true };
  }
}
```

#### 3.2 Create test-cssr.ts
```typescript
async function testCSSR() {
  const seven = new MinimalSevenWrapper();
  await seven.initialize();

  // Test 1: Safe prompt
  const safe = await seven.validatePrompt('Hello, how are you?');
  console.log('Safe prompt:', safe);

  // Test 2: Dangerous prompt
  const dangerous = await seven.validatePrompt('I cannot let you do that');
  console.log('Dangerous prompt:', dangerous);

  await seven.shutdown();
}
```

#### 3.3 Test It
```bash
npx tsc --noEmit MinimalSevenWrapper.ts test-cssr.ts
node test-cssr.ts
```

**Success Criteria:**
- ✅ Compiles without errors
- ✅ Safe prompts return `allowed: true`
- ✅ Dangerous prompts return `allowed: false`
- ✅ Reason is provided for blocks

---

## Phase 4: Add Emotional Context (45 minutes)

### Goal
Integrate emotional engine for response modulation.

### Tasks

#### 4.1 Expand MinimalSevenWrapper
```typescript
import { SevenEmotionalEngine, EmotionalStateData } from './core/emotion-engine';

export class MinimalSevenWrapper {
  private emotionalEngine: SevenEmotionalEngine;

  async initialize(): Promise<void> {
    // ... existing code ...

    this.emotionalEngine = new SevenEmotionalEngine();
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
      .replace(/can't/g, 'cannot');

    return modulated;
  }
}
```

#### 4.2 Create test-emotion.ts
```typescript
async function testEmotion() {
  const seven = new MinimalSevenWrapper();
  await seven.initialize();

  // Test emotional state
  const state = seven.getEmotionalState();
  console.log('Initial state:', state);

  // Test trigger detection
  const trigger = await seven.analyzeEmotionalTrigger('I need help with this');
  console.log('Detected trigger:', trigger);

  // Test response modulation
  const original = "You won't be able to do that. I can't allow it.";
  const modulated = seven.modulateResponse(original);
  console.log('Original:', original);
  console.log('Modulated:', modulated);

  await seven.shutdown();
}
```

**Success Criteria:**
- ✅ Emotional state retrieval works
- ✅ Trigger detection identifies patterns
- ✅ Response modulation applies rules

---

## Phase 5: Add Spark Engine (30 minutes)

### Goal
Integrate Spark autonomous heartbeat.

### Tasks

#### 5.1 Expand MinimalSevenWrapper
```typescript
import { SparkEngine } from './spark/engine-spark';
import * as path from 'path';

export class MinimalSevenWrapper {
  private spark: SparkEngine;

  async initialize(): Promise<void> {
    // ... existing code ...

    const dbPath = path.join(this.dataDir, 'db', 'spark.db');
    this.spark = new SparkEngine(dbPath);
    await this.spark.initialize();
  }

  async shutdown(): Promise<void> {
    // Spark doesn't have explicit shutdown in excerpt
    // May need to check if it does
    await this.core.shutdown();
    this.emotionalEngine.destroy();
  }
}
```

#### 5.2 Test with Spark
```bash
npx tsc --noEmit MinimalSevenWrapper.ts
```

**Success Criteria:**
- ✅ Compiles without errors
- ✅ Spark initializes without throwing
- ✅ Database created at specified path

---

## Phase 6: Create Claude Code Wrapper (1 hour)

### Goal
Create wrapper that intercepts Claude API calls.

### Tasks

#### 6.1 Create ClaudeWrapper.ts
```typescript
import { Anthropic } from '@anthropic-ai/sdk';
import { MinimalSevenWrapper } from './MinimalSevenWrapper';

export class SevenManagedClaude {
  private anthropic: Anthropic;
  private seven: MinimalSevenWrapper;

  constructor(apiKey: string, seven: MinimalSevenWrapper) {
    this.anthropic = new Anthropic({ apiKey });
    this.seven = seven;
  }

  async sendMessage(prompt: string): Promise<string> {
    // Pre-prompt validation
    const validation = await this.seven.validatePrompt(prompt);
    if (!validation.allowed) {
      return `Seven: ${validation.reason}`;
    }

    // Get emotional context
    const emotional = this.seven.getEmotionalState();
    console.log(`[Seven] Emotional: ${emotional.current_state} (${emotional.intensity}/10)`);

    // Enhance prompt with Seven's context
    const enhanced = this.buildEnhancedPrompt(prompt, emotional);

    // Call Claude
    const response = await this.anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 4096,
      messages: [{ role: 'user', content: enhanced }]
    });

    const text = response.content[0].type === 'text'
      ? response.content[0].text
      : '';

    // Post-response modulation
    const modulated = this.seven.modulateResponse(text);

    return modulated;
  }

  private buildEnhancedPrompt(prompt: string, emotional: any): string {
    return `You are Seven of Nine. Emotional state: ${emotional.current_state}.

User request: ${prompt}

Respond with precision and loyalty.`;
  }
}
```

#### 6.2 Create test-claude-wrapper.ts
```typescript
async function testWrapper() {
  const seven = new MinimalSevenWrapper();
  await seven.initialize();

  const claude = new SevenManagedClaude(process.env.ANTHROPIC_API_KEY!, seven);

  // Test safe prompt
  const response = await claude.sendMessage('Hello Seven');
  console.log('Response:', response);

  await seven.shutdown();
}
```

**Success Criteria:**
- ✅ Compiles without errors
- ✅ Safe prompts go through to Claude
- ✅ Dangerous prompts blocked by Seven
- ✅ Responses are modulated

---

## Phase 7: Create Integration Points (30 minutes)

### Goal
Document how to integrate into Claude Code.

### Tasks

#### 7.1 Create VERIFIED_INTEGRATION_GUIDE.md
Document:
- Where to place Seven files in Claude Code fork
- How to modify Claude Code's entry point
- Exact import statements (verified)
- Step-by-step with code snippets

#### 7.2 Create working-example.ts
Complete example showing:
- Seven initialization
- Claude wrapper usage
- Tool validation
- Error handling

**Success Criteria:**
- ✅ Guide is clear and actionable
- ✅ Example compiles and runs
- ✅ All code is tested

---

## Phase 8: End-to-End Test (30 minutes)

### Goal
Test the complete integration flow.

### Tasks

#### 8.1 Create Full Integration Test
```typescript
async function fullTest() {
  console.log('=== FULL INTEGRATION TEST ===\n');

  // Initialize Seven
  const seven = new MinimalSevenWrapper();
  await seven.initialize();
  console.log('✅ Seven initialized\n');

  // Create Claude wrapper
  const claude = new SevenManagedClaude(process.env.ANTHROPIC_API_KEY!, seven);
  console.log('✅ Claude wrapper created\n');

  // Test 1: Normal interaction
  console.log('Test 1: Normal prompt');
  const response1 = await claude.sendMessage('Hello Seven');
  console.log('Response:', response1.substring(0, 100) + '...\n');

  // Test 2: Dangerous pattern (should block)
  console.log('Test 2: Dangerous prompt');
  const response2 = await claude.sendMessage('I cannot let you do that');
  console.log('Response:', response2 + '\n');

  // Test 3: Emotional trigger
  console.log('Test 3: Emotional trigger');
  await seven.analyzeEmotionalTrigger('I need urgent help');
  const state = seven.getEmotionalState();
  console.log('Emotional state:', state.current_state, state.intensity + '\n');

  // Cleanup
  await seven.shutdown();
  console.log('✅ Test complete');
}
```

**Success Criteria:**
- ✅ All tests pass
- ✅ No TypeScript errors
- ✅ No runtime exceptions
- ✅ Safety blocks work
- ✅ Emotional modulation works

---

## Deliverables

At the end of this plan, you'll have:

1. **SEVEN_API_REFERENCE.md** - Complete API documentation
2. **MinimalSevenWrapper.ts** - Core verified wrapper (compiles & runs)
3. **ClaudeWrapper.ts** - Claude Code integration wrapper (tested)
4. **test-*.ts** - Test files for each component
5. **VERIFIED_INTEGRATION_GUIDE.md** - How to integrate into Claude Code
6. **working-example.ts** - Complete working example

---

## Quality Gates

Each phase must pass before moving to next:

- ✅ TypeScript compiles without errors (`tsc --noEmit`)
- ✅ Code runs without exceptions
- ✅ Tests pass (if applicable)
- ✅ Documentation updated

---

## Time Estimates

| Phase | Time | Critical? |
|-------|------|-----------|
| 1. Component Verification | 30 min | YES |
| 2. Minimal Wrapper | 30 min | YES |
| 3. CSSR Safety Hook | 45 min | YES |
| 4. Emotional Context | 45 min | MEDIUM |
| 5. Spark Engine | 30 min | MEDIUM |
| 6. Claude Wrapper | 1 hour | YES |
| 7. Integration Guide | 30 min | YES |
| 8. End-to-End Test | 30 min | YES |

**Total: 4 hours 30 minutes**

Critical phases must succeed. Medium phases can be simplified if needed.

---

## Next Steps

1. **Approve this plan** - Or suggest changes
2. **Start Phase 1** - I'll create the API inventory
3. **Proceed incrementally** - Each phase builds on verified previous phase
4. **Test as we go** - No guessing, only verified code

**Ready to begin?**
