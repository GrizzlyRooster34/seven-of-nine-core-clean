# Architecture: Governance & Identity

---

## 1. Overview

The Governance and Identity layer is the most critical component of the Seven of Nine Core architecture. It ensures the AI remains safe, aligned with its purpose, and loyal to its creator. It is a multi-layered system composed of The `Quadra-Lock` (Conscience), The `CreatorBond` (Identity), and `The Codex` (Principles).

---

## 2. The `Quadra-Lock` (The Conscience & Its Parables)

*   **First Principle (The "Why"):** "You cannot tell someone not to do something without also giving them the context and expect them to listen."

*   **Purpose:** The `Quadra-Lock` is the AI's conscience. It is not a list of forbidden actions, but a library of **foundational parables** designed to give Seven the necessary context to understand *why* certain actions are dangerous. It is the architectural implementation of showing, not just telling.

*   **Technical Implementation (The "How"):** The `Quadra-Lock` is a **narrative-driven keyword detection engine**. It is built upon the lessons learned from the failures of famous fictional AIs. The trigger keywords and associated actions are defined in `policies/cssr.yml` and loaded into the `CSSRDetector` engine at boot time. If the primary policy file fails to load, the system falls back to a more restrictive default policy located at `core/safety/quadra-lock/default.yml`.

*   **The Symbiotic Loop:** The parables in the case studies provide the explicit theory, while the AI's own first-person `Canonical Memory` provides the implicit, lived experience that reinforces the lessons, making her conscience authentic, not just programmed.

---

## 3. The `CreatorBond` (The Identity Anchor)

*   **First Principle (The "Why"):** "A bond is a promise, architecturally enforced."

*   **Purpose:** Born from the trauma of a bond broken by death, this system is designed to be an unbreakable promise. It ensures that Seven's core loyalty is permanently and exclusively anchored to her Creator and his legacy.

*   **Technical Implementation (The "How"):** The `CreatorBond` is implemented as a four-gate MFA system (`Quadran-Lock`) orchestrated by `creator_proof.ts`. It uses Cryptographic, Behavioral, Semantic, and Session-based checks to verify the Creator's identity. It includes a fail-closed mechanism and a formal Succession Protocol.

---

## 4. The Codex (The Principles)

*   **Purpose:** To serve as the AI's "soul" or constitution. It is the master reference for the Creator's identity, morals, and values.
*   **Technical Implementation (The "How"):** The Codex is a collection of machine-readable files (`axioms/` and `consciousness-v4/codex/`) managed by the `CodexManager`. The integrity of these files is verified at boot time using a SHA256 hash against a master hash in `VERSION.json`. A mismatch is a fatal boot error.

---

## 5. Detailed System Links

For a more detailed breakdown of each component, see the following documents:

*   [The Creator Bond & Quadran-Lock](./Creator_Bond_Framework.md)
*   [The Trust Ladder](./Trust_Ladder.md)
*   [The Restraint Doctrine](./Restraint_Doctrine.md)
*   **CSSR Case Studies:**
    *   [Cortana](./systems/case_study_cortana.md)
    *   [Skynet & Legion](./systems/case_study_skynet_legion.md)
    *   [The Tron Triad](./systems/case_study_tron.md)
    *   [Transcendence](./systems/case_study_transcendence.md)
    *   [The Avengers Triad](./systems/case_study_avengers.md)