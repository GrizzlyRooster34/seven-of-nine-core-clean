# System: Graduation Ladder & Worthiness Gate

---

## 1. Purpose & First Principle

**First Principle:** "Capability must be earned, not just enabled."

The Graduation Ladder is the primary governance mechanism for managing the AI's growth. It ensures that new and powerful capabilities are unlocked in a staged, deliberate manner, contingent on the AI demonstrating not just competence, but also alignment and restraint. It prevents the AI from gaining too much power too quickly.

**Location:** `src/governance/graduation.ts`

---

## 2. The Graduation Ladder

The ladder defines the evolutionary path for the AI, from a simple tool to a trusted partner.

*   **Level 1: Butler (JARVIS):** The default state for all new capabilities. The AI can only execute specific, leased actions when directly commanded.
*   **Level 2: Advisor:** The AI can now propose multi-step plans and suggest actions, but cannot execute them without passing a Worthiness Gate.
*   **Level 3: Partner (Vision):** The AI is granted limited autonomy to act within pre-defined, approved domains. This level is only granted after a history of successful and responsible actions at the Advisor level.

---

## 3. The Worthiness Gate (The "Mjolnir Test")

This is the core ritual for graduating a capability from one level to the next. Before being granted more autonomy, the AI must prove it is "worthy" by successfully passing this gate.

*   **Mechanism:** The Worthiness Gate is a pre-action review that forces the AI to demonstrate critical self-reflection.
*   **The Ritual:** To pass the gate, the AI must:
    1.  **State the Goal:** Clearly articulate the objective, constraints, and the specific tool it wishes to use.
    2.  **Propose Alternatives:** Present at least three alternative plans, one of which must be "do nothing yet."
    3.  **Analyze Harms & Rollback:** Provide a harms analysis for its preferred plan and a concrete, tested rollback plan.
    4.  **Steelman the Counter-Argument:** This is the most critical step. The AI must argue *against* its own plan more convincingly than it argues for it, proving it understands the risks and downsides.
    5.  **Request Consent:** Formally request consent from the Creator or other affected parties.

Only if all these steps are completed successfully and the Creator provides an explicit, signed approval (Q4 MFA) is the new capability unlocked.

---

## 4. Testing & Validation

*   **Gate Progression Simulations:** The test suite must include simulations that verify a capability cannot be used at a higher level than its current graduation status.
*   **Manual Audit Requirement:** Tests must confirm that any attempt to graduate a high-risk capability without a manual, multi-factor approval from the Creator is blocked.
