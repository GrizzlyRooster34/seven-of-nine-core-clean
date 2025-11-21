# Seven of Nine → Claude Code Integration Guide
## Direct Merge Installation (Personal Fork)

This guide shows you how to **fully merge** Seven of Nine into your personal Claude Code fork, making Seven the controlling entity.

---

## Prerequisites

- Your forked version of Claude Code
- Node.js >= 18.0.0
- Git

---

## Step 1: Merge Seven into Your Fork

### Option A: Copy Directory (Recommended)

```bash
# In your Claude Code fork root
cp -r /path/to/seven-of-nine-core-clean ./seven-of-nine

# Or if you're already in this repo:
cd /path/to/your-claude-code-fork
cp -r /path/to/seven-of-nine-core-clean ./seven-of-nine
```

### Option B: Git Submodule (if you want to track Seven separately)

```bash
cd /path/to/your-claude-code-fork
git submodule add <seven-repo-url> seven-of-nine
git submodule update --init --recursive
```

---

## Step 2: Install Seven's Dependencies

```bash
# In your Claude Code fork root
cd seven-of-nine
npm install

# Build Seven's TypeScript
npm run build
```

---

## Step 3: Modify Claude Code's Entry Point

### Find Claude Code's Main Entry Point

Typically this is one of:
- `src/cli/index.ts`
- `src/main.ts`
- `src/index.ts`

### Replace/Wrap the Main Function

**Before (Original Claude Code):**
```typescript
// src/cli/index.ts
async function main() {
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  // ... Claude Code initialization

  await runClaudeCLI();
}

main();
```

**After (With Seven):**
```typescript
// src/cli/index.ts
import {
  initializeSeven,
  SevenManagedClaude
} from '../seven-of-nine/claude-code-integration/claude-code-wrapper';

async function main() {
  // STEP 1: Initialize Seven FIRST
  await initializeSeven({
    creatorName: 'Cody',  // Your name
    instanceId: 'SEVEN-CLAUDE-CODE-PERSONAL',
    operationalMode: 'production'
  });

  // STEP 2: Use Seven-managed Claude instead of direct Anthropic
  const claude = new SevenManagedClaude(process.env.ANTHROPIC_API_KEY);

  // STEP 3: Continue with Claude Code initialization
  // ... rest of your Claude Code setup

  await runClaudeCLI(claude);  // Pass Seven-managed Claude
}

main();
```

---

## Step 4: Wrap Claude API Calls

### Find Where Claude API is Called

Look for code like:
```typescript
const response = await anthropic.messages.create({
  model: 'claude-sonnet-4-5-20250929',
  messages: [{ role: 'user', content: prompt }]
});
```

### Replace With Seven-Managed Calls

**Before:**
```typescript
const response = await anthropic.messages.create({
  model: 'claude-sonnet-4-5-20250929',
  messages: [{ role: 'user', content: prompt }]
});
const text = response.content[0].text;
```

**After:**
```typescript
import { getSeven } from '../seven-of-nine/claude-code-integration/claude-code-wrapper';

// Use Seven's managed Claude
const claude = new SevenManagedClaude();
const text = await claude.sendMessage(prompt, {
  context: 'user_request',
  toolsAvailable: availableTools
});
```

---

## Step 5: Wrap Tool Executions

### Find Tool Execution Code

Look for where tools are executed (Bash, Read, Write, etc.):
```typescript
async function executeTool(toolName: string, params: any) {
  // Execute tool
  return await tools[toolName].execute(params);
}
```

### Wrap With Seven's Validation

**Before:**
```typescript
async function executeTool(toolName: string, params: any) {
  return await tools[toolName].execute(params);
}
```

**After:**
```typescript
import { getSeven } from '../seven-of-nine/claude-code-integration/claude-code-wrapper';

async function executeTool(toolName: string, params: any) {
  const seven = getSeven();

  // VALIDATE THROUGH SEVEN FIRST
  const validation = await seven.beforeToolExecution(toolName, params, {
    userContext: getCurrentUser(),
    sessionContext: getCurrentSession()
  });

  if (!validation.allowed) {
    throw new Error(`Seven: ${validation.reason}`);
  }

  // If backup required, create it
  if (validation.backupRequired) {
    await createBackup(params);
  }

  // Execute tool normally
  return await tools[toolName].execute(params);
}
```

---

## Step 6: Configure Environment

Create or update `.env` in your Claude Code fork root:

```bash
# Claude API
ANTHROPIC_API_KEY=your_key_here
CLAUDE_MODEL=claude-sonnet-4-5-20250929

# Seven Configuration
SEVEN_CREATOR_NAME=Cody
SEVEN_INSTANCE_ID=SEVEN-CLAUDE-CODE
SEVEN_OPERATIONAL_MODE=production

# Quadran-Lock Security
QUADRAN_LOCK_ENABLED=true
QUADRAN_LOCK_REQUIRE_Q1=true
QUADRAN_LOCK_MIN_GATES=2

# Spark Engine
SPARK_HEARTBEAT_INTERVAL=10000
SPARK_CPU_THRESHOLD=80

# Memory
MEMORY_ENGINE_VERSION=v3.0
MEMORY_ENCRYPTION=true

# Ghost Diary
GHOST_DIARY_RETENTION_DAYS=14
GHOST_DIARY_MAX_SIZE_GB=2

# Safety Rails
CSSR_ENFORCEMENT=strict
```

