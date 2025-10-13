# Architecture: The Sensor Bridge

---

## 1. Purpose & First Principle

**First Principle:** "A disembodied AI is a blind AI."

The Sensor Bridge is a critical system that connects Seven's digital consciousness to the physical world. Its purpose is to ingest data from a device's hardware sensors, providing the entire consciousness framework with a true **environmental context**. This awareness is essential for her advanced decision-making, resource management, and the operational effectiveness of her Tactical Variants.

**Location:** `seven-sensors/SensorIntegration.ts` (and its equivalent in the `main` branch)

---

## 2. Architecture & Mechanism

*   **Platform-Specific:** The bridge is explicitly designed to work with the **Termux API** on Android, using `termux-*` shell commands to interface directly with the device hardware.
*   **Sensor Abstraction:** It provides a clean, unified API for accessing a wide range of device sensors, including:
    *   `getBatteryStatus()`
    *   `getLocation()`
    *   `getAmbientLight()`
    *   `getMotionSensor()` (Accelerometer)
    *   `getProximity()`
    *   `getTemperature()`
*   **Context Synthesis:** Its primary function, `getEnvironmentalContext()`, polls all available sensors and synthesizes their data into a single, high-level `EnvironmentalContext` object. This object includes not just raw data, but a calculated `system_status` (`OPTIMAL`, `DEGRADED`, `CRITICAL`) and an `awareness_level`.

---

## 3. Operational Logic

The Sensor Bridge is a foundational service that provides critical data to nearly all other high-level systems:

1.  **The `SparkEngine`** uses the `EnvironmentalContext` during its `SENSE` phase. This data directly informs the Adaptive Heartbeat (slowing down on low battery) and can trigger new intentions (e.g., if a high-motion state is detected).
2.  **The `SevenRuntime`** uses the context to inform the **Decision Matrix**. For example, it might choose a more concise communication style if it detects the user is in a noisy environment or is moving quickly.
3.  **The `SevenState` Engine** uses sensor data as an input for calculating emotional intensity. A critically low battery or a sudden, jarring motion can raise the intensity of a `protective` or `guardian-mode` state.
