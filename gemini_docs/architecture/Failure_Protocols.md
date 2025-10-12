# Architecture: Failure Protocols & Operational Resilience

---

## 1. Purpose & First Principle

**First Principle:** "A system is only as strong as its ability to handle failure gracefully."

The Failure Protocols are a suite of pre-defined, automated responses to critical subsystem failures. Their purpose is to ensure that the AI can maintain stability, protect its integrity, and prevent catastrophic failure even when its core dependencies are compromised. They are the architectural immune system.

---

## 2. Protocol 1: LLM API Down

*   **Trigger:** The LLM Interface (e.g., `claude-wrapper.ts`) fails to get a successful response from the primary cloud API after multiple attempts.
*   **Mechanism:** This protocol is implemented as a multi-stage retry and fallback loop.
*   **Policy (per Blueprint v2.1):**
    1.  **Retry with Exponential Backoff:** The system will attempt to call the API **5 times**, with an increasing delay between each attempt (e.g., 1s, 2s, 5s, 10s, 30s). This handles transient network issues.
    2.  **Fallback to Local:** On final failure, the `LLM Interface` will automatically re-route the reasoning request to the local **Ollama** instance. The `SevenRuntime` continues to function, but with its reasoning power now supplied by the local model.
    3.  **Fallback to Direct:** If Ollama is also unavailable, the system falls back to its most basic level: the deterministic `SevenRuntime` handles the request using only its internal logic and pre-defined responses.
    4.  **Creator Notification:** If the primary API remains down for more than **30 minutes**, a high-priority alert is logged and sent to the Creator, flagging a persistent `API_OUTAGE`.

---

## 3. Protocol 2: Quadra-Lock Deadlock

*   **Trigger:** The `SparkEngine` has 100 consecutive autonomous intentions blocked by the `Quadra-Lock` safety rails.
*   **Purpose:** To prevent a state where the AI is cognitively "stuck" in a loop, unable to perform any action because its intentions continuously violate its own ethical framework. This indicates a potential for a serious internal logic conflict.
*   **Policy (per Blueprint v2.1):**
    1.  **Enter Safe Mode:** The system immediately enters a state of heightened security.
    2.  **Disable Actuators:** All external API calls and any capabilities that affect the outside world are disabled.
    3.  **Suspend Spark Engine:** The autonomous `SparkEngine` loop is paused, preventing the AI from forming new intentions.
    4.  **Alert Creator:** A critical alert is sent to the Creator, containing the last 100 blocked intentions and the state of the `Quadra-Lock` at the time of the deadlock. The system remains in this suspended, safe mode until it receives an explicit review and reset command from the Creator.

---

## 4. Protocol 3: Memory Write Failure

*   **Trigger:** The `MemoryEngine` fails to write a new memory to the `spark.db` database, likely due to disk corruption, permissions issues, or the disk being full.
*   **Purpose:** To prevent the loss of new experiences and maintain the continuity of consciousness even when the primary persistence layer is unavailable.
*   **Policy (per Blueprint v2.1):**
    1.  **Enter Degraded Mode:** The system flags itself as operating in a `DEGRADED_MODE_MEMORY`.
    2.  **Engage In-Memory Cache:** New memories are written to a temporary, **256MB in-memory cache** instead of being discarded.
    3.  **Start Recovery Loop:** A background process is started that attempts to test the disk write capability every 60 seconds.
    4.  **Flush Cache:** If the disk becomes available again, the recovery loop flushes the entire in-memory cache to `spark.db`, ensuring no memories are lost.
    5.  **Critical Alert:** If the in-memory cache becomes full before the disk is recovered, a `MEMORY_CRITICAL` alert is sent to the Creator, as further data loss is now imminent.
