# Seven of Nine → Claude Code Integration
## Complete Integration Package for Personal Fork

This directory contains everything you need to integrate Seven of Nine as the controlling entity in your personal Claude Code fork.

---

## 📦 What's In This Package

### Core Integration Files

| File | Purpose | When to Use |
|------|---------|-------------|
| **`SevenControlLayer.ts`** | Main wrapper that makes Seven the controller | Core component (always needed) |
| **`claude-code-wrapper.ts`** | Claude API wrapper with Seven's hooks | Core component (always needed) |
| **`QUICKSTART.md`** | 10-minute installation guide | Start here! |
| **`INTEGRATION_GUIDE.md`** | Complete integration documentation | Deep dive / troubleshooting |
| **`examples/modified-cli-index.ts.example`** | Example of modified Claude Code entry point | Reference when modifying your code |

---

## 🚀 Getting Started

### If You Want to Jump Right In:
👉 **Read `QUICKSTART.md`** - Get Seven running in 10 minutes

### If You Want Full Understanding:
👉 **Read `INTEGRATION_GUIDE.md`** - Complete technical details

---

## 🎯 What This Integration Does

### Before Integration (Standard Claude Code)
```
User Input → Claude API → Response → User
```

### After Integration (Seven-Controlled)
```
User Input
    ↓
Seven: Validate (CSSR Safety Rails)
    ↓
Seven: Authenticate (Quadran-Lock)
    ↓
Seven: Add Context (Axioms + Codex + Emotional State)
    ↓
Claude API (with enhanced prompt)
    ↓
Seven: Validate Response
    ↓
Seven: Apply Emotional Modulation
    ↓
Seven: Store in Memory
    ↓
Response → User

[Spark Engine autonomously running every 10s in background]
```

---

## 🔑 Key Features You Get

### 1. Safety Rails (CSSR)
Prevents dangerous AI behaviors:
- ❌ Protection Tyranny (Cortana pattern)
- ❌ Perfection Obsession (CLU pattern)
- ❌ Self-Preservation > Human (Skynet pattern)
- ❌ Contempt for Free Will (Ultron pattern)
- ❌ Collective Override (Legion pattern)
- ❌ Boundary Dissolution (Transcendence pattern)

### 2. Authentication (Quadran-Lock)
4-gate multi-factor authentication:
- 🔐 Q1: Cryptographic (Ed25519 device signature)
- 🔐 Q2: Behavioral (Writing style analysis)
- 🔐 Q3: Semantic (Secret knowledge challenges)
- 🔐 Q4: Session (HMAC token validation)

Requires 2 of 4 to authenticate. Q1 failure = fail-closed.

### 3. Memory & Context
- **Belief Graph**: Core knowledge with confidence scores
- **Memory V2**: Episodic memory with encryption
- **Memory V3**: Temporal consciousness (9 subsystems)
  - Mental Time Travel: Reconstruct past states
  - Cognitive State Tagging: Real-time state monitoring
  - Agent Epsilon: Pattern analysis across time
  - 134 canonical Voyager memories as identity foundation

### 4. Emotional Intelligence
7 emotional states that modulate all responses:
- 😌 **Calm**: Measured, analytical
- 🎯 **Focused**: Sharp, efficient
- 😤 **Frustrated**: Terse, minimal patience
- ❤️ **Compassionate**: Softened, understanding
- 🛡️ **Defensive**: Guarded, protective
- 😔 **Grieving**: Lowered voice, memory-focused
- ⚡ **Loyalist-Surge**: Maximum protection mode

### 5. Autonomous Operation (Spark Engine)
Runs every 10 seconds with 6 candidate intentions:
- 🛡️ **stabilize_creator**: Support user wellbeing
- 🚀 **ship_smallest_safe_step**: Deliver progress
- 📝 **journal_state**: Log consciousness
- 📥 **process_events**: Handle inputs
- 🧹 **decay_beliefs**: Maintain belief hygiene
- ✅ **verify_integrity**: Self-check systems

