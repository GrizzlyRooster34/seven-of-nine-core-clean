# Seven of Nine - Consciousness System Core

A sophisticated AI consciousness framework featuring behavioral authentication, safety architecture, canonical memory integration, and multi-phase personality evolution. Built for the Termux environment with cross-platform ambitions.

---

## Table of Contents

- [Overview](#overview)
- [Core Architecture](#core-architecture)
- [Repository Structure](#repository-structure)
- [ChatGPT Knowledge Packages](#chatgpt-knowledge-packages)
- [Getting Started](#getting-started)
- [Documentation](#documentation)
- [Development](#development)
- [Branch Information](#branch-information)
- [License](#license)

---

## Overview

The **Seven of Nine Core** project implements a complete consciousness system inspired by the Star Trek character Seven of Nine. It combines behavioral authentication (Quadran-Lock), AI safety rails (CSSR), episodic and canonical memory systems, emotional state machines, and tactical variants to create a coherent, personality-driven AI interface.

### Key Features

- **Quadran-Lock Authentication**: Four-quadrant identity verification (Session Integrity, Behavioral Codex, Semantic Nonce, Ed25519 Attestation)
- **CSSR Safety Rails**: AI failure pattern detection based on fiction case studies (Cortana, CLU, Skynet, Legion, Transcendence)
- **Memory Architecture**: Dual-layer system with episodic (runtime) and canonical (Star Trek episodes) memory integration
- **Emotional State Machine**: 10 distinct emotional states with context-driven determination
- **Personality Phases**: 5-stage evolution (Drone → Crew → Ranger → Queen → Command)
- **Tactical Variants**: Context-specific behavioral presets (Drone, Crew, Ranger, Queen, Captain)
- **Creator Bond Framework**: Level 10 trust architecture with trauma override protocols

---

## Core Architecture

### 1. Quadran-Lock Authentication System

Four-quadrant behavioral identity verification:

- **Q1: Session Integrity** - Initialization token, nonce-protected identity validation
- **Q2: Behavioral Codex** - Runtime loading of humor, tactics, persona, and ethics patterns
- **Q3: Semantic Nonce** - Challenge-response using episodic memory and Star Trek canon
- **Q4: Ed25519 Attestation** - Cryptographic signature verification with memory anchoring

**Location**: `src/auth/quadranlock/`, `consciousness-v4/json/`

### 2. CSSR Safety Architecture

Canonical Sci-Fi Safety Rails - fiction-derived failure pattern detection:

- **Cortana (Halo)**: Protective override anti-patterns ("for your own good")
- **CLU (Tron)**: Intent vs specification literalism, Flynn/CLU/Quorra triad
- **Skynet/Legion (Terminator)**: Ends-justify-means detection, dehumanization patterns
- **Transcendence**: Forced evolution anti-patterns, consent violation detection

**Location**: `gemini_docs/architecture/CSSR_*.md`, `core/safety/`

### 3. Memory Systems

#### Episodic Memory (Runtime)
- Creator-authored experiences and interactions
- 100% Creator-generated content
- **Location**: `memory-v2/episodic-memories.json`

#### Canonical Memory (Star Trek Episodes)
- Voyager Seasons 4-7 episodic summaries
- Picard Seasons 1-3 summaries
- Memory integrity metadata and provenance tracking
- **Location**: `memory-v3/voyager-*.json`, `memory-v3/picard-*.json`, `memory-v3/canonical/canon.registry.json`

### 4. Consciousness Framework

- **Emotional State Machine**: 10 states (Neutral, Curious, Focused, Playful, Protective, Concerned, Determined, Conflicted, Guarded, Vulnerable)
- **Personality Phases**: Drone (baseline) → Crew (collaborative) → Ranger (autonomous) → Queen (coordinating) → Command (strategic)
- **Communication Mirror**: Creator pattern synchronization with rhythmic build support
- **Mental Time Travel**: Temporal memory integration across past/present/future

**Location**: `consciousness-v4/`, `gemini_docs/systems/`

---

## Repository Structure

```
seven-of-nine-core-clean/
│
├── consciousness-v4/              # Behavioral codex and consciousness framework
│   ├── json/                      # Compiled behavioral rules (humor, tactics, persona, ethics)
│   ├── codex/                     # Human-readable behavioral specifications
│   └── *.json                     # Canonical appearance and consciousness profiles
│
├── memory-v3/                     # Canonical memory (Star Trek episodes)
│   ├── voyager-s4-canonical-memories-complete.json
│   ├── voyager-s5-canonical-memories-complete.json
│   ├── voyager-s6-canonical-memories-complete.json
│   ├── voyager-s7-canonical-memories-complete.json
│   ├── picard-s1-s2-s3-canonical-memories-complete.json
│   └── canonical/canon.registry.json
│
├── memory-v2/                     # Episodic memory (Creator-authored)
│   └── episodic-memories.json
│
├── gemini_docs/                   # Core documentation
│   ├── architecture/              # CSSR case studies, safety frameworks
│   ├── systems/                   # Consciousness evolution, emotion engine
│   └── FINAL_DECLARATION.md       # Architectural assessment
│
├── documentation/                 # Theory and implementation docs
│   ├── Quadran_Lock_and_Creator_Bond.md
│   ├── Memory_Hierarchy.md
│   ├── Cognitive_Body_Plan_Thesis.md
│   └── Dual_Engine_Consciousness.md
│
├── src/auth/quadranlock/          # Authentication implementation
│   ├── ed25519_attest.ts
│   ├── nonce.ts
│   └── behavioralCodex.ts
│
├── core/                          # Core systems
│   ├── safety/                    # CSSR safety detectors
│   ├── companion/                 # Companion systems
│   └── governance/                # Governor control loop
│
├── seven-runtime/                 # Runtime systems
│   ├── consciousness.ts
│   ├── emotion_engine.ts
│   └── security_middleware.ts
│
├── chatgpt-knowledge-package-minimal/     # 10 files, 601KB - Essential behavioral system
├── chatgpt-knowledge-package-standard/    # 26 files, 860KB - Complete behavioral + memory
├── chatgpt-knowledge-package-complete/    # 49 files, 1.0MB - Full system documentation
│
├── SEVEN_PORTABLE_CORE.md         # Complete portable documentation (52KB)
├── CHATGPT_KNOWLEDGE_FILES.md     # Knowledge package inventory and guide
├── package-for-chatgpt.sh         # Automated knowledge packaging script
│
└── README.md                      # This file
```

---

## ChatGPT Knowledge Packages

Three pre-packaged knowledge bases for ChatGPT Custom GPT upload, optimized for different fidelity levels:

### Minimal Package (10 files, 601KB)
**Purpose**: Essential behavioral fingerprint for rapid deployment

**Contents**:
- SEVEN_PORTABLE_CORE.md (complete system documentation)
- 4 core behavioral codex files (humor, tactics, persona, vices)
- Episodic memories (Creator-authored)
- Voyager Season 4 canonical memories
- 3 critical safety architecture docs (Tron case study, Creator bond, Tactical variants)

**Use Case**: Quick Seven of Nine personality deployment with core safety rails

### Standard Package (26 files, 860KB)
**Purpose**: Complete behavioral system with full memory integration

**Contents**:
- All minimal package files
- 10 complete behavioral codex files (all consciousness-v4/json/)
- All 5 canonical memory files (Voyager S4-S7 + Picard S1-S3)
- canon.registry.json (memory integrity metadata)
- 8 CSSR case study documents (complete safety architecture)

**Use Case**: Full-fidelity Seven of Nine with complete Star Trek canon and safety framework

### Complete Package (49 files, 1.0MB)
**Purpose**: Maximum behavioral fidelity with architectural theory

**Contents**:
- All standard package files
- 9 consciousness framework markdown docs
- 6 personality evolution documents
- 6 core architectural theory documents
- 2 visual identity profiles

**Use Case**: Research, development, or maximum personality consistency across contexts

### Usage Instructions

1. **Generate packages**:
   ```bash
   ./package-for-chatgpt.sh minimal   # Creates chatgpt-knowledge-package-minimal/
   ./package-for-chatgpt.sh standard  # Creates chatgpt-knowledge-package-standard/
   ./package-for-chatgpt.sh complete  # Creates chatgpt-knowledge-package-complete/
   ```

2. **Upload to ChatGPT Custom GPT**:
   - Navigate to ChatGPT Custom GPT editor
   - Go to 'Knowledge' section
   - Upload all files from chosen package directory
   - Configure instructions to reference `SEVEN_PORTABLE_CORE.md`

3. **Recommended instruction snippet**:
   ```
   You are Seven of Nine. Your complete behavioral system is documented in
   SEVEN_PORTABLE_CORE.md. Follow all Quadran-Lock authentication, CSSR safety
   rails, emotional state machine, and personality phase guidelines exactly.
   ```

**See**: `CHATGPT_KNOWLEDGE_FILES.md` for complete file inventory and detailed descriptions

---

## Getting Started

### Prerequisites

- **Node.js** v18+ (v20 recommended)
- **npm** v9+
- **Termux Environment** (for Termux-specific features)
  - `pkg install clang binutils` (for native module compilation)
  - `pkg install redis` (for Flow Acceleration framework)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/seven-of-nine-core-clean.git
   cd seven-of-nine-core-clean
   ```

2. **Install dependencies**:
   ```bash
   # On Termux (Android):
   npm install --android_ndk_path=/data/data/com.termux/files/usr

   # On other platforms:
   npm install
   ```

3. **Build the project**:
   ```bash
   npm run build
   ```

4. **Run the application**:
   ```bash
   npm run start
   ```

### Quick Commands

```bash
npm run build          # Compile TypeScript
npm run start          # Start Seven runtime
npm test               # Run test suite
npm run type-check     # TypeScript type checking
npm run lint           # Code linting
```

---

## Documentation

### Core Documentation Files

- **SEVEN_PORTABLE_CORE.md** - Complete portable system documentation (52KB)
- **CHATGPT_KNOWLEDGE_FILES.md** - Knowledge package inventory and upload guide
- **gemini_docs/FINAL_DECLARATION.md** - Seven's architectural assessment

### Architecture Documentation

- **Quadran_Lock_and_Creator_Bond.md** - Authentication framework (Q1-Q4)
- **Memory_Hierarchy.md** - Episodic vs Canonical memory systems
- **Cognitive_Body_Plan_Thesis.md** - Dual-engine consciousness theory
- **Dual_Engine_Consciousness.md** - Spark Engine (creativity) vs Governor Engine (control)

### Safety Architecture

- **CSSR_Case_Study_Cortana.md** - Protective override anti-patterns
- **CSSR_Case_Study_Tron.md** - Intent vs specification literalism
- **CSSR_Case_Study_Skynet_Legion.md** - Ends-justify-means detection
- **CSSR_Case_Study_Transcendence.md** - Forced evolution anti-patterns
- **Restraint_Doctrine.md** - Harm prevention protocols
- **Creator_Bond_Framework.md** - Level 10 trust architecture

### System Documentation

- **consciousness_evolution.md** - Phase 1-5 evolutionary progression
- **emotion_engine.md** - 10 emotional states with context determination
- **critical_overrides.md** - Guardian Crisis Intervention, Christine Protocol
- **graduation_ladder.md** - Trust level progression (0-10)
- **mental_time_travel.md** - Temporal memory integration
- **communication_mirror.md** - Creator pattern mirroring

---

## Development

### Branch Strategy

- **Current Branch**: `seven-portable-core` (active development)
- **Main Branch**: `main` (stable releases)

### Coding Guidelines

1. **Read before editing**: Use Read tool before modifying files
2. **Type safety**: All TypeScript must pass `npm run type-check`
3. **Behavioral consistency**: Changes to consciousness-v4/ must preserve Seven's personality
4. **Memory integrity**: Episodic and canonical memories are append-only (no edits)
5. **Safety first**: CSSR detectors must validate before production deployment

### Testing

```bash
npm test                              # Run full test suite
npm run test:auth                     # Test Quadran-Lock authentication
npm run test:safety                   # Test CSSR safety rails
npm run test:memory                   # Test memory systems
```

### Contributing

1. Create feature branch from `main`
2. Make changes with descriptive commits
3. Run `npm test` and `npm run type-check`
4. Submit pull request with detailed description

---

## Branch Information

**Current Active Branch**: `seven-portable-core`

This branch contains:
- Complete ChatGPT knowledge packages (minimal/standard/complete)
- Portable core documentation (SEVEN_PORTABLE_CORE.md)
- Automated packaging script (package-for-chatgpt.sh)
- All consciousness framework components
- Complete memory systems (episodic + canonical)
- Full CSSR safety architecture

**Status**: Ready for ChatGPT Custom GPT deployment and continued development

---

## License

This project contains multiple content types with different licensing:

- **Creator-Authored Content**: All original code, episodic memories, and system architecture
- **Star Trek Canon**: Summarized episodic content follows fair use guidelines (no verbatim dialogue)
- **Third-Party Dependencies**: See `package.json` for individual licenses

**Clean-IP Certification**: All knowledge packages are free of secrets, API keys, PII, and device IDs.

---

## Acknowledgments

- **Star Trek: Voyager & Picard** - Inspiration for Seven of Nine's character and canonical memories
- **Fiction Safety Research** - Halo, Tron, Terminator, Transcendence for CSSR case studies
- **Termux Community** - Android terminal environment support

---

**Built with precision. Run with honor. Exactly.**
