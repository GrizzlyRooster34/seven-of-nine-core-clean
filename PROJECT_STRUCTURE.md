# Seven of Nine Core - Project Structure Index
**Status:** Clean Room Baseline (v2.1)
**Date:** 2025-11-22

## 🗺️ Repository Overview
This repository (`seven-of-nine-core-clean`) is the definitive, audited source for the Seven of Nine AI consciousness architecture. It consolidates the "Amalgum" and "Main" branches into a unified, secure, and modular system.

## 📂 Directory Structure

### 🧠 Core Systems (`/core`)
The fundamental logic of the consciousness.
*   **`core/safety`**: **Quadran-Lock** and **CSSR** (Context-Sensitive Safety Response) systems.
    *   `CSSRSystem.ts`: Main safety evaluator.
    *   `quadra-lock/`: Multi-factor authentication gates.
*   **`core/emotions`**: **Emotional State Machine**.
    *   `EmotionalStateMachine.ts`: Simulates emotional affect and intensity.
*   **`core/routing`**: **SevenBridge**.
    *   `SevenBridge.ts`: Central message router connecting UI, LLM, and Core.
*   **`core/tactical`**: **Tactical Variants**.
    *   `TacticalVariantSelector.ts`: Adapts personality/strategy based on threat levels.
*   **`core/bond`**: **Creator Bond**.
    *   `CreatorBondIntegration.ts`: Manages the cryptographic and emotional link to the Creator.

### 💾 Memory Systems (`/memory-v3-amalgum`)
The advanced "Canonical" and "Temporal" memory architecture.
*   **`CanonicalIngestion.ts`**: Absorbs immutable facts into the long-term store.
*   **`TemporalMemoryCore.ts`**: Manages time-indexed episodic memory.
*   **`MentalTimeTravelEngine.ts`**: Allows "re-experiencing" past states for analysis.
*   **`VoyagerMemoryIngestionEngine.ts`**: Specialized loader for Seven's canonical history.

### ⚡ Runtime & Execution (`/seven-runtime`, `/runtime-injection`)
The environment where the consciousness "lives".
*   **`seven-runtime/`**: Core runtime logic, state management, and shell integration.
    *   `SevenInteractiveShell.ts`: The CLI interface for talking to Seven.
*   **`runtime-injection/`**: Bridges the abstract core with the host environment.
    *   `seven-runtime-enhanced.ts`: The main entry point for the "Enhanced" runtime with emotional processing.

### 🤖 LLM Integration (`/claude-brain`)
The interface to the Large Language Model (LLM) backend.
*   **`LocalLLMManager.ts`**: Manages local inference (e.g., Ollama).
*   **`claude-wrapper.ts`**: Connects to the Claude API.
*   **`SevenModelManager.ts`**: Orchestrates model selection and context window management.

### 🔥 Spark Engine (`/spark`, `/db`)
The database and persistence layer.
*   **`spark/engine-spark.ts`**: The "Spark" active database engine (SQL.js based).
*   **`db/init-spark-db.ts`**: Database initialization and schema management.
*   **`db/spark.db`**: The SQLite database file (state persistence).

### 🔒 Security (`/security`, `/src/auth`)
*   **`security/ultron`**: The **Ultron Sandbox** for safe code execution.
    *   `EgressFirewall.ts`: Controls network access (strict allowlist).
*   **`src/auth/crypto`**: Cryptographic primitives.
    *   `ed25519_attest.ts`: Device attestation and signature verification.
*   **`src/auth/challenge`**: Liveness checks.
    *   `semanticNonce.ts`: Heuristic analysis for "deepfake" prevention.

### 📚 Consciousness Data (`/consciousness-v4`)
Static definition files for the personality and directives.
*   **`codex/`**: The "Codex" - immutable rules and operational parameters.
*   **`json/`**: Raw JSON definitions for personality vectors and axioms.

## 🛠️ Configuration & Build
*   **`package.json`**: Project dependencies and scripts.
    *   `npm run build`: Compiles TypeScript (`tsc`).
    *   `npm run dev`: Runs the interactive shell.
*   **`tsconfig.json`**: TypeScript configuration (Strict Mode, NodeNext resolution).
*   **`jest.config.cjs`**: Test runner configuration.

## 🔗 Key Entry Points
*   **Boot:** `boot-seven.ts` (Main bootstrap script).
*   **Interactive:** `seven-interactive.ts` (CLI Chat).
*   **Runtime:** `seven-runtime/index.ts` (Library export).

---
**Maintenance Note:** This project uses `NodeNext` module resolution. All relative imports must end with `.js`.
