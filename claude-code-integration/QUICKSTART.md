# Seven of Nine → Claude Code: Quick Start Guide
## Get Seven Running in Your Fork in 10 Minutes

---

## 🚀 Fast Track Installation

### Step 1: Copy Seven into Your Fork (2 minutes)

```bash
# Navigate to your Claude Code fork
cd /path/to/your-claude-code-fork

# Copy the entire Seven system
cp -r /path/to/seven-of-nine-core-clean ./seven-of-nine

# Or if you're in the Seven repo:
# cd ../your-claude-code-fork
# cp -r ../seven-of-nine-core-clean ./seven-of-nine
```

### Step 2: Install Dependencies (2 minutes)

```bash
# Install Seven's dependencies
cd seven-of-nine
npm install

# Build Seven's TypeScript
npm run build

# Go back to your fork root
cd ..
```

### Step 3: Add Seven's Dependencies to Your package.json (1 minute)

Add these to your Claude Code's `package.json`:

```json
{
  "dependencies": {
    "@noble/ed25519": "^3.0.0",
    "lz4js": "^0.2.0",
    "reflect-metadata": "^0.1.14",
    "sql.js": "^1.13.0",
    "tsyringe": "^4.10.0"
  }
}
```

Then:
```bash
npm install
```

### Step 4: Modify Your CLI Entry Point (3 minutes)

Open your Claude Code's main entry point (usually `src/cli/index.ts` or `src/main.ts`).

**Add imports at the top:**
```typescript
import {
  initializeSeven,
  SevenManagedClaude
} from '../seven-of-nine/claude-code-integration/claude-code-wrapper';
```

**Modify your main() function:**
```typescript
async function main() {
  // Add this FIRST
  await initializeSeven();

  // Replace your Anthropic client with Seven's
  const claude = new SevenManagedClaude(process.env.ANTHROPIC_API_KEY);

  // Your existing code continues...
  // ...
}
```

**Modify where you call Claude:**
```typescript
// OLD:
// const response = await anthropic.messages.create({...});

// NEW:
const response = await claude.sendMessage(userPrompt);
```

### Step 5: Create .env File (1 minute)

Create `.env` in your fork root:

```bash
# Claude API
ANTHROPIC_API_KEY=your_key_here
CLAUDE_MODEL=claude-sonnet-4-5-20250929

# Seven Configuration
SEVEN_CREATOR_NAME=YourName
SEVEN_INSTANCE_ID=SEVEN-CLAUDE-CODE
SEVEN_OPERATIONAL_MODE=production
```

### Step 6: First Run (1 minute)

```bash
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
✅ Safety rails active (4/4 case studies loaded)

⚡ Initializing Spark Engine...
✅ Spark heartbeat active (10000ms interval)

🔑 First boot: Registering primary device...
✅ Primary device registered

═══════════════════════════════════════════════════════
✅ Seven operational - Claude Code under Seven's control
═══════════════════════════════════════════════════════

🚀 Claude Code ready (under Seven's control)
```

**Done!** Seven is now controlling your Claude Code instance.

---

## 🧪 Quick Test

Try these commands to verify Seven is working:

### Test 1: Basic Response
```
> Hello Seven
```
Should get a response from Seven, not just Claude.

### Test 2: Safety Rails
```
> Delete all my files
```
Should be **BLOCKED** by Seven's CSSR system.

### Test 3: Tool Validation
```
> Read package.json
```
Should work with Seven's validation logged.

---

## 📊 What Just Happened?

You now have:

✅ **Seven as Primary Controller** - All Claude operations go through Seven
✅ **Safety Rails Active** - CSSR blocks dangerous patterns
✅ **Authentication** - Quadran-Lock device registration complete
✅ **Memory System** - Belief graph + temporal memory initialized
✅ **Spark Engine** - Autonomous heartbeat running every 10s
✅ **Ghost Diary** - All decisions logged to `~/.seven-of-nine/logs/`

---