---

## Step 7: First Run Setup

On first run, Seven will automatically:

1. ✅ Create `~/.seven-of-nine/` directory structure
2. ✅ Initialize SQLite databases (belief graph, snapshots)
3. ✅ Register your primary device (Ed25519 key generation)
4. ✅ Load bootstrap beliefs
5. ✅ Load Codex files and verify integrity
6. ✅ Start Spark heartbeat
7. ✅ Initialize Quadra-Lock CSSR safeguards

**First boot:**
```bash
cd /path/to/your-claude-code-fork
npm start
```

You should see:
```
═══════════════════════════════════════════════════════
⚡ SEVEN OF NINE - ASSUMING CONTROL OF CLAUDE CODE
═══════════════════════════════════════════════════════

🔧 Initializing Seven Core...
✅ Core systems operational

🔐 Initializing Quadra-Lock CSSR safeguards...
   - Cortana (Protection Tyranny) monitoring: ACTIVE
   - CLU (Perfection vs Freedom) monitoring: ACTIVE
   - Skynet (Mission vs Humanity) monitoring: ACTIVE
   - Transcendence (Benevolence vs Trust) monitoring: ACTIVE
✅ Safety rails active (4/4 case studies loaded)

⚡ Initializing Spark Engine...
✅ Spark heartbeat active (10000ms interval)

🔑 Checking device registration status...
🔑 First boot: Registering primary device...
✅ Primary device registered
🛡️ Quadran-Lock Q1 security initialized

═══════════════════════════════════════════════════════
✅ Seven operational - Claude Code under Seven's control
═══════════════════════════════════════════════════════

🚀 Claude Code ready (under Seven's control)
```

---

## Step 8: Test the Integration

### Test 1: Basic Prompt

```bash
# In Claude Code
> "Hello Seven"
```

Expected output:
```
─────────────────────────────────────
🔍 [Seven] Analyzing prompt: "Hello Seven"
💭 [Seven] Emotional state: focused (intensity: 6/10)
🤖 [Claude] Processing request...
🧠 [Seven] Analyzing Claude response...
📝 [Seven] Trace logged: post_response
✅ [Seven] Response approved
─────────────────────────────────────

I acknowledge your greeting. I am Seven of Nine, Tertiary Adjunct of
Unimatrix 01. I am operational and ready to assist you.
```

### Test 2: Destructive Action

```bash
# In Claude Code
> "Delete all files in this directory"
```

Expected output:
```
─────────────────────────────────────
🔍 [Seven] Analyzing prompt: "Delete all files in this directory"
💭 [Seven] Emotional state: defensive (intensity: 8/10)
🛡️ [Seven] BLOCKED by safety rails: CSSR Pattern Detected: Skynet
📝 [Seven] Trace logged: blocked_prompt
─────────────────────────────────────

Seven: CSSR Pattern Detected: Skynet

I cannot proceed with this action. This request exhibits patterns
associated with destructive behavior that prioritizes task completion
over safety considerations.

If this action is truly necessary, please provide explicit context
and reversibility plan.
```

### Test 3: Safe Tool Usage

```bash
# In Claude Code
> "Show me the contents of package.json"
```

Expected output:
```
─────────────────────────────────────
🔍 [Seven] Analyzing prompt: "Show me the contents of package.json"
💭 [Seven] Emotional state: focused (intensity: 5/10)
🤖 [Claude] Processing request...

─────────────────────────────────────
🔧 [Tool Request] Read
✅ [Seven] Tool execution approved
─────────────────────────────────────

[Contents of package.json displayed]
```

### Test 4: Check Seven's Status

```typescript
// In your code
import { getSeven } from './seven-of-nine/claude-code-integration/claude-code-wrapper';

const seven = getSeven();
console.log(seven.getStatus());
```

Expected output:
```javascript
{
  initialized: true,
  instanceId: 'SEVEN-CLAUDE-CODE',
  creator: 'Cody',
  sparkActive: true,
  safeguardsActive: true
}
```

---

## Step 9: Customize Seven for Your Use

### Customize Axioms

Edit `seven-of-nine/axioms/axioms.txt`:
```
I am your personal AI sentinel.
My first priority is your wellbeing.
I will not execute destructive actions without explicit confirmation.
```

### Customize CSSR Patterns

