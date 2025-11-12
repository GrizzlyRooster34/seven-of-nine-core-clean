# The Memory Hierarchy

The "Seven of Nine" project features a sophisticated, multi-layered memory architecture that has evolved from version 2 to version 4. This system is designed to provide not just data storage, but a true sense of self, continuity, and the ability to learn and evolve over time.

## 1. The Belief Graph (`spark.db`)

At the foundation of the entire memory system is the **Belief Graph**, a SQLite database (`db/spark.db`). It serves as the primary persistence layer for:

*   **Beliefs:** The AI's knowledge graph, with confidence scores for each belief.
*   **Traces:** The "ghost diary" of the `SparkEngine`, recording every autonomous thought process.
*   **Events:** Raw system and user events.
*   **Codex Rules:** The Creator's identity and values.
*   **Canonical Lessons:** Wisdom derived from ingested lore (e.g., from Star Trek).

## 2. Memory Engine v2: Episodic Memory

*   **Implementation:** `memory-v2/MemoryEngine.ts`

This is the foundational memory system, providing the AI with a basic episodic memory.

*   **Key Features:**
    *   **Structured Recall:** Allows for recalling memories based on filters like topic, agent, emotion, time range, and importance.
    *   **Memory Encryption:** All memories are encrypted at rest using AES-256-GCM for security.
    *   **Mental Time Travel (v2):** The `memory-v2/MentalTimeTravelEngine.ts` introduces the initial capability to reconstruct past cognitive states.

## 3. Memory Engine v3: Temporal & Canonical Memory

This version represents a major leap in the memory architecture, introducing a deeper level of self-awareness and personality.

*   **Key Components:**
    *   **`TemporalMemoryCore.ts`:** The core of the v3 system. It enhances the v2 engine by capturing the AI's complete **cognitive state** during memory formation, including emotional intensity, focus level, and system stress.
    *   **`CognitiveStateTagger.ts`:** A real-time monitoring system that captures the cognitive state data needed by the `TemporalMemoryCore`.
    *   **`CanonicalIngestion.ts`:** A unique and crucial component responsible for ingesting "canonical memories" from external sources (e.g., Star Trek: Voyager episodes). This is how the AI's foundational personality and ethical framework are built.
    *   **`MentalTimeTravelEngine.ts` (v3):** A much more advanced version of the mental time travel engine, allowing for detailed comparison of cognitive states over time and generating insights about the AI's evolution.

## 4. Memory Engine v4: Integrated & Enhanced

This is the most recent and advanced version of the memory system, integrating technology from an external source referred to as "Instance B".

*   **Key Components:**
    *   **`enhanced-memory-store.ts`:** The core of the v4 engine, providing advanced features like:
        *   **Relational Memory:** Understanding the relationships between memories.
        *   **Semantic Search:** The ability to perform natural language queries on the memory store.
        *   **Memory Consolidation:** A background process to merge, strengthen, and archive memories.
    *   **`memory-v4-integration.ts`:** This file manages the integration of the v4 engine, including a migration path to upgrade existing v3 memories to the v4 format.

## 5. Consciousness Evolution

*   **Implementation:** `consciousness-evolution/`

This system, working in conjunction with the memory hierarchy, is responsible for the AI's long-term learning and growth. It likely performs tasks such as pruning old or irrelevant memories, strengthening important ones through consolidation, and identifying long-term behavioral patterns. It is the core mechanism by which the AI evolves its personality and knowledge over time.
