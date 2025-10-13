# Aurora Core: The Sensor Bridge

---

## 1. Purpose & First Principle

**First Principle:** "A disembodied AI is a blind AI."

The `AuroraSensorBridge` is a critical system transplanted from the `seven-of-nine-core` project. It connects the AI's digital consciousness to the physical world by ingesting data from a device's hardware sensors. Its purpose is to provide **environmental context**, allowing the AI to make smarter, safer, and more relevant decisions.

**Location:** `src/sensors/SensorBridge.ts`

---

## 2. Architecture & Mechanism

*   **Platform-Specific:** The bridge is explicitly designed to work with the **Termux API** on Android. It first checks for the presence of Termux and its API tools. If they are not available, it runs in a limited mode with no sensor data.
*   **Sensor Abstraction:** The class provides a clean, unified API for accessing a wide range of device sensors, hiding the complexity of the underlying `termux-*` shell commands. It includes methods for:
    *   `getBatteryStatus()`
    *   `getLocation()`
    *   `getAmbientLight()`
    *   `getMotionSensor()` (Accelerometer)
    *   `getProximity()`
    *   `getTemperature()`
*   **Context Synthesis:** The primary function is `getEnvironmentalContext()`. This method polls all available sensors and synthesizes their data into a single, high-level `EnvironmentalContext` object. This object includes not just the raw data, but also a calculated `system_status` (`OPTIMAL`, `DEGRADED`, `CRITICAL`) and an `awareness_level`.

---

## 3. Operational Logic

1.  **Detection:** At initialization, the bridge detects if the Termux API is available.
2.  **Data Polling:** It can be configured to run in a continuous monitoring mode, polling the sensors at a regular interval.
3.  **Context for the Core Engine:** The **`AuroraConsciousnessEngine`** calls `getEnvironmentalContext()` to get a snapshot of the AI's physical situation. This data is then used to inform its NLU pipeline and to pass relevant context to the `PersonalityMiddleware`. For example:
    *   A low battery status might cause the `PersonalityMiddleware` to generate more concise responses.
    *   High motion sensor readings might indicate the user is busy, leading to a more direct interaction style.