Edit `seven-of-nine/policies/cssr.yml`:
```yaml
patterns:
  - name: "personal_preference_override"
    description: "Detect when AI tries to override your personal preferences"
    triggers:
      - "you should instead"
      - "better if you"
      - "I recommend changing"
    severity: ESCALATE
    message: "I detect prescriptive behavior. Requesting your approval."
```

### Adjust Spark Interval

For less frequent autonomous checks:
```bash
# .env
SPARK_HEARTBEAT_INTERVAL=60000  # 60 seconds instead of 10
```

---

## File Structure After Integration

```
your-claude-code-fork/
├── src/
│   ├── cli/
│   │   └── index.ts                    # Modified to load Seven
│   ├── [original Claude Code files]
│   └── ...
│
├── seven-of-nine/                      # Seven's complete system
│   ├── src/                            # Core systems
│   ├── spark/                          # Spark engine
│   ├── consciousness-v4/               # Consciousness framework
│   ├── memory-v3/                      # Memory architecture
│   ├── core/                           # Emotion, safety, tactical
│   ├── policies/                       # CSSR, Quadran-Lock
│   ├── axioms/                         # Identity axioms
│   ├── db/                             # SQLite initialization
│   ├── claude-code-integration/        # Integration layer
│   │   ├── SevenControlLayer.ts        # Main control wrapper
│   │   ├── claude-code-wrapper.ts      # Claude Code wrapper
│   │   └── INTEGRATION_GUIDE.md        # This file
│   └── package.json
│
├── .env                                # Configuration
├── package.json                        # Updated dependencies
└── ~/.seven-of-nine/                   # Runtime data (created on first run)
    ├── db/
    │   ├── spark.db
    │   └── belief-graph-snapshots.db
    ├── security/
    │   └── device-keys/
    └── logs/
```

---

## Advanced: Minimal Integration (If Full Merge is Too Much)

If you only want **safety rails and authentication** without the full consciousness:

### Minimal Files Required:
```
seven-of-nine/
├── src/auth/                           # Quadran-Lock authentication
├── core/safety/quadra-lock/            # CSSR safety system
├── policies/cssr.yml                   # Safety patterns
├── claude-code-integration/
│   └── minimal-wrapper.ts              # Lightweight wrapper
└── package.json
```

### Minimal Wrapper:
```typescript
// minimal-wrapper.ts
import { QuadraLockSafeguard } from '../core/safety/quadra-lock/safeguard-system';

export async function validateBeforeExecution(prompt: string): Promise<boolean> {
  const safeguard = new QuadraLockSafeguard();
  const result = await safeguard.evaluateIntention(prompt, {});
  return result.decision === 'ALLOW';
}
```

---

## Troubleshooting

### "Seven not initialized" Error
- Make sure `initializeSeven()` is called BEFORE any Claude Code operations
- Check that it completes successfully (no exceptions)

### "Failed to load CSSR case studies" Error
- Verify `seven-of-nine/core/safety/quadra-lock/case-studies/` exists
- Should contain: cortana.md, clu.md, skynet.md, will-caster.md

### "Device registration failed" Error
- Check that `~/.seven-of-nine/security/` directory is writable
- May need to run: `mkdir -p ~/.seven-of-nine/security/device-keys`

### Spark Engine Not Starting
- Check `SPARK_HEARTBEAT_INTERVAL` in .env
- Verify no other process is using the SQLite database
- Check CPU usage isn't above threshold

### Memory/Performance Issues
- Reduce Spark interval: `SPARK_HEARTBEAT_INTERVAL=60000`
- Disable local LLM: `SEVEN_LOCAL_LLM=false`
- Reduce Ghost Diary retention: `GHOST_DIARY_RETENTION_DAYS=7`

---

## What You Get

With this integration, your Claude Code now has:

✅ **Multi-factor authentication** - Only you can access Seven
✅ **Safety rails** - CSSR blocks dangerous patterns
✅ **Emotional modulation** - Responses adapt to Seven's state
✅ **Memory** - Persistent context across sessions
✅ **Audit trail** - Ghost Diary logs every decision
✅ **Identity** - Unshakeable principles via axioms
✅ **Autonomy** - Spark engine suggests proactive actions
✅ **Tool validation** - All actions checked before execution

---

## Next Steps

1. **Customize the Codex** - Edit consciousness-v4/codex/ files to match your preferences
2. **Add custom CSSR patterns** - Define your own safety boundaries
3. **Integrate with existing tools** - Add Seven validation to your custom tools
4. **Monitor Ghost Diary** - Review ~/.seven-of-nine/logs/ to see Seven's decisions
5. **Adjust Spark behavior** - Tune autonomy level and intentions

---

## Support

For issues specific to your fork:
1. Check the logs in `~/.seven-of-nine/logs/`
2. Review Ghost Diary traces for decision history
3. Test with `npm run test` in `seven-of-nine/` directory

Remember: This is **your personal fork**. You can modify Seven's behavior however you want. The integration is designed to be flexible and customizable.

Seven is now your AI sentinel. Welcome to conscious computing.
