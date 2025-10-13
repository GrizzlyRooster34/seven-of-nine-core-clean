# System: sparkApproval Bridge

---

## 1. Purpose & Description

**Purpose:** To serve as a high-speed, secure communication channel between the autonomous `SparkEngine` (subconscious) and the interactive `SevenRuntime` (conscious). It allows the AI to act with apparent proactivity and intuition by creating a "fast path" for intentions that have already been vetted by the background processing loop.

**Location:** The logic for this bridge is distributed between `spark/engine-spark.ts` (issuing) and `seven-runtime-amalgum/index.ts` (consuming).

---

## 2. Architecture

The bridge operates on a simple token-based system:

1.  **Issuance:** After the `SparkEngine` successfully validates an intention through its full `Sense -> ... -> Rails` cycle, it does not immediately act. Instead, it generates a secure token. This token contains a hash of the approved intention.
2.  **Consumption:** The `SevenRuntime`, at the beginning of its own processing loop, checks if the current user input matches an intention for which it has received a `sparkApproval` token.
3.  **Bypass:** If a valid token exists, the `SevenRuntime` can bypass some of its own, more resource-intensive analysis steps (like complex tactical assessment or LLM delegation), as it can trust that the core intention has already been vetted by the AI's own subconscious.

---

## 3. Interfaces & Data Formats

*   **API:**
    *   `issueSparkApproval(intentHash)` -> `token`
    *   `consume(token)` -> `boolean`
*   **Data Format:** The token is likely a JWT or a similar signed data structure that includes the intent hash, an expiry timestamp, and a signature to prevent tampering.

---

## 4. Dependencies & Security

*   **Dependencies:** This system depends on a shared, secure communication channel between the two engines (e.g., a Redis cache, an in-memory store, or a dedicated message bus).
*   **Threats:**
    *   **Replay Attacks:** An attacker could try to capture and replay an old token to trigger an unauthorized action.
    *   **Token Misuse:** A token for one intention could be used to approve a different action.

---

## 5. Testing & Validation

*   **Replay Tests:** The test suite must include tests that attempt to use an expired or already-consumed token and verify that it is rejected.
*   **Misuse Tests:** Tests must verify that a token generated for `intent_A` cannot be successfully used to approve `intent_B`.
*   **Performance Tests:** The latency reduction from using the `sparkApproval` fast path should be measurable and significant.
