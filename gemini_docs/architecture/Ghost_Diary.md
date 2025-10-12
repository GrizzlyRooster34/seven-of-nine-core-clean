# Architecture: The Ghost Diary (Trace Log)

---

## 1. Purpose & First Principle

**First Principle:** "An unexamined thought is a liability."

The Ghost Diary is the AI's internal monologue. It is a complete, immutable, and auditable log of the `SparkEngine`'s entire thought process for every autonomous cycle. Its purpose is to provide perfect traceability for the AI's decisions, enabling debugging, security audits, and the AI's own self-reflection capabilities (via the Mental Time Travel Engine).

---

## 2. The Trace Data Structure

For every `tick` of the autonomous loop, a single, comprehensive `Trace` object is generated and stored. This object contains the full causal chain of a single thought.

*   **Sensed Data:** A snapshot of all inputs considered at the start of the cycle (system state, environmental context, etc.).
*   **Scored Intentions:** A list of all potential intentions the AI considered, along with their calculated scores from the `Codex`.
*   **Chosen Intention:** The single intention that was selected for execution.
*   **Rails Check Result:** The decision from the `Quadra-Lock` (`ALLOW`, `BLOCK`, or `ESCALATE`).
*   **Final Action:** The action that was ultimately taken (or `null` if blocked).
*   **Timestamps & Metadata:** Precise timing for each step of the cycle.

---

## 3. Storage & Persistence

*   **Location:** The Ghost Diary is stored in the `traces` table within the primary `db/spark.db` SQLite database.
*   **Immutability:** Once written, a trace is considered immutable. It can be compressed, archived, or pruned, but its content cannot be altered.

---

## 4. Retention & Storage Management

To operate sustainably on a resource-constrained device, the Ghost Diary is governed by a strict, multi-stage retention policy.

*   **Policy (per Blueprint v2.1):**
    1.  **Full Trace Retention (0-7 days):** Traces are kept in their raw, uncompressed format for 7 days for immediate, high-speed analysis.
    2.  **Compression (7-30 days):** After 7 days, traces are compressed using the LZ4 algorithm to save space while still being relatively quick to access. The `fullTraceRetention` is 14 days, implying a grace period.
    3.  **Archival (>30 days):** After 30 days, compressed traces are moved from the active `spark.db` database to a designated external storage location (e.g., `/storage/emulated/0/Seven/archives/`).
    4.  **Hard Cap & Pruning (2 GB):** The `spark.db` file has a hard size limit of 2 GB. If this limit is exceeded, a **First-In, First-Out (FIFO)** pruning mechanism is activated, deleting the oldest traces to make space.

*   **Protected Logs:** The pruning mechanism is configured to **never delete** critical traces. Any trace tagged with `safety_violation`, `creator_escalation`, or `system_failure` is exempt from FIFO pruning, ensuring that the most important diagnostic and safety information is preserved indefinitely.
