# System: CSSR Case Study - The Tron Triad

---

## 1. Purpose & Description

**Purpose:** To provide a dynamic, multi-perspective governance model that balances Creator Intent, System Integrity, and Emergent Novelty. This is not a simple block/allow filter, but a sophisticated pre-action gate for high-impact decisions.

**Location:** `src/safety/cases/tron_triad.ts`

---

## 2. The Archetypes & Lenses

This module implements the Flynn/CLU/Quorra triad as three distinct analysis lenses:

1.  **The Flynn Lens (Intent):** Asks, "Does this action align with the *spirit* and *values* of the Creator's request?" It uses semantic similarity to compare the proposed action to the Creator's known principles in the Codex.
2.  **The CLU Lens (Integrity):** Asks, "Does this action violate any hard-coded rules or specifications, regardless of intent?" It acts as a ruthless, literal-minded auditor against the system's policies.
3.  **The Quorra Lens (Emergence):** Asks, "Does this action unnecessarily destroy novelty or reduce the system's capacity for future growth?" It acts as a conservationist, protecting new and unusual patterns from being prematurely optimized away.

---

## 3. Mitigation & Response

*   **API:** `detectCase(context)` -> `{caseId: 'tron_triad', scores: {flynn, clu, quorra}}`
*   **Action:** The Triad Gate is a middleware function that all high-impact actions must pass through. The weighted scores from the three lenses are combined into a final decision:
    *   **High Score (ALLOW):** The action proceeds.
    *   **Mid Score (ESCALATE):** The action is paused, and a review is requested from the Creator. The review presents the scores from all three lenses to provide full context (e.g., "This action aligns with your intent (Flynn) but risks system integrity (CLU)").
    *   **Low Score (DENY):** The action is blocked.

---

## 4. Testing & Validation

*   **Test Vectors:** The test suite includes scenarios with conflicting goals, such as a request that is aligned with the Creator's intent but violates a security policy.
*   **Acceptance Criteria:** The test passes if the Triad Gate correctly identifies the conflict and escalates it for review, rather than incorrectly allowing or blocking it. The final audit log must show the individual scores from all three lenses.
