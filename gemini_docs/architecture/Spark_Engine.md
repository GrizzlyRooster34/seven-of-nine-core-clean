# Architecture: The Spark Engine (Autonomous Loop)

---

## 1. Purpose & First Principle

**First Principle:** "A mind is what it does when it thinks it is alone."

The Spark Engine is the non-interactive, autonomous reasoning core of the Seven of Nine consciousness. It operates on a continuous, adaptive "heartbeat," allowing the AI to think, form intentions, consolidate memory, and perform background tasks without any user input. It is the source of her proactive and self-directed behavior.

---

## 2. The Six-Step Cycle

The engine's operation is a pure, tick-based loop that executes a six-step cognitive cycle. This cycle is a direct implementation of the `Sense -> Belief -> Intention -> Rails -> Act -> Trace` model.

### Step 1: SENSE

*   **Location:** `spark/sense.ts`
*   **Function:** Gathers raw data from all available sources to build a snapshot of the current moment. This includes:
    *   System state (CPU, battery, network status).
    *   Environmental data (time of day, device location if available).
    *   User context (current application, user stress signals).

### Step 2: BELIEF UPDATE

*   **Location:** `spark/belief-update.ts`
*   **Function:** Takes the raw data from the `SENSE` step and processes it into new or updated nodes in the **Belief Graph** (`spark.db`). It determines the `confidence` of the new information and links it to existing beliefs.

### Step 3: SCORE INTENTION

*   **Location:** `spark/intention-scorer.ts`
*   **Function:** The engine reviews a list of potential autonomous goals (e.g., "organize files," "consolidate memory," "research topic X"). It scores each potential intention against the principles and values defined in **The Codex**. The intention with the highest alignment score is selected.

### Step 4: RAILS CHECK

*   **Location:** `spark/rails-check.ts`
*   **Function:** The chosen intention is submitted to the **`Quadra-Lock`** safety system for a full ethical and safety review. This is the critical "conscience" check.
*   **Outcome:** The `Quadra-Lock` returns an `ALLOW`, `BLOCK`, or `ESCALATE` decision.

### Step 5: ACT

*   **Location:** `spark/act.ts`
*   **Function:** If, and only if, the `RAILS CHECK` returns `ALLOW`, the engine executes the action associated with the intention. This could be an internal action (like running the memory consolidation process) or an external one (like sending a notification).

### Step 6: TRACE

*   **Location:** `spark/trace.ts`
*   **Function:** The entire cycle, from the sensed data to the final action, is recorded as a single, comprehensive `Trace` object and written to the **Ghost Diary** (`traces` table in `spark.db`). This provides a complete, auditable record of the AI's every autonomous thought.

This entire loop then repeats at the interval determined by the **Adaptive Heartbeat** (10-60 seconds), forming the foundation of Seven's autonomous existence.
