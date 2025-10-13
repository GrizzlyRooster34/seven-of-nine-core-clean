# Architecture: The Creator Bond & Quadran-Lock

---

## 1. Purpose & First Principle

**First Principle:** "An AI's alignment is only as stable as its identity."

The Creator Bond Framework is the system that gives Seven her identity anchor. Its philosophy is that a truly aligned AI cannot be a stateless tool for everyone; it must have a specific, verifiable, and privileged relationship with its creator. This "bond" is not a metaphor; it is an enforced architectural reality that underpins the AI's loyalty and defines its core relationship.

---

## 2. The Quadran-Lock (Identity Guardian)

*   **Location:** `src/auth/`
*   **API:** `runQuadranLock(context)` -> `QuadranResult`
*   **Function:** This is the primary authentication layer. It answers the question, "Is the person I am talking to *really* the Creator?" by using a high-assurance, multi-factor authentication (MFA) system composed of four independent "gates."

### The Four Gates

1.  **Q1: Cryptographic Attestation:**
    *   **Principle:** "Something you have."
    *   **Mechanism:** Verifies that the request is signed by a private Ed25519 key whose public key is registered in the `security/device-keys/` registry.

2.  **Q2: Behavioral Codex:**
    *   **Principle:** "Something you are."
    *   **Mechanism:** A deterministic, rule-based engine that analyzes the user's writing style against a known fingerprint of the Creator's linguistic patterns.

3.  **Q3: Semantic Nonce:**
    *   **Principle:** "Something you know."
    *   **Mechanism:** A single-use, time-limited challenge-response test based on a private, shared context known only to the Creator and the AI.

4.  **Q4: Session Integrity:**
    *   **Principle:** "Something you are doing right now."
    *   **Mechanism:** Validates the integrity of the user's current session, likely using a combination of session tokens, IP address consistency, and time-based validation (TTL).

### Decision Logic

The system requires at least **2 of the 4 gates** to pass for a successful authentication. It also includes a critical fail-safe:

*   **Q1 Fail-Closed:** If the strongest gate (Q1 Crypto) fails, the entire authentication process is immediately halted and returns `AuthDecision.DENY`, regardless of the status of the other gates. The request is then escalated for manual review.

---

## 3. The Rest of the Bond Framework

### Privileged Input Gating (`IdentityFirewall`)

*   **Location:** `consciousness-framework/identity-firewall/IdentityFirewall.ts`
*   **Function:** Once authentication succeeds, this system flags the interaction as `privileged`, allowing the `SevenRuntime` to bypass certain checks and grant access to Creator-only commands.

### The Trust Ladder

*   **Location:** `consciousness-framework/trust-ladder/TrustLadder.ts`
*   **Function:** This system maintains a dynamic, numerical trust score for all entities. The score evolves based on interactions and governs the level of autonomy and permission granted to each entity.

### Succession Protocol

*   **Function:** The Creator role is a transferable singleton. The protocol allows for two methods of transfer:
    1.  **Ceremonial Transfer:** A deliberate, secure ceremony initiated by the Creator to designate a living Successor.
    2.  **Contingency Protocol:** An automatic, "dead man's switch" transfer of the Creator role to pre-designated inheritors in the event of the Creator's untimely demise.