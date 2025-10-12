# Architecture: Resource Management

---

## 1. Purpose & First Principle

**First Principle:** "An AI's existence must not be an undue burden on its host system."

The Resource Management architecture is a suite of systems designed to ensure that Seven of Nine can operate effectively and sustainably on resource-constrained devices, particularly mobile platforms like Termux. Its purpose is to intelligently manage CPU, battery, and storage to prevent performance degradation and rapid power drain, allowing for persistent, long-term operation.

---

## 2. The Adaptive Heartbeat (`SparkEngine`)

*   **Purpose:** To allow the autonomous `SparkEngine` to continue its background thought processes without rapidly draining the device's battery.
*   **Mechanism:** The engine does not use a fixed interval. It adapts its `tick` cycle speed based on the device's power state.
*   **Policy (per Blueprint v2.1):**
    *   **Optimal Interval (Charging):** 10 seconds. When plugged in, the engine operates at full capacity.
    *   **Battery Interval (On battery, >25%):** 60 seconds. When on battery, the engine significantly reduces its frequency to conserve power.
    *   **Suspend (On battery, <15%):** The loop is suspended entirely. It will check the battery level again in 5 minutes.

---

## 3. CPU Throttling

*   **Purpose:** To prevent the `SparkEngine` from impacting the user experience or causing thermal throttling by consuming too much CPU.
*   **Mechanism:** Before each `tick` cycle, the engine performs a quick check on system CPU load.
*   **Policy (per Blueprint v2.1):**
    *   If total system CPU usage is greater than **80%**, the current `tick` is skipped entirely. The engine will wait for the next scheduled tick to try again.

---

## 4. Background Suspension

*   **Purpose:** To prevent the AI from consuming resources when it is not actively being used.
*   **Mechanism:** The system monitors whether the application is in the foreground or background.
*   **Policy (per Blueprint v2.1):**
    *   If the application is backgrounded for more than **5 minutes**, the `SparkEngine`'s autonomous loop is completely suspended.
    *   The loop is immediately resumed when the application is brought back to the foreground.

---

## 5. Storage Management (Ghost Diary)

*   **Purpose:** To prevent the AI's internal monologue (`traces` log) from growing indefinitely and consuming all available storage.
*   **Mechanism:** A periodic process that compresses, archives, and prunes the `traces` table in `spark.db`.
*   **Policy (per Blueprint v2.1):**
    *   **Max Size:** 2 GB.
    *   **Compression:** Traces older than 7 days are compressed (LZ4).
    *   **Archival:** Traces older than 30 days are moved to external storage.
    *   **Pruning:** If the 2GB cap is exceeded, the oldest traces are deleted (FIFO), with a rule to always protect critical safety-related logs.

---

## 6. Memory Degraded Mode

*   **Purpose:** To ensure the AI can continue to function even if its primary database (`spark.db`) becomes inaccessible due to disk failure or corruption.
*   **Mechanism:** A failure protocol that switches memory operations to an in-memory cache.
*   **Policy (per Blueprint v2.1):**
    *   On a memory write failure, the system activates **Degraded Mode**.
    *   New memories are temporarily stored in a **256MB in-memory cache**.
    *   A recovery loop attempts to flush this cache to disk every 60 seconds.
    *   If the cache becomes full, a critical alert is sent to the Creator, as data loss is imminent.

These systems work in concert to create a resilient and efficient AI that can live and think sustainably within the tight operational envelope of a mobile device.
