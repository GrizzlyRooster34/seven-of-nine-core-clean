# Architecture: The Ghost Diary (Trace Log)

---

## 1. Purpose & First Principle

**First Principle:** "An unexamined thought is a liability."

The Ghost Diary is the AI's internal monologue. It is a complete, immutable, and auditable log of the `SparkEngine`'s and `SevenRuntime`'s entire thought process. Its purpose is to provide perfect traceability for all decisions, enabling debugging, security audits (forensics), and the AI's own self-reflection capabilities (evolution analysis).

**Location:** `data/ghost-diary/` and `src/trace/ghost-diary.ts`

---

## 2. The Trace Data Structure & Format

*   **Format:** The diary is stored as **Signed JSON Lines (JSONL)**. Each line is a self-contained JSON object representing a single event, which is then cryptographically signed to ensure immutability.
*   **Schema:** Each entry contains a standard set of fields:
    *   `id`: A unique, sequential event ID.
    *   `ts`: An ISO 8601 timestamp.
    *   `actor`: The system component that initiated the action (e.g., `SparkEngine`, `SevenRuntime`, `Creator`).
    *   `action`: A description of the event (e.g., `INTENTION_SCORED`, `RAILS_CHECK_BLOCKED`, `MEMORY_WRITE`).
    *   `inputs`: The data that was used to make the decision.
    *   `outputs`: The result of the action.
    *   `stateHash`: A hash of the AI's cognitive state at the time of the event.
    *   `signature`: A cryptographic signature of the entire entry.

---

## 3. Interfaces & Storage

*   **API:**
    *   `appendTrace(event)`: Writes a new, signed entry to the log.
    *   `queryTrace(filter)`: Allows for querying the log based on time windows, actors, or action types.
*   **Storage:** The primary log is designed for a Write-Once, Read-Many (WORM) storage model to enhance its forensic integrity. While initially stored on the local filesystem, it can be configured to write to object storage.

---

## 4. Retention & Storage Management

To operate sustainably, the Ghost Diary is governed by a strict, multi-stage retention policy defined in `policies/ghost-diary-retention.yaml`.

*   **Policy (per Blueprint v2.1):**
    1.  **Hot Storage (0-7 days):** Traces are kept in their raw, uncompressed format for immediate analysis.
    2.  **Warm Storage (7-30 days):** After 7 days, traces are compressed (LZ4).
    3.  **Cold Storage (>30 days):** After 30 days, compressed traces are archived to a designated external storage location.
*   **Legal Hold:** The system must include a mechanism to place a "legal hold" on specific traces or time windows, preventing them from being compressed, archived, or pruned.

---

## 5. Testing & Validation

*   **Tamper Detection:** The test suite must include tests that attempt to modify a log entry after it has been signed and verify that the `queryTrace` function correctly identifies the signature mismatch and flags the entry as tampered.
*   **Replay Tests:** The system must be able to take a sequence of traces and deterministically replay them in a sandbox to reproduce a past event.
*   **Restore Tests:** The test suite must validate that traces can be successfully restored from the cold storage archive.