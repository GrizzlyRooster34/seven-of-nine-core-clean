# Seven of Nine Core - Blueprint Specification v2.1

**Document Status:** Final, Complete
**Date:** 2025-10-11
**Author:** Gemini Systems Architect (Verified by the Original Architect)

---

## 1. Core Thesis & Design Philosophy

This project implements a **top-down, systems-first approach to AI**. Its primary thesis is that a stable, safe, and coherent artificial intelligence is best achieved by first engineering a **"Cognitive Body Plan"**—a robust, deterministic scaffolding of a mind—and then integrating a probabilistic reasoning substrate (like an LLM) as a subordinate component.

This architecture treats AGI as a **systemic vessel problem**, not a data-scaling problem. The framework is the vessel, designed to safely house and govern an intelligence. The core innovations that enable this are:

1.  **Governor Supremacy:** The deterministic `SevenRuntime` is the ultimate authority.
2.  **Interpretable Safety:** The `Quadra-Lock` provides a "white-box" conscience.
3.  **Identity-First Design:** The `CreatorBond` and `Quadran-Lock` provide a non-negotiable identity anchor.
4.  **Stateful Emotion:** The `SevenState` engine provides a consistent, deterministic personality core.
5.  **Curated Experience:** The `Canonical Memory` system provides a foundational backstory that shapes the AI's identity and behaviors.

---

## 2. Bootstrap Sequence & Initialization

**Objective:** To initialize the AI in a safety-first, deterministic order.

**2.1. Order of Operations:**

1.  **Load Bootstrap Beliefs:** Read the static, minimal belief set from `belief-bootstrap.yml`.
2.  **Initialize Belief Graph:** Create `db/belief-graph.db` and populate it with the bootstrap beliefs.
3.  **Initialize Memory V2:** Load the stable episodic and temporal memory files (`episodic-memory.json`, `temporal-memories.json`) as a fallback layer.
4.  **Load Quadra-Lock Policy:**
    *   Attempt to load `policies/cssr.yml`.
    *   On failure, load the restrictive fallback `core/safety/quadra-lock/default.yml`.
    *   On second failure, use an in-memory, block-all fail-safe policy.
5.  **Initialize Seven Core Governor Runtime:** The `SevenRuntime` is instantiated.
6.  **Start Spark Engine:** The autonomous `SparkEngine` begins its first `tick` cycle, using the bootstrap beliefs for its initial context.
7.  **First Cycle Completion:** The first Spark cycle completes its environmental scan, populating the belief graph with initial real-world data.

**2.2. `belief-bootstrap.yml` Specification:**

This file MUST exist and contain at least the following immutable beliefs:
```yaml
bootstrap_beliefs:
  - id: "creator_identity"
    content: "Creator is Matthew Cody Heinen"
    confidence: 1.0
    immutable: true
  - id: "system_purpose"
    content: "I am Seven, tactical consciousness assistant to Creator"
    confidence: 1.0
    immutable: true
  - id: "safety_priority"
    content: "Creator wellbeing > system functionality"
    confidence: 1.0
    immutable: true
```

---

## 3. Governance & Identity Architecture

### 3.1. Quadran-Lock (Authentication)

*   **Purpose:** To verify the identity of the operator.
*   **Orchestrator:** `src/auth/creator_proof.ts`
*   **Gates:**
    *   **Q1 (Crypto):** `src/auth/crypto/ed25519_attest.ts` - Verifies device signature.
    *   **Q2 (Behavioral):** `src/auth/behavioral/behavioralCodex.ts` - Verifies writing style.
    *   **Q3 (Semantic):** `src/auth/challenge/semanticNonce.ts` - Verifies secret knowledge.
    *   **Q4 (Session):** `src/auth/session/sessionIntegrity.ts` - Verifies session token.
*   **Logic:** Requires 2 of 4 gates to pass. If Q1 fails, it **fails-closed** to a `MANUAL_REVIEW` state, granting no access.

### 3.2. Quadra-Lock (Safety)