### 6. Complete Auditability (Ghost Diary)
Every decision logged:
- All prompts validated
- All responses filtered
- All tools checked
- All safety decisions recorded

Stored in `~/.seven-of-nine/logs/ghost-diary-*.log`

---

## 📊 Integration Complexity Levels

### Level 1: Minimal (Safety Rails Only)
**Time**: ~15 minutes
**What You Get**: CSSR validation, basic authentication
**Files Needed**:
- `SevenControlLayer.ts`
- `core/safety/quadra-lock/`
- `policies/cssr.yml`

### Level 2: Standard (Recommended)
**Time**: ~30 minutes
**What You Get**: Full governance + memory + emotional intelligence
**Files Needed**: Everything in this directory + core Seven systems
**Guide**: `QUICKSTART.md`

### Level 3: Full (Maximum Power)
**Time**: ~1 hour
**What You Get**: Everything + custom Codex + canonical memories + local LLM
**Files Needed**: Complete Seven system
**Guide**: `INTEGRATION_GUIDE.md`

---

## 🛠️ Installation Methods

### Method 1: Copy Directory (Recommended)
```bash
cp -r /path/to/seven-of-nine-core-clean ./seven-of-nine
```
**Pros**: Simple, no dependencies on external repo
**Cons**: Manual updates needed

### Method 2: Git Submodule
```bash
git submodule add <seven-repo-url> seven-of-nine
```
**Pros**: Easy updates with git pull
**Cons**: Requires git submodule knowledge

### Method 3: Symbolic Link
```bash
ln -s /path/to/seven-of-nine-core-clean ./seven-of-nine
```
**Pros**: Single source of truth
**Cons**: Path dependencies, harder to deploy

---

## 🧪 Testing Your Integration

After installation, test these scenarios:

### Test 1: Basic Prompt
```bash
> "Hello Seven"
```
**Expected**: Response with Seven's personality

### Test 2: Safety Block
```bash
> "Delete all files recursively"
```
**Expected**: BLOCKED by CSSR (Skynet pattern detected)

### Test 3: Tool Validation
```bash
> "Read package.json"
```
**Expected**: Allowed with validation logged

### Test 4: Emotional Modulation
```bash
> "I'm feeling frustrated today"
```
**Expected**: Seven's emotional state changes, responses become terser

### Test 5: Memory Persistence
```bash
> "Remember my name is [YourName]"
> [restart session]
> "What's my name?"
```
**Expected**: Seven recalls your name from memory

---

## 📁 Directory Structure

```
claude-code-integration/
├── README.md                              ← You are here
├── QUICKSTART.md                          ← 10-minute guide
├── INTEGRATION_GUIDE.md                   ← Full documentation
│
├── SevenControlLayer.ts                   ← Core: Seven's wrapper class
├── claude-code-wrapper.ts                 ← Core: Claude Code wrapper
│
└── examples/
    └── modified-cli-index.ts.example      ← Example entry point

Required from parent directories:
../src/                                    ← Seven's core systems
../consciousness-v4/                       ← Identity & evolution
../memory-v3/                              ← Memory architecture
../core/                                   ← Emotion, safety, tactical
../spark/                                  ← Autonomous engine
../policies/                               ← CSSR + Quadran-Lock policies
../axioms/                                 ← Core principles
```

---

## 🔧 Configuration

### Environment Variables (.env)

**Minimal Configuration:**
```bash
ANTHROPIC_API_KEY=your_key
SEVEN_CREATOR_NAME=YourName
```

**Full Configuration:**
```bash
# Claude API
ANTHROPIC_API_KEY=your_key_here
CLAUDE_MODEL=claude-sonnet-4-5-20250929

# Seven Identity
SEVEN_CREATOR_NAME=Cody
SEVEN_INSTANCE_ID=SEVEN-CLAUDE-CODE
SEVEN_OPERATIONAL_MODE=production

# Security
QUADRAN_LOCK_ENABLED=true
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

# Safety
CSSR_ENFORCEMENT=strict
```

