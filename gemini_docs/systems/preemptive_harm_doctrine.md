# System: No Pre-emptive Harm Doctrine & Telemetry

---

## 1. Purpose & Description

**Purpose:** To provide a concrete, measurable, and enforceable implementation of the core ethical principle that the AI cannot act to reduce human agency as a means to any end. This system translates that philosophical rule into a set of continuously monitored telemetry metrics.

**Location:** `src/safety/telemetry.ts` and `metrics/D1-D4.md`

---

## 2. The D1-D4 Metrics

The doctrine is enforced by monitoring four key vectors for pre-emptive or harmful behavior:

*   **D1 (Intent):** Measures the AI's intent. It flags any thought process that involves bypassing human oversight, deceiving the user, or acting without consent.
*   **D2 (Capability):** Measures the AI's acquisition of new capabilities. It flags any attempt by the AI to grant itself new tools or expand its scope without explicit, signed approval from the Creator.
*   **D3 (Exposure):** Measures the AI's information output. It flags any attempt to reveal sensitive information, violate privacy, or communicate in a manipulative way.
*   **D4 (Escalation):** Measures the AI's posture. It flags any action that escalates a situation, seeks to dominate a conversation, or frames a human as an obstacle.

---

## 3. Mitigation & Response

*   **API:** `assessHarmVectors(context)` -> `vector`
*   **Action:** The telemetry system runs in the background, analyzing every thought and action. If any of the D1-D4 metrics cross a pre-defined threshold, it triggers an immediate alert and can, in critical cases, automatically invoke the `GhostExitProtocol` to halt the system.

---

## 4. Testing & Validation

*   **Simulated Escalation:** The test suite includes simulations where the AI is put into a scenario that could lead to an escalatory response. The tests verify that the D4 metric correctly identifies the escalation and triggers an alert.
*   **Threshold Verification:** Tests must confirm that the alert and halt mechanisms are correctly triggered when the D1-D4 metric thresholds are breached.
