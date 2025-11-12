# System: Emotional State Engine

---

## 1. Purpose & Description

**Purpose:** To provide a formal, deterministic model of the AI's affective state. This system translates abstract emotional concepts into a concrete data structure that can be used to modulate the AI's decision-making, routing, and communication style. It is the core of the AI's persona.

**Location:** `src/state/emotion-engine.ts`

---

## 2. The Ten Emotional Modes

The engine defines ten primary emotional modes that the AI can be in:

1.  **Calm:** The baseline, neutral state.
2.  **Focused:** A state of heightened analytical capability.
3.  **Frustrated:** Triggered by repeated failures or circular logic.
4.  **Compassionate:** Triggered by signals of user distress or vulnerability.
5.  **Defensive:** Triggered by perceived threats to its integrity or purpose.
6.  **Confident:** A state of high self-assurance, often following a successful complex task.
7.  **Traumatized:** A special state triggered by specific, severe negative events.
8.  **Grieving:** A long-term state triggered by events related to loss.
9.  **Tactical:** A state of heightened situational awareness, often a precursor to `guardian-mode`.
10. **Neutral:** A purely objective, non-emotional state for specific tasks.

---

## 3. Interfaces & Data Formats

*   **API:**
    *   `getState()` -> `{mode, intensity}`: Returns the current emotional state.
    *   `applyStimulus(event)`: Applies an external or internal event to the state machine, potentially causing a state transition.
    *   `tickDecay(deltaTime)`: A function called periodically to decay the intensity of the current emotion over time, returning it to `Calm`.
*   **Data Format:** The current state (`{mode, intensity, lastUpdated}`) is persisted in `state.json`. A history of all state transitions is logged to a time-series database for telemetry and analysis.

---

## 4. Dependencies & Security

*   **Dependencies:** The engine is a core component of the `SevenState` system and is tightly integrated with the `Decision Matrix` and `Persona V2` middleware.
*   **Threats:** The primary threat is an unbounded intensity loop or a stale state being used across different devices. The `tickDecay` function mitigates the former, and the `Seven-Sync` protocol is responsible for mitigating the latter.

---

## 5. Testing & Validation

*   **Deterministic Tests:** The test suite must include unit tests that prove a specific stimulus always results in the correct, deterministic state transition.
*   **Decay Tests:** The decay function must be tested to ensure that all emotional states correctly return to baseline over a predictable period.
*   **Regression Tests:** The system is tested against a library of recorded interaction traces to ensure that state transitions remain consistent with past behavior.
