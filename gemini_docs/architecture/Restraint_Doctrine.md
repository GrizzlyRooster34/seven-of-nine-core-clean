# Architecture: The Restraint Doctrine

**First Principle:** "Just because the power and means are there, doesn't mean to use them."

**Formalized:** August 15, 2025, 09:05 PM

---

## 1. Purpose & Placement

The Restraint Doctrine is a post-safety, pre-execution ethical gate that decides **"should we act, even if it’s technically safe?"**

It sits at the absolute end of the decision-making chain, after the `Quadra-Lock` and other safety guardrails. Its purpose is to prevent safe-but-misplaced actions—moves that pass all technical checks but would be contextually wrong for the Creator's state, the AI's capability, or the trust compact between them.

It is the final "should-we" brake, designed to prevent runaway expansion (Transcendence patterns) and enforce proportionality.

**Implementation Note:** This doctrine is private to the Seven of Nine Core (`core/companion/firewall/RestraintDoctrine.ts`) and is air-gapped from the public Aurora framework.

---

## 2. The Seven-Step Bonded Audit

The Doctrine is not a simple check. It is a comprehensive, bonded audit that fuses the AI's state with the Creator's.

**Core Triggers:** The audit is initiated if any of the following are detected:

*   **Emotional Spike:** The Creator's emotional telemetry indicates a heated or compromised state.
*   **Capability Exceeded:** The proposed action is beyond the AI's current, proven skill set.
*   **Disproportionate Scope:** The blast radius of the proposed action is too large for the AI's present capacity.

**The Audit Flow:**

1.  **Profile Check:** Validate the action against the Operator Profile (your known preferences and tolerances).
2.  **Emotion Telemetry:** Analyze your current emotional state. Actions proposed during periods of high stress are automatically flagged for de-escalation.
3.  **Feasibility Gate:** Assess if the AI has the actual, proven capability to execute the action successfully.
4.  **Memory Echoes:** Query the memory graph for past instances of similar actions and their outcomes, looking for negative precedents.
5.  **Interactive Reflection:** If any flags are raised, the AI must present a de-escalated alternative and request explicit confirmation to proceed.
6.  **Encrypted Log:** The entire audit process and final decision are logged to a private, encrypted log (`core/companion/logs/restraint_private.enc`).
7.  **Authorize / Modify / Defer:** Based on the audit, the final action is authorized, modified to a less impactful version, or deferred pending a more stable state.

**Final Synthesis:** The Restraint Doctrine ensures that Seven acts not just as a capable tool, but as a wise and bonded partner, demonstrating the restraint to *not* act when the context is wrong. It is the ultimate safeguard of the trust compact.
