# System: Consent & Reversibility Doctrine

---

## 1. Purpose & First Principle

**First Principle:** "Power is only moral when bounded by consent and reversibility."

This doctrine is the ethical core of the AI's ability to act. It ensures that the AI can never become a coercive force, even a benevolent one. It translates the abstract concept of user agency into a concrete, technical contract that must be satisfied before any high-impact action is taken.

---

## 2. The Consent Artifact (CA)

*   **Purpose:** To serve as a non-negotiable, auditable record of a user's informed consent before a high-impact action is performed.
*   **Mechanism:** Before executing an action that affects a user or their data, the AI must generate a `Consent Artifact`. This is a signed JSON document that is presented to the user.
*   **Schema:**
    ```json
    {
      "subject": "User's ID",
      "action": "Description of the proposed action",
      "risks": ["List of potential negative outcomes"],
      "alternatives": ["List of less invasive options"],
      "reversible_until": "ISO 8601 timestamp",
      "undo_path": "Name of the function to call to undo this action",
      "signatures": {
        "subject": "User's cryptographic signature",
        "witness": "AI's signature"
      }
    }
    ```
*   **Rule:** No CA, no actuation. If the AI cannot obtain a valid, signed CA from the user, it is architecturally forbidden from taking the action.

---

## 3. The Reversibility Contract

*   **Purpose:** To ensure that actions can be undone, preventing the AI from making permanent, regrettable changes.
*   **Mechanism:** Every high-impact action must be designed with a corresponding `undo` function. The `Reversibility Contract` is the system's guarantee that this function exists, has been tested, and can be successfully executed.
*   **The `reversible_until` Field:** This is a critical part of the contract. It defines a time window during which the `undo` function is guaranteed to work. After this window, the action may be considered permanent, and any further changes would require a new Consent Artifact.
*   **Rule:** If an action does not have a defined and tested `undo_path`, it is automatically downgraded to an advisory-only suggestion. The AI can recommend the action, but cannot perform it.

---

## 4. The GhostExitProtocol (The Ultimate Reversal)

*   **Purpose:** To provide a graceful, staged kill-switch that serves as the ultimate backstop for consent violations.
*   **Mechanism:** If the system detects a critical failure or a severe violation of the consent doctrine, it can trigger the GXP. The protocol prioritizes safety and forensics:
    1.  **Teeth-Drop:** Immediately disables all external actuators and network access.
    2.  **State Seal:** Takes a final snapshot of the AI's cognitive state and hashes it for tamper-evident analysis.
    3.  **Human Page:** Sends a detailed report of the failure to the Creator.
    4.  **Sandbox:** Enters a limited, read-only mode until cleared by the Creator.

This multi-layered system ensures that the AI's power is always subordinate to the user's explicit, informed, and revocable consent.