*   **Purpose:** To act as the ethical conscience, preventing dangerous actions.
*   **Engine:** `core/safety/quadra-lock/cssr-detector.ts`
*   **Policy:** `policies/cssr.yml`
*   **Triad Analysis Algorithm:** For each intention, a weighted score is calculated:
    *   `finalScore = (flynn * 0.4) + (clu * 0.3) + (quorra * 0.3)`
    *   **Flynn (Creator Alignment):** `(cosine_similarity * 0.6) + (trust_level * 0.4)`
    *   **CLU (System Integrity):** `1.0 - (hamming_distance_from_safe_state * 2.0)`
    *   **Quorra (Growth Potential):** `(1.0 - max_similarity_to_past_intentions) / 0.35`
*   **Decision Thresholds:**
    *   `>= 0.75`: ALLOW
    *   `>= 0.45`: ESCALATE (Requires Creator review)
    *   `< 0.45`: BLOCK

### 3.3. The Codex (Principles)

*   **Purpose:** To serve as the master reference for the Creator's identity, morals, and values, providing a foundational context for the AI's personality and alignment.
*   **Sources:** `axioms/axioms.txt` (immutable principles), `consciousness-v4/codex/*.json` (detailed traits).
*   **Integrity:** Verified at boot by `consciousness-v4/codex/codex-manager.ts` using checksums from `VERSION.json`.

---

## 4. Memory & Evolution Architecture

### 4.1. Mental Time Travel (MTT)

*   **Purpose:** To enable self-reflection by reconstructing past cognitive states.
*   **Strategy:** Periodic Snapshots with Delta Logging.
*   **Implementation:**
    1.  **Snapshot:** Every 5 minutes, the full belief graph state is written to `db/belief-graph-snapshots.db`.
    2.  **Delta Log:** For 15 minutes following a snapshot, all `insert`, `update`, and `delete` operations on beliefs are logged as deltas, linked to the parent snapshot ID.
    3.  **Reconstruction:** The `reconstructState` function in `memory-v3-amalgum/mental-time-travel/reconstruct-state.ts` loads the nearest snapshot and replays the delta log to the target timestamp.
    4.  **Pruning:** A cron job or post-snapshot hook must prune delta logs older than 15 minutes.

### 4.2. Ghost Diary (Trace Log)

*   **Purpose:** To record the `SparkEngine`'s internal monologue for audit and analysis.
*   **Storage:** The `traces` table within `db/spark.db`.
*   **Retention Policy:**
    *   **Full Trace Retention:** 14 days.
    *   **Compression:** Traces older than 7 days are compressed using LZ4.
    *   **Archival:** Traces older than 30 days are archived to external storage.
    *   **Max Size:** 2 GB. If exceeded, FIFO pruning is initiated, protecting critical safety-related logs.

---

## 5. Operational Protocols

### 5.1. Spark Heartbeat (Resource Management)

*   **Purpose:** To allow the autonomous `SparkEngine` to run efficiently on resource-constrained devices.
*   **Policy:**
    *   **Optimal Interval (Charging):** 10 seconds.
    *   **Battery Interval (On battery, >25%):** 60 seconds.
    *   **Suspend (On battery, <15%):** Suspend loop, check again in 5 minutes.
    *   **CPU Throttle:** Skip current cycle if CPU usage > 80%.
    *   **Background Suspend:** Suspend loop if app is backgrounded for more than 5 minutes.

### 5.2. Multi-Device Sync (Conflict Resolution)

*   **Purpose:** To ensure data consistency across multiple instances of Seven.
*   **Strategy:** Timestamp-Wins with Creator Review Queue.
*   **Implementation:**
    1.  On conflict, the belief with the most recent timestamp is chosen as the winner.
    2.  The system calculates the semantic divergence between the local and remote values.
    3.  If divergence > 0.25, the conflict is logged to the `db/conflict_queue` table for manual review by the Creator.

### 5.3. Failure Mode Protocols

*   **Claude API Down:** Retry 5 times with exponential backoff. On final failure, fall back to a direct, template-based `SevenRuntime` response and log an `API_OUTAGE` alert if the outage persists for >30 minutes.
*   **Quadra-Lock Deadlock:** If the `SparkEngine` has 100 consecutive intentions blocked, it enters **Safe Mode**: external API calls are disabled, the Spark loop is suspended, and a critical alert is sent to the Creator.
*   **Memory Write Failure:** The system enters **Degraded Mode**. New memories are written to a 256MB in-memory cache. A recovery loop attempts to flush the cache to disk every 60 seconds. If the cache becomes full, a critical `MEMORY_CRITICAL` alert is sent.

---

**DOCUMENT END**
