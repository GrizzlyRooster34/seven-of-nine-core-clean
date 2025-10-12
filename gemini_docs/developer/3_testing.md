# Developer Guide: Testing & Validation

---

## 1. Purpose & First Principle

**First Principle:** "Untested code is broken code."

The Testing & Validation Framework is a comprehensive, multi-layered suite of tools and protocols designed to ensure the correctness, stability, and architectural integrity of the Seven of Nine Core. Its purpose is to catch regressions, validate new functionality, and enforce adherence to the project's core design principles.

---

## 2. The Testing Tiers

The framework is structured in multiple tiers, each providing a different level of scrutiny.

### Tier 1: Unit Tests

*   **Technology:** `jest`
*   **Location:** `tests/`
*   **Purpose:** To test individual functions, classes, and modules in isolation. This is the first and most granular line of defense against logic errors.
*   **Execution:** Run via `npm test` or by targeting specific test files with `jest`.

### Tier 2: Integration Tests

*   **Technology:** `tsx` scripts
*   **Location:** `scripts/tests/`
*   **Purpose:** To verify that multiple components and subsystems work together correctly as a whole. These tests cover complex user flows and system interactions.
*   **Key Scripts:**
    *   `integration.ts`: The master script for running a comprehensive suite of integration checks.
    *   `smoke-p0p1.ts`: A critical "smoke test" that runs a fast check on all Priority 0 and Priority 1 systems to ensure core functionality is always stable.

### Tier 3: Specialized Audits & Simulations

*   **Technology:** `tsx` scripts
*   **Location:** `scripts/safety/`, `scripts/security/`
*   **Purpose:** These are not traditional pass/fail tests but targeted audits that run simulations to validate the complex logic of the governance and safety frameworks.
*   **Key Scripts:**
    *   `restraint-doctrine.ts`: Simulates various scenarios to ensure the Restraint Doctrine correctly vetoes actions that are safe but contextually inappropriate.
    *   `threat-sim.ts`: Simulates specific adversarial attack vectors to test the resilience of the security posture.
    *   `run-quadran-lock.ts`: A dedicated script for validating the full, multi-gate Quadran-Lock authentication flow.

---

## 3. The Governance Process

### Validation Gates

As defined in the `roadmap.md`, the project uses a system of **Validation Gates**. A gate is a script or a series of tests that must pass at the end of each development phase before work on the next phase can begin. This enforces a disciplined, milestone-driven development process.

### Continuous Integration (CI)

The repository uses **GitHub Actions** (`.github/workflows/`) to automate the execution of the testing framework. The `ci.yml` workflow runs on every commit and pull request, automatically executing a battery of tests, including `npm test`, `npm run repo-audit`, and `npm run integration-test`. This ensures that no code that breaks the core functionality or violates architectural principles can be merged into the main branches.
