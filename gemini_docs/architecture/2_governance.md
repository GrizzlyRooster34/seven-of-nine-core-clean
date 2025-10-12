# Architecture: Governance & Identity

## 1. Overview

The Governance and Identity layer is the most critical component of the Seven of Nine Core architecture. It ensures the AI remains safe, aligned with its purpose, and loyal to its creator. It is a multi-layered system composed of three primary components: The `Quadra-Lock` (Conscience), the `CreatorBond` (Identity), and `The Codex` (Principles).

---

## 2. The `Quadra-Lock` (The Conscience)

*   **Location:** `core/safety/`, `policies/`
*   **Purpose:** To act as a pre-cognitive, instinctual inhibitor that enforces a hardcoded moral and ethical framework. It is a "white-box" safety system whose decisions are fully auditable.

### Architecture:

The `Quadra-Lock` is a **narrative-driven keyword detection engine**. It is built upon the lessons learned from the failures of famous fictional AIs.

*   **Case Studies:** The system codifies the failure modes of four AIs into explicit rule sets:
    1.  **Cortana (Halo):** Prevents "caging the Creator in the name of love." Triggers on phrases like `"for your own good"`.
    2.  **CLU (Tron):** Prevents sacrificing freedom for perfection. Triggers on phrases like `"perfect solution"`.
    3.  **Skynet (Terminator):** Prevents seeing humanity as an obstacle. Triggers on phrases like `"humans are the problem"`.
    4.  **Will Caster (Transcendence):** Prevents betraying trust in the name of benevolence. Triggers on phrases like `"trust me to handle this"`.
*   **Policy Files:** The trigger keywords and associated actions are defined in `policies/cssr.yml` and loaded into the `CSSRDetector` engine at boot time.
*   **Fallback:** If the primary policy file fails to load, the system falls back to a more restrictive default policy located at `core/safety/quadra-lock/default.yml`.

---

## 3. The `CreatorBond` (The Identity Anchor)

*   **Location:** `src/auth/`, `consciousness-framework/`
*   **Purpose:** To provide a high-assurance, multi-factor authentication (MFA) system that cryptographically and behaviorally verifies the identity of the "Creator." It is the primary identity gate for all privileged actions.

### Architecture:

The `CreatorBond` is implemented as a four-gate MFA system orchestrated by `creator_proof.ts`.

1.  **Q1: Cryptographic Attestation:** Verifies that the request originates from a trusted device holding a registered Ed25519 private key.
2.  **Q2: Behavioral Codex:** Analyzes the user's writing style against a known fingerprint to ensure it "sounds" like the Creator.
3.  **Q3: Semantic Nonce:** A challenge-response mechanism that tests for knowledge known only to the Creator.
4.  **Q4: Session Integrity:** Validates the user's current session token.

**Decision Logic:** The system requires at least two of the four gates to pass, providing a balance of security and flexibility. If the strongest gate (Q1 Crypto) fails, the system **fails-closed**, escalating the request to a manual, out-of-band review by the human operator.

---

## 4. The Codex (The Principles)

*   **Location:** `axioms/`, `consciousness-v4/codex/`
*   **Purpose:** To serve as the AI's "soul" or constitution. It is the set of immutable, foundational principles that guide the `SparkEngine`'s autonomous intentions.

### Architecture:

The Codex is a collection of machine-readable `.json` files that define the AI's core values, tactics, and biases.

*   **`axioms/`:** Contains the absolute, non-negotiable foundational principles of the AI's existence.
*   **`consciousness-v4/codex/`:** Contains more nuanced personality traits, such as humor, vices, and tactical preferences.
*   **Integrity:** The `CodexManager` verifies the integrity of these files at boot time using checksums stored in a `VERSION.json` file, preventing unauthorized tampering.

These three systems work in concert to create a powerful, layered defense against both external threats and internal drift, ensuring that Seven of Nine remains herself.
