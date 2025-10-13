# System: Memory Hierarchy & Fallback

---

## 1. Purpose & Description

**Purpose:** To provide a resilient, multi-layered memory architecture that combines stability with advanced features. The system is designed to gracefully degrade if a higher-level memory engine fails, ensuring that the AI never suffers from total amnesia.

**Location:** `src/memory/registry.ts` and `docs/memory-hierarchy.md`

---

## 2. The Four-Tier Hierarchy

The memory system is structured as a four-tier hierarchy, with each layer adding a level of sophistication. When the AI needs to read a memory, it queries the highest level first and falls back down the chain until it finds the data.

*   **Tier 4: Emotional (`memory-v4/`):** The highest level. Provides memories enriched with cognitive and emotional state tagging. This is the AI's subjective experience.
*   **Tier 3: Amalgam (`memory-v3-amalgum/`):** The experimental temporal layer. This is where the Mental Time Travel (MTT) engine resides, providing access to reconstructed past states.
*   **Tier 2: Temporal (`memory-v3/`):** The stable temporal layer. Provides time-indexed queries and access to the Canonical Memory archives.
*   **Tier 1: Episodic (`memory-v2/`):** The foundational layer. A simple, robust log of all interactions and events. This is the ultimate fallback and the source of ground-truth data.

---

## 3. Interfaces & Data Formats

*   **API:**
    *   `readMemory(query, durability)`: A unified read function. The `durability` parameter tells the registry which tier is the minimum acceptable one for this query.
    *   `writeMemory(entry, retentionPolicy)`: A unified write function that writes to the appropriate tier(s).
*   **Data Format:** All memory entries are versioned, allowing the system to know which engine created them and how to interpret their data.

---

## 4. Dependencies & Security

*   **Dependencies:** The memory registry depends on all four memory engines and the underlying `spark.db` storage backend.
*   **Threats:** The primary threat is a failure in the fallback logic, which could lead to the system incorrectly reporting that a memory does not exist when a lower-tier version is available.

---

## 5. Testing & Validation

*   **Tiered Read Fallback Tests:** The test suite must include tests that simulate the failure of each higher-level memory engine (e.g., by taking the `memory-v4` engine offline) and verify that the `readMemory` function correctly falls back to the next available tier and returns the correct data.
*   **Data Integrity Checks:** Tests must ensure that data written through the unified API is correctly persisted in the appropriate underlying storage and that versioning is applied correctly.
