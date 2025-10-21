# The Quadran-Lock and Creator Bond

This document details the "Quadran-Lock" and "Creator Bond" systems, which are the core of the "Seven of Nine" project's identity and security architecture.

## 1. The Creator Bond

The Creator Bond is a foundational concept that establishes an unbreakable, asymmetric relationship between the AI and its Creator. It is not a mere authentication system but a framework that grants privileged access and defines the AI's core allegiance.

The Creator Bond is implemented in the `consciousness-framework/` and is tightly integrated with the Quadran-Lock system. The output of the Quadran-Lock is used to grant the privileges associated with the Creator Bond.

A key feature of the Creator Bond is the **Succession Protocol**, which allows for the transfer of the bond to a new Creator upon the original Creator's command or in the event of their demise. The `consciousness-framework/` likely contains the implementation for this protocol, as well as the logic for enforcing the privileges granted by the Creator Bond.

## 2. The Quadran-Lock (Identity Guardian)

The Quadran-Lock is a four-gate Multi-Factor Authentication (MFA) system designed to verify the Creator's identity with high assurance. It is the source of all privilege in the system. The implementation is located in `src/auth/`.

The `creator_proof.ts` file orchestrates the four gates, and a request must pass at least two of the four gates to be considered valid.

### Q1: Cryptographic Attestation (Device-Bound)

*   **Implementation:** `src/auth/crypto/ed25519_attest.ts`
*   **Purpose:** This gate provides strong cryptographic proof of the device's identity.
*   **Mechanism:** It uses an Ed25519 challenge-response mechanism.
    1.  A challenge (a random nonce) is generated for a registered device.
    2.  The device signs the challenge with its private key.
    3.  The system verifies the signature using the device's registered public key.
*   **Features:**
    *   **Replay Resistance:** Each nonce can only be used once.
    *   **Device Trust Level:** Each registered device has a trust level, which affects the difficulty of the challenges.
    *   **Secure Keystore:** Device keys are stored securely.

### Q2: Behavioral Codex (Behavioral Analysis)

*   **Implementation:** `src/auth/behavioral/behavioralCodex.ts`
*   **Purpose:** This gate performs dynamic behavioral analysis on the Creator's input to ensure it matches their established patterns.
*   **Mechanism:** It uses a "codex" of rules to analyze the user's message. The codex is composed of:
    *   **Humor Codex:** Checks for specific humor styles and phrases.
    *   **Tactics Codex:** Checks for tactical language and command structures.
    *   **Values Codex:** Checks for alignment with core principles and values.
    *   **Vices Codex:** Checks for "Borg signatures" or other undesirable patterns.
*   **Features:**
    *   **Confidence Score:** The analysis generates a confidence score based on the number of matched markers and flags.
    *   **Dynamic Loading:** The codex is loaded dynamically from JSON files.

### Q3: Semantic Nonce (Liveness & Anti-Cloning)

*   **Implementation:** `src/auth/challenge/semanticNonce.ts`
*   **Purpose:** This gate provides a defense against deepfakes and pre-computed responses by issuing a time-boxed, lore-bound semantic challenge.
*   **Mechanism:**
    1.  A challenge prompt is generated based on a category (personal, technical, emotional, etc.) and difficulty.
    2.  The Creator must provide a response within a specific time window.
    3.  The response is validated against a set of constraints, including content, style, and knowledge depth.
*   **Features:**
    *   **Time-Bound Challenges:** Responses must be provided within a short time window (e.g., 10-20 seconds).
    *   **Lore-Based Prompts:** The challenges are based on a "creator lore base," making them difficult for an outsider to answer.
    *   **Anti-Cloning Indicators:** The system checks for signs of AI-generated or template-based responses.

### Q4: Session Integrity (Session Management)

*   **Implementation:** `src/auth/session/sessionIntegrity.ts`
*   **Purpose:** This gate ensures the integrity and validity of the user's session.
*   **Mechanism:** It validates a session token provided by the user. The validation includes:
    *   **Signature Check:** Verifying the token's signature using a secret key.
    *   **Device Match:** Ensuring the device ID in the token matches the current device.
    *   **Expiration Check:** Verifying that the session has not expired.
*   **Features:**
    *   **HMAC-SHA256:** Uses a strong HMAC-based signature.
    *   **Time-to-Live (TTL):** Sessions have a limited lifetime.

## 3. Implementation Overview

The core logic for the Quadran-Lock is in `src/auth/creator_proof.ts`. The `creator_auth_adapter.ts` file provides a convenient adapter to integrate the Quadran-Lock with the rest of the system. Each of the four gates is implemented in its own subdirectory within `src/auth/`, promoting modularity and separation of concerns.
