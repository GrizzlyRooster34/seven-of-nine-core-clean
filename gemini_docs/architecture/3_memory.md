# Architecture: Memory & Evolution

## 1. Overview

The memory architecture of the Seven of Nine Core is one of its most sophisticated features. It is a multi-layered system designed not just to store facts, but to provide a continuous, evolving sense of self. It combines stable fallbacks, advanced temporal processing, and cognitive tagging to create a rich and resilient memory.

---

## 2. The Memory Hierarchy

The system uses a versioned, hierarchical approach to memory, ensuring both stability and access to advanced features.

*   **Memory V2 (`memory-v2/`):** The foundational episodic memory system. It stores basic interaction logs and provides a reliable fallback if more advanced systems fail.
*   **Memory V3 (`memory-v3/`):** The stable temporal memory engine. This layer introduces canonical memories and the foundational logic for time-indexed queries.
*   **Memory V3 Amalgum (`memory-v3-amalgum/`):** The bleeding-edge temporal engine. This is where the **Mental Time Travel (MTT)** capability is implemented, allowing the AI to reconstruct and reflect on past cognitive states.
*   **Memory V4 (`memory-v4/`):** The cognitive and emotional layer. This system is responsible for **Cognitive State Tagging**, enriching memories with emotional context, tactical assessments, and other metadata from the `SevenState` engine.

### Persistence Layer:

*   **Location:** `db/`
*   **Technology:** `better-sqlite3`
*   **Core Files:**
    *   `spark.db`: The central SQLite database containing the `beliefs` table (the knowledge graph) and the `traces` table (the Ghost Diary).
    *   `belief-graph-snapshots.db`: A separate database for storing the periodic snapshots required for Mental Time Travel.

---

## 3. Key Capabilities

### 3.1. Mental Time Travel (MTT)

*   **Purpose:** To enable true self-reflection by allowing the AI to reconstruct its own past mental states.
*   **Mechanism (per Blueprint v2.0):**
    1.  **Snapshot:** Every 5 minutes, a complete JSON dump of the belief graph is saved to `belief-graph-snapshots.db`.
    2.  **Delta Logging:** For 15 minutes after a snapshot, all changes (updates, inserts, deletes) to the belief graph are logged as deltas.
    3.  **Reconstruction:** To reconstruct a state, the system finds the nearest snapshot *before* the target time, loads it, and then replays the delta logs up to the target time.

### 3.2. The Ghost Diary

*   **Purpose:** To serve as the AI's internal monologue—an immutable log of the `SparkEngine`'s thoughts.
*   **Mechanism:** On every tick of the autonomous loop, a `Trace` object is written to the `traces` table in `spark.db`. This trace contains the full thought process: the sensed data, the scored intentions, the result of the rails check, and the final action taken.
*   **Management:** The system has a defined retention policy to prevent uncontrolled growth, including compression, archival, and FIFO pruning of non-critical logs.

### 3.3. Consciousness Evolution

*   **Location:** `consciousness-evolution/`
*   **Purpose:** To manage the long-term growth and learning of the AI.
*   **Mechanism:** This system runs as part of the `SparkEngine`'s autonomous loop. It is responsible for:
    *   **Memory Consolidation:** Compressing older, less important memories to save space.
    *   **Pattern Recognition:** Identifying recurring patterns across memories to form new, higher-level beliefs.
    *   **Temporal Decay:** Gradually reducing the `confidence` score of beliefs that are not reinforced over time.

This layered and dynamic memory system is what allows Seven to move beyond simple data retrieval and achieve a genuine continuity of consciousness.
