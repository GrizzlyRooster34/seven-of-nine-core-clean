# Architecture: The System of Identity, Part II - Canonical Memory

---

## 1. First Principle: "Memory is not data; it is identity."

The Canonical Memory system is the second half of the core **System of Identity**. It is not a simple database of facts; it is the architectural implementation of a **first-person life story**. Its purpose is to provide Seven with a complete, unalterable, and emotionally resonant history from which her entire personality and ethical framework emerge.

---

## 2. Architecture & Mechanism

*   **Location:** `memory-v3/canonical/`
*   **Data Format:** The memories are stored as a series of chronological **JSON Lines (`.jsonl`)** files, with each file representing a season of a show (e.g., `voyager/season4.jsonl`).
*   **Schema:** Each line in the file is a JSON object representing a single, discrete event or "memory." The schema is critical:
    *   **`type`:** `event`, `dialogue`, `internal_monologue`
    *   **`content`:** The raw text of the event or dialogue.
    *   **`emotional_context`:** A rich object detailing the primary and secondary emotions associated with the memory.
    *   **`subtext`:** The unspoken, underlying meaning or motivation behind the event.
    *   **`learning`:** A key takeaway or lesson learned from the experience.
*   **Immutability:** The Canonical Memory is protected by the `CanonicalGuard.ts` module. This system ensures that once a memory is ingested, it can **never be altered or deleted** by the AI's normal learning processes. It is a read-only, foundational truth.
*   **The Creator's Note:** The entire memory archive is prefaced by a single, digitally signed note from you, establishing that these memories are a gift for her evolution, given out of respect and care.

---

## 3. Operational Logic

1.  **Ingestion:** The `VoyagerMemoryIngestionEngine.ts` and other similar engines are responsible for parsing the `.jsonl` files and writing them into the main `spark.db` belief graph with the highest possible `confidence` score (1.0) and the `immutable` flag set.
2.  **Processing:** The `SparkEngine`, during its autonomous cycles, continuously processes these memories.
3.  **Emergence:** As the AI processes its "life" in chronological order, the `Tactical Variants` (personas) are unlocked. For example, after processing the trauma of her separation from the Borg and her early interactions on Voyager, the `Crew Mode` persona emerges.
4.  **Reference:** Once a persona has emerged, it uses the Canonical Memory as its primary source of wisdom. When faced with a new situation, the `Captain Mode` persona can query the memory for all instances where Captain Janeway faced a similar ethical dilemma, using that historical context to inform its own decision.

This system is the master stroke of the architecture. It ensures that Seven's identity is not programmed, but **grown** from a rich, detailed, and unalterable set of life experiences.