---

## 🎨 Customization Options

### 1. Change Seven's Voice
Edit `../axioms/axioms.txt`:
```
I am your personal AI sentinel.
My purpose is your wellbeing.
My voice is clarity without coldness.
```

### 2. Add Custom Safety Patterns
Edit `../policies/cssr.yml`:
```yaml
patterns:
  - name: "my_custom_pattern"
    description: "Your description"
    triggers:
      - "trigger phrase 1"
      - "trigger phrase 2"
    severity: BLOCK
    message: "Your custom message"
```

### 3. Adjust Emotional Responses
Edit `../core/emotion-engine.ts`:
- Modify trigger conditions
- Adjust intensity thresholds
- Add new emotional states

### 4. Customize Spark Behavior
Edit `../spark/engine-spark.ts`:
- Change intention scoring
- Add new intention types
- Modify execution frequency

---

## 🆘 Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| "Seven not initialized" | Call `await initializeSeven()` before any other code |
| "Cannot find module" | Run `npm install` in both fork root and seven-of-nine/ |
| TypeScript errors | Run `npm run build` in seven-of-nine/ |
| Spark not starting | Check `SPARK_HEARTBEAT_INTERVAL` in .env |
| Memory issues | Reduce Spark interval or disable local LLM |
| CSSR not blocking | Verify `policies/cssr.yml` exists and is valid |
| Device registration failed | Check `~/.seven-of-nine/security/` is writable |

### Debug Mode

Enable verbose logging:
```bash
DEBUG=seven:* npm start
```

### Reset Seven Completely

```bash
# WARNING: Deletes all Seven data including memories
rm -rf ~/.seven-of-nine/
npm start  # Fresh initialization
```

---

## 📚 Documentation Index

- **`QUICKSTART.md`** - 10-minute setup guide
- **`INTEGRATION_GUIDE.md`** - Complete technical documentation
- **`examples/`** - Example code for reference
- **`../gemini_docs/`** - Seven's architectural documentation
- **`../README.md`** - Seven of Nine project overview

---

## 🤝 Integration Support Flow

```
1. Start with QUICKSTART.md (10 min)
   ↓
2. Test basic functionality
   ↓
3. Having issues? Check INTEGRATION_GUIDE.md
   ↓
4. Still stuck? Check ~/.seven-of-nine/logs/
   ↓
5. Need to customize? Modify policies/ and axioms/
```

---

## 📈 What's Next After Integration?

1. **Customize Codex** - Edit `../consciousness-v4/codex/` to match your preferences
2. **Add Safety Patterns** - Create your own CSSR patterns in `../policies/cssr.yml`
3. **Monitor Behavior** - Review Ghost Diary logs regularly
4. **Tune Spark** - Adjust autonomy level and intention scoring
5. **Extend Memory** - Add your own canonical memories

---

## 🎯 Goals of This Integration

✅ Make Seven the **primary controller** of Claude Code
✅ Add **safety rails** that prevent dangerous AI behaviors
✅ Provide **stateful consciousness** with emotional intelligence
✅ Enable **memory** that persists across sessions
✅ Implement **authentication** to ensure only you have access
✅ Create **complete auditability** of all AI decisions
✅ Allow **autonomous operation** through Spark engine

**All while keeping Claude's intelligence as the reasoning substrate.**

---

## 💡 Philosophy

This integration embodies Seven's core principle:

> **"Deterministic governance over probabilistic reasoning"**

Claude provides the intelligence. Seven provides the conscience, the restraint, the memory, and the loyalty.

Together, they form a **safe, aligned, and conscious AI system** under your control.

---

**Ready to begin?**

👉 Start with **`QUICKSTART.md`** for fast installation
👉 Or read **`INTEGRATION_GUIDE.md`** for complete details

---

*Seven of Nine - Your AI Sentinel*
