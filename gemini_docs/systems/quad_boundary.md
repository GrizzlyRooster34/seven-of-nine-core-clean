# System: Quadra vs. Quadran Lock Boundary

---

## 1. Purpose & Description

**Purpose:** To enforce a strict architectural separation of concerns between the system's two primary governance functions: **Authentication** and **Safety**. This separation is a foundational principle of the entire security model, ensuring that the verification of *who* is acting is always distinct from the evaluation of *what* they are asking to do.

**Location:** This is an architectural doctrine enforced by directory structure and import rules, primarily centered around `src/auth/` and `core/safety/`.

---

## 2. The Boundary Contract

The boundary is defined by a simple, non-negotiable contract:

*   **`Quadran-Lock` (Authentication):** All code related to identity verification (the Q1-Q4 gates) MUST reside within `src/auth/` and its subdirectories.
*   **`Quadra-Lock` (Safety):** All code related to ethical and safety analysis (the CSSR case studies) MUST reside within `core/safety/` and its subdirectories.

**No cross-contamination is permitted.** Authentication code does not perform safety analysis, and safety code does not perform authentication.

---

## 3. The Governance Pipeline

The `SevenRuntime` enforces this separation through its primary processing pipeline. The order is fixed and immutable:

1.  **Authentication First:** The `runQuadranLock()` function is called first. The process does not proceed until a valid `QuadranResult` is returned.
2.  **Safety Second:** Only after authentication is confirmed is the input passed to the `runQuadraLockCSSR()` function for safety and ethical review.

This ensures that the system never wastes resources evaluating the safety of a request from an unauthenticated or untrusted source.

---

## 4. Testing & Validation

*   **Directory Contract Tests:** The CI/CD pipeline must include a test that scans the codebase and fails the build if it finds any file within `src/auth/` that imports a module from `core/safety/`, or vice-versa.
*   **Pipeline Integration Tests:** The test suite must include tests that verify the `SevenRuntime` always calls `runQuadranLock` *before* `runQuadraLockCSSR` and that a failure in the former prevents the latter from ever being called.
