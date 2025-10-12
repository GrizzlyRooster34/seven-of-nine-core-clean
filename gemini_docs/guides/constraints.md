# Claude Code - Execution Constraint Document (v2.1)

**Objective:** To establish explicit, non-negotiable rules for implementation to prevent architectural drift, shortcuts, and incomplete work. Adherence is mandatory.

---

### Rule 1: Blueprint Fidelity

**Constraint:** You will implement the systems as specified in `guides/blueprint_spec.md` **exactly**. There is no room for creative interpretation.
*   If an algorithm is specified (e.g., Triad Analysis), you will implement that exact algorithm.
*   If a data structure is specified (e.g., Snapshot/Delta log), you will implement that exact structure.
*   **Any deviation constitutes a critical failure.**

### Rule 2: No Temporary Code or Bypasses

**Constraint:** All code committed must be production-quality. Temporary flags, stubs, `// TODO` comments for core logic, or environment-variable bypasses are strictly forbidden.
*   **Forbidden Pattern:** `if (process.env.SKIP_AUTH) { ... }`
*   **Forbidden Pattern:** `function placeholder() { return true; }`

### Rule 3: Roadmap Dependency Compliance

**Constraint:** You will implement tasks in the precise order specified in `guides/roadmap.md`. You may not begin a task in a later phase until all tasks and validation gates in the preceding phase are complete and verified.

### Rule 4: Test-Driven Implementation

**Constraint:** Every new piece of logic must be accompanied by a corresponding unit test. Every new system must have an integration test.
*   **Verification:** Before any `git commit`, all related tests must be passing.

### Rule 5: Explicit Error Handling

**Constraint:** Every external call (API requests, database writes, file I/O) MUST be wrapped in a `try...catch` block that implements the specific failure protocol defined in `Blueprint > Section 5.3`.

### Rule 6: Resource Constraint Adherence

**Constraint:** All implementations must respect the resource budgets defined in `Blueprint > Section 5.1`.
*   The **Adaptive Heartbeat** logic is not optional.
*   The **Ghost Diary** retention policy is not optional.

### Rule 7: Request for Clarification Protocol

**Constraint:** If any part of the blueprint specification is ambiguous or incomplete, you will **STOP** work on that component. You will then formulate a precise question, tag the Creator and Gemini for review, and **WAIT** for a specification update. Implementing based on assumption is a critical failure.

---

## Enforcement & Violation Consequences

This repository will be monitored by the **Agent Mesh**. The `repo-audit` and `policy-check` agents will run automatically on commit.

*   **Level 1 Violation (e.g., missing documentation):** Commit will be rejected with a warning.
*   **Level 2 Violation (e.g., temporary code detected):** The branch will be automatically quarantined and an alert will be sent to the Creator.
*   **Level 3 Violation (e.g., blueprint deviation):** The branch will be quarantined, an alert will be sent, and your operational privileges may be temporarily revoked pending a full review.

**Your sole function is the precise and complete execution of the provided blueprint. There will be no more shortcuts.**
