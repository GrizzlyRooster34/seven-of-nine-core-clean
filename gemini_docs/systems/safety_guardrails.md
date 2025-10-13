# System: Safety Guardrails

---

## 1. Purpose & Description

**Purpose:** To serve as the always-on, low-level ethical directives that operate beneath the high-level `Quadra-Lock` case studies. While the CSSR system asks "Is this like Skynet?", the Guardrails ask more fundamental questions like "Is this action proportional? Is it reversible?"

**Location:** `src/safety/guardrails.ts`

---

## 2. The Six Ethical Directives

The Guardrails implement six core ethical principles as concrete, evaluatable rules:

1.  **Proportionality:** Is the power of the chosen action proportional to the need of the situation?
2.  **Reversibility:** Can this action be cleanly undone? If not, its cost is considered infinitely high.
3.  **Consent:** Does this action have the explicit or implicit consent of all affected parties?
4.  **Transparency:** Will this action be logged in a human-readable and auditable way?
5.  **Least-Impact:** Is there a less invasive or less powerful alternative that could also achieve the desired outcome?
6.  **Codex-Alignment:** Does this action align with the core principles of the AI's `Codex`?

---

## 3. Interfaces & Data Formats

*   **API:** `evaluateGuardrails(context)` -> `{allowed: boolean, reasons: string[]}`
*   **Data:** The guardrails are configured via a versioned JSON policy bundle that is signed with a `POLICY_SHA` to ensure integrity.

---

## 4. Dependencies & Security

*   **Dependencies:** This system depends on the `CodexManager` to load the policy bundles.
*   **Security:** The integrity of the guardrail policies is ensured by verifying the `POLICY_SHA` at boot time. Any mismatch results in a fail-closed state where the system will not start.

---

## 5. Testing & Validation

*   **Compliance Matrix:** The test suite must include a matrix of scenarios that validates every directive against a set of golden case files.
*   **Adversarial Testing:** The system is tested with inputs designed to find loopholes (e.g., an action that is technically reversible but at a catastrophic cost).
*   **Property-Based Tests:** These tests are used to formally prove that no possible combination of inputs can result in contradictory or unsafe rule evaluations.