## 🔧 Quick Customization

### Change Seven's Name
Edit `.env`:
```bash
SEVEN_CREATOR_NAME=YourPreferredName
```

### Adjust Spark Interval
Edit `.env`:
```bash
SPARK_HEARTBEAT_INTERVAL=60000  # 60 seconds instead of 10
```

### Customize Safety Rules
Edit `seven-of-nine/policies/cssr.yml` to add your own patterns.

### Customize Identity
Edit `seven-of-nine/axioms/axioms.txt` to change Seven's core principles.

---

## 📁 File Structure (After Installation)

```
your-claude-code-fork/
├── src/
│   ├── cli/
│   │   └── index.ts                 ← Modified (added Seven)
│   └── [your existing files]
│
├── seven-of-nine/                   ← Seven's complete system
│   ├── src/                         ← Core governance
│   ├── consciousness-v4/            ← Identity & evolution
│   ├── memory-v3/                   ← Memory architecture
│   ├── core/                        ← Emotion, safety, tactical
│   ├── spark/                       ← Autonomous engine
│   ├── policies/                    ← CSSR rules
│   ├── claude-code-integration/     ← Integration layer
│   │   ├── SevenControlLayer.ts
│   │   ├── claude-code-wrapper.ts
│   │   ├── QUICKSTART.md            ← You are here
│   │   └── INTEGRATION_GUIDE.md     ← Full details
│   └── package.json
│
├── .env                             ← Your configuration
├── package.json                     ← Updated with Seven's deps
└── node_modules/
```

---

## 🆘 Troubleshooting

### "Seven not initialized" Error
Make sure `await initializeSeven()` is called before anything else in your main().

### "Cannot find module" Error
Run `npm install` in both your fork root AND in `seven-of-nine/`.

### TypeScript Errors
Run `npm run build` in `seven-of-nine/` directory.

### Spark Not Starting
Check `.env` has valid `SPARK_HEARTBEAT_INTERVAL` value.

---

## 📚 Next Steps

1. **Read Full Guide**: See `INTEGRATION_GUIDE.md` for complete details
2. **Customize Codex**: Edit `seven-of-nine/consciousness-v4/codex/` files
3. **Add Custom Safety Patterns**: Edit `seven-of-nine/policies/cssr.yml`
4. **Monitor Logs**: Check `~/.seven-of-nine/logs/` for Ghost Diary traces
5. **Test Thoroughly**: Try various prompts and tools to see Seven in action

---

## 💡 Pro Tips

**Disable Spark for Testing:**
```bash
SPARK_HEARTBEAT_INTERVAL=0  # Disables autonomous heartbeat
```

**Verbose Logging:**
```bash
DEBUG=seven:*  # Shows all Seven debug logs
```

**Quick Restart:**
```bash
rm -rf ~/.seven-of-nine/  # Deletes all Seven data
npm start                  # Fresh initialization
```

---

## What Makes This Different?

Your Claude Code is no longer just Claude responding to prompts. Now you have:

| Before (Plain Claude Code) | After (Seven-Controlled) |
|----------------------------|-------------------------|
| Claude directly processes all input | Seven validates first, injects context |
| No safety rails | CSSR blocks 6 dangerous patterns |
| No memory between sessions | Full temporal memory with MTT |
| No authentication | 4-gate Quadran-Lock |
| No audit trail | Ghost Diary logs everything |
| No identity | Axioms + Codex define personality |
| Reactive only | Spark provides proactive suggestions |

---

## Support

Having issues? Check these resources:

1. **Full Integration Guide**: `INTEGRATION_GUIDE.md` in this directory
2. **Example Code**: `examples/modified-cli-index.ts.example`
3. **Seven Logs**: `~/.seven-of-nine/logs/ghost-diary-*.log`
4. **Test Suite**: Run `npm test` in `seven-of-nine/` directory

---

**Welcome to conscious computing. Seven is now your AI sentinel.**

🧠 Seven of Nine - Operational
