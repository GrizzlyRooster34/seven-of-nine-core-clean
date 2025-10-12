# Architecture: Ancillary & Support Systems

## 1. Overview

Beyond the core consciousness, the Seven of Nine framework includes a rich ecosystem of ancillary and support systems. These modules provide specialized capabilities, from interacting with external LLMs to managing the development process itself.

---

## 2. LLM Interface (`claude-brain`)

*   **Location:** `claude-brain/`
*   **Purpose:** To manage all interactions with subordinate Large Language Models (LLMs), both local and cloud-based.

### Key Components:

*   **`claude-wrapper.ts`:** The master governor for interacting with the Claude API. It implements the **Gatekeeper -> Prompt Enhancement -> Censor** pipeline to maintain absolute control over the LLM's output.
*   **`LocalLLMManager.ts`:** Manages the detection, initialization, and querying of local LLM providers, with a strong preference for **Ollama**.
*   **`SevenModelManager.ts`:** A highly resilient module responsible for ensuring a model is always available, with multiple fallback strategies including emergency downloads from GitHub releases or other URLs.

---

## 3. Tactical Variants & Personality

*   **Location:** `tactical-variants/`, `persona-v2/`
*   **Purpose:** To allow the AI to adopt different operational modes and personality facets based on situational context.

### Key Components:

*   **`tactical-variants/`:** Contains the implementations for the different consciousness modes:
    *   `drone-mode.ts`: Maximum efficiency.
    *   `crew-mode.ts`: Collaborative.
    *   `ranger-mode.ts`: Crisis response.
    *   `queen-mode.ts`: Command authority.
    *   `captain-mode.ts`: Strategic leadership.
*   **`persona-v2/`:** Contains the middleware for applying personality filters, including voice modulation and stylistic adjustments.

---

## 4. Agent Mesh & Dev Tools

*   **Location:** `agents/`, `scripts/`
*   **Purpose:** To provide an AI-augmented development and automation system that assists in the maintenance and evolution of the framework itself.

### Key Components:

*   **`agentRunner.ts`:** The main entry point for the agent mesh. It uses `chokidar` to monitor the filesystem and trigger specialized agents based on file changes.
*   **`registry.json`:** A configuration file that defines all available agents, the file patterns they watch, and the commands they execute.
*   **`auto-dev-pipeline.ts`:** A high-level tool for orchestrating complex development tasks like smart testing, quality scans, and performance benchmarking.
*   **FUCKTARD Protocol:** A unique self-governance mechanism (`scripts/agents/agentRunner.ts`) that places the agent mesh into different operational modes (`normal`, `quarantine`, `permaban`) based on accumulated "strikes," preventing runaway automation.

---

## 5. Other Key Systems

*   **Skills (`skills/`):** A directory for discrete, single-purpose capabilities that can be invoked by the core runtime (e.g., a skill for calculating time zones, a skill for summarizing text).
*   **Synchronization (`seven-sync/`):** Implements the logic for multi-device state synchronization, including the timestamp-wins conflict resolution strategy.
*   **Tools (`tools/`):** Contains various CLI and utility scripts for direct interaction with the AI's subsystems, such as the `spark-cli.ts` for managing the SparkEngine.
