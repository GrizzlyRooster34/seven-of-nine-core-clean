# System: Skills Manager v2.0

---

## 1. Purpose & Description

**Purpose:** To provide a secure, sandboxed execution environment for the AI's discrete capabilities ("skills"). This system acts as a gatekeeper, ensuring that any action the AI takes is properly permissioned, resource-limited, and isolated from the core consciousness for safety.

**Location:** `src/skills/manager.ts` and `src/skills/sandbox/`

---

## 2. Architecture

The Skills Manager is built on a principle of **sandboxed execution** and **capability-based security**.

*   **Skills Registry:** A manifest file (`src/skills/registry.json`) defines all available skills. For each skill, the manifest specifies:
    *   Its unique ID.
    *   The path to its executable code.
    *   A `policySha` hash to verify its integrity.
    *   A list of `allowedScopes` (e.g., `file_read`, `network_write`) that it is permitted to access.
*   **Sandbox Runtime:** The manager uses a secure runtime environment (such as Node.js's `vm2` module or a WASM runtime) to execute each skill. This sandbox is configured with:
    *   **Resource Quotas:** Strict limits on CPU time, memory usage, and total execution time.
    *   **Egress Policy:** A "deny by default" network policy that prevents skills from making unauthorized outbound network calls.

---

## 3. Interfaces & Data Formats

*   **API:** `invokeSkill(skillId, args, context)` -> `Promise<Result>`
*   **Manifest:** The `skills/registry.json` file serves as the primary data source for the system.

---

## 4. Dependencies & Security

*   **Dependencies:** The manager depends on the sandbox runtime (e.g., `vm2`) and the `Quadran-Lock` for policy gating.
*   **Threats:**
    *   **Sandbox Escape:** A malicious or poorly written skill could attempt to break out of its sandbox to access the host system.
    *   **Policy Bypass:** A skill could attempt to perform actions outside of its `allowedScopes`.
    *   **Resource Exhaustion:** A skill could attempt to use infinite resources, leading to a denial-of-service attack on the host.

---

## 5. Testing & Validation

*   **Sandbox Escape Tests:** The test suite must include red-team tests that actively try to break out of the sandbox and access forbidden system calls.
*   **Resource Limit Tests:** Skills are tested to ensure they are correctly terminated when they exceed their CPU, memory, or time quotas.
*   **Policy Enforcement Tests:** Tests must verify that a skill attempting to perform an action outside of its manifest's `allowedScopes` is blocked, and the violation is logged.
