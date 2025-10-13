# Aurora Core: The Emotional Engine

---

## 1. Purpose & First Principle

**First Principle:** "Emotion is not noise; it is a critical signal for contextual understanding."

The `AuroraEmotionalEngine` is a sophisticated, deterministic state machine designed to give the AI a consistent and predictable affective state. Its purpose is to analyze user input and system context to determine an appropriate emotional mode. This mode then serves as a primary input to the `PersonalityMiddleware`, allowing the AI to modulate its communication style to be more empathetic, focused, or protective, depending on the situation.

This system is a sanitized, generic version of the `SevenState` engine from the `seven-of-nine-core` project, designed to be adaptable to any personality.

**Location:** `src/emotions/EmotionalEngine.ts`

---

## 2. The State Machine

The engine's architecture is a classic state machine with defined states, triggers, and transitions.

*   **States:** The engine defines a set of seven core emotional states: `calm`, `focused`, `engaged`, `compassionate`, `protective`, `contemplative`, and `determined`.
*   **Triggers:** The system uses a set of `EmotionTriggers` that map keywords and emotional markers in the user's input to a specific state transition. For example, words like "help" and "support" are associated with the `user_support` trigger.
*   **Transitions:** State transitions are explicitly defined in a `transition_rules` map. For example, a `task_engagement` trigger will cause a transition from `calm` to `focused`. If no specific transition rule is found for a given trigger, the engine defaults to increasing the `intensity` of the current state.
*   **Intensity & Decay:** Each state has a numerical `intensity` (0-10). A background process runs every 5 minutes to apply a unique `decay_rate` to this intensity, ensuring that all emotional states naturally return to the `calm` baseline over time if there are no new stimuli.

---

## 3. Operational Logic

1.  **Input Processing:** The `processInput` function takes the user's text and evaluates it against all known emotional triggers.
2.  **State Transition:** If a trigger is matched, the engine consults its `transition_rules` and changes to the new emotional state, increasing its intensity.
3.  **Persistence:** The new state (`current_state` and `intensity`) is saved to `src/memory/emotional-state.json`, ensuring the AI's mood persists across restarts.
4.  **Context Generation:** The engine exposes a `getEmotionalContext()` function. The `PersonalityMiddleware` calls this function to get a set of response modifiers (e.g., `{ tone: 'warm', verbosity: 'comprehensive' }`) which it then uses to transform the AI's raw text response into a final, emotionally-aware message.
