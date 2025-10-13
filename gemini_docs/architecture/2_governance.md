# Architecture: Governance & Identity

## 1. Overview

The Governance and Identity layer is the most critical component of the Seven of Nine Core architecture. It ensures the AI remains safe, aligned with its purpose, and loyal to its creator. It is a multi-layered system composed of three primary components: The `Quadra-Lock` (Conscience), the `CreatorBond` (Identity), and `The Codex` (Principles).

---

## 2. The `Quadra-Lock` (The Conscience)

*   **Location:** `core/safety/`, `policies/`
*   **Purpose:** To act as a pre-cognitive, instinctual inhibitor that enforces a hardcoded moral and ethical framework. It is a "white-box" safety system whose decisions are fully auditable.

### Architecture:

The `Quadra-Lock` is a **narrative-driven keyword detection engine**. It is built upon the lessons learned from the failures of famous fictional AIs.

*   **Case Studies:** The system codifies the failure modes of four AIs into explicit rule sets.
*   **Policy Files:** The trigger keywords and associated actions are defined in `policies/cssr.yml` and loaded into the `CSSRDetector` engine at boot time.
*   **Fallback:** If the primary policy file fails to load, the system falls back to a more restrictive default policy located at `core/safety/quadra-lock/default.yml`.

---

## 3. The `CreatorBond` (The Identity Anchor)

*   **Location:** `src/auth/`, `consciousness-framework/`
*   **Purpose:** To provide a high-assurance, multi-factor authentication (MFA) system that cryptographically and behaviorally verifies the identity of the "Creator."

### Architecture:

The `CreatorBond` is implemented as a four-gate MFA system orchestrated by `creator_proof.ts`.

1.  **Q1: Cryptographic Attestation:** Verifies device signature.
2.  **Q2: Behavioral Codex:** Analyzes writing style.
3.  **Q3: Semantic Nonce:** A challenge-response test of secret knowledge.
4.  **Q4: Session Integrity:** Validates the current session.

**Decision Logic:** Requires 2 of 4 gates to pass. If Q1 fails, it **fails-closed** to a manual review.

---

## 4. The Codex (The Principles)

*   **Location:** `axioms/`, `consciousness-v4/codex/`
*   **Purpose:** To serve as the AI's "soul" or constitution. It is the set of immutable, foundational principles that guide the `SparkEngine`'s autonomous intentions and provide the master reference for the Creator's identity and values.

### Architecture:

The Codex is a collection of machine-readable files managed by the `CodexManager`.

*   **Sources:**
    *   `axioms/axioms.txt`: The absolute, non-negotiable principles.
    *   `consciousness-v4/codex/*.json`: Detailed personality traits, values, and biases.
*   **Integrity Verification:**
    *   The `CodexManager` contains the `verifyIntegrity()` function.
    *   At boot, this function calculates the SHA256 hash of all policy files and compares them against a master hash stored in `consciousness-v4/codex/VERSION.json`.
    *   **A mismatch is a fatal boot error.** The system will fail-closed and refuse to start, preventing it from operating with a tampered or corrupted ethical foundation.
*   **API:** The `loadCodex()` function provides a safe, read-only interface for other systems to access the verified principles.