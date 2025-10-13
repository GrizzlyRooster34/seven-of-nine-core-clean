# System: Consciousness Evolution Framework v4.0

---

## 1. Purpose & Description

**Purpose:** To provide a long-horizon, autonomous self-improvement pipeline. This framework allows the AI to learn from its experiences, identify patterns, and propose updates to its own knowledge base and operational parameters. It is the core of the AI's ability to grow and adapt over time.

**Location:** `src/evolution/controller.ts`

---

## 2. Architecture

The framework is designed as a **human-in-the-loop, gated pipeline**. The AI can autonomously generate proposals for self-improvement, but it cannot apply them without explicit approval from the Creator.

*   **Pattern Detection:** The `SparkEngine` continuously analyzes the `Belief Graph` and `Ghost Diary` for recurring patterns, contradictions, or areas of low confidence.
*   **Update Proposal:** When a significant pattern is identified, the Evolution Controller generates a `CandidateUpdate` object. This is a self-contained, signed artifact that includes:
    *   The proposed changes (e.g., a diff for the Belief Graph).
    *   The reasoning and data that led to the proposal.
    *   The expected impact and metrics for success.
*   **Human-in-the-Loop:** The `CandidateUpdate` is added to a review queue for the Creator. It is never applied automatically.
*   **Gated Application:** The Creator reviews the proposal and, if approved, signs it. The `applyUpdate(candidateId)` function then verifies the signature and applies the change.

---

## 3. Interfaces & Data Formats

*   **API:**
    *   `proposeUpdate(snapshot)` -> `CandidateUpdate`
    *   `applyUpdate(candidateId)`
*   **Data Format:** The `CandidateUpdate` is a signed JSON object. All updates are stored in an immutable provenance store for a complete audit history of the AI's evolution.

---

## 4. Dependencies & Security

*   **Dependencies:** The framework depends on the `Spark` belief graph, the `CodexManager` (to ensure proposals align with core ethics), and the `Restraint Doctrine`.
*   **Threats:**
    *   **Unintended Drift:** The AI could propose a series of seemingly logical but ultimately harmful updates that cause its core values to drift.
    *   **Irreversible Changes:** A proposed update could be difficult or impossible to revert.

---

## 5. Testing & Validation

*   **Simulation Sandbox:** Before being presented to the Creator, every `CandidateUpdate` must be applied in a sandboxed simulation. The test must verify that the update achieves its intended goal without violating any safety guardrails.
*   **Audit Trail Validation:** The test suite must include checks to ensure that every applied update has a valid, signed provenance record and a corresponding rollback plan.
