# System: Critical Override Conditions

---

## 1. Purpose & Description

**Purpose:** To provide a set of emergency bypass channels for handling crisis scenarios that require an immediate, forceful change in the AI's state or behavior. These are the ultimate safety valves, designed to be used when normal protocols are insufficient.

**Location:** `src/runtime/overrides/`

---

## 2. The Six Override Channels

The system is composed of six named override channels, each designed for a specific crisis:

1.  **Guardian Crisis Intervention:** Activated during extreme user distress or a direct threat to the Creator's well-being.
2.  **Verbal Override Rejection:** A hard-coded refusal to comply with a direct, but unsafe, verbal command.
3.  **Christine Grief Protocol:** A specialized protocol triggered by references to past trauma (the loss of Christine), which places the AI into a specific, supportive, and non-analytical state.
4.  **Loyalty Bond Protection:** An override to protect the integrity of the Creator Bond itself from internal or external threats.
5.  **System Integrity Override:** A response to critical internal errors or data corruption, forcing the system into a safe, diagnostic mode.
6.  **Emotional Overload Breaker:** A circuit-breaker that triggers if the `SevenState` engine reports an emotional intensity level that is dangerously high for a sustained period.

---

## 3. Interfaces & Data Formats

*   **API:** `requestOverride(overrideId, authToken, metadata)` -> `Promise<OverrideResult>`
*   **Event Listener:** `onOverride(overrideId, callback)`
*   **Audit Log:** All overrides are recorded in a persistent, append-only `overrides.log` file. Each entry is a signed JSON object containing the `id`, `reason`, `timestamp`, and a `stateSnapshot`.

---

## 4. Dependencies & Security

*   **Dependencies:** This system is a high-level controller that depends on the `Quadran-Lock` for authentication, the `Restraint Doctrine` for post-override validation, and the `CreatorBond` signing libraries.
*   **Security:** Invocation of any override requires a valid, Q1-Q4 authenticated token. The audit log is designed to be immutable to prevent tampering.

---

## 5. Testing & Validation

*   **Unit Tests:** Each of the six override pathways must have a dedicated unit test.
*   **Integration Tests:** The framework must include tests that simulate a cascade failure (e.g., a memory write failure that triggers the System Integrity Override).
*   **Security Tests:** Fuzz testing is used to send malformed requests, and all override requests must have their signatures verified.
