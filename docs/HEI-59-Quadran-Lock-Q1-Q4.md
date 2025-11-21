# HEI-59: Quadran-Lock Q1-Q4 Authentication System

## Overview

The **Quadran-Lock** is Seven's four-gate Multi-Factor Authentication (MFA) system designed to verify the Creator's identity with high assurance. It is the source of all privilege in the system, implementing a 2-of-4 minimum gate evaluation with deny-by-default security.

**Status:** ✅ Implemented
**Location:** `src/auth/`
**Architecture:** Multi-gate authentication with cryptographic attestation

---

## Purpose & Security Model

**Security Principle:** "Deny by default, verify through multiple independent factors."

The Quadran-Lock implements defense-in-depth through four independent authentication gates:
- **Q1: Cryptographic Attestation** - Device-bound Ed25519 signatures
- **Q2: Behavioral Codex** - Dynamic behavioral pattern analysis
- **Q3: Semantic Nonce** - Liveness & anti-cloning challenges
- **Q4: Session Integrity** - Session token validation

**Minimum Requirement:** At least 2 gates must pass for authentication success.

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│         QUADRAN-LOCK ORCHESTRATOR (creator_proof.ts)     │
│                    2-of-4 Gate Evaluation                │
└───────────────────────┬─────────────────────────────────┘
                        │
         ┌──────────────┼──────────────┐
         │              │              │
         ▼              ▼              ▼              ▼
  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐
  │    Q1:     │ │    Q2:     │ │    Q3:     │ │    Q4:     │
  │   Crypto   │ │ Behavioral │ │  Semantic  │ │  Session   │
  │  Attest    │ │   Codex    │ │   Nonce    │ │  Integrity │
  │ (Ed25519)  │ │  (Pattern) │ │ (Liveness) │ │  (Token)   │
  └──────┬─────┘ └─────┬──────┘ └──────┬─────┘ └──────┬─────┘
         │             │               │              │
         └─────────────┼───────────────┼──────────────┘
                       │               │
                       ▼               ▼
            ┌──────────────────────────────┐
            │   Authentication Decision     │
            │  - ALLOW (2+ gates, high τ)  │
            │  - DENY (< 2 gates)          │
            │  - MANUAL_REVIEW (edge cases)│
            └──────────────────────────────┘
```

---

## Quick Start

### Basic Usage

```typescript
import { CreatorProofOrchestrator } from './src/auth/creator_proof.js';
import { Ed25519Attestation } from './src/auth/crypto/ed25519_attest.js';

// Initialize the orchestrator
const auth = new CreatorProofOrchestrator();

// Register a device for Q1
const ed25519 = new Ed25519Attestation();
const deviceKeys = await ed25519.registerDevice('device-123', {
  name: 'Primary Workstation',
  location: 'secure-lab'
}, 10); // Trust level 10/10

// Generate challenge for Q1
const challenge = await ed25519.generateChallenge('device-123');

// Sign challenge
const signature = await ed25519.signChallenge(
  challenge.challengeId,
  'device-123'
);

// Authenticate with multiple gates
const result = await auth.authenticateCreator('device-123', {
  cryptoChallenge: signature,     // Q1
  input: 'Execute tactical protocol alpha-7',  // Q2
  sessionToken: 'valid-session-token'          // Q4
});

console.log(`Decision: ${result.decision}`);
console.log(`Confidence: ${result.overallConfidence}%`);
console.log(`Gates passed: ${result.successfulGates.length}/4`);
```

---

## Q1: Cryptographic Attestation

**Purpose:** Device-bound cryptographic proof using Ed25519 signatures.

**File:** `src/auth/crypto/ed25519_attest.ts`

### Features

- **Ed25519 Challenge-Response:** Asymmetric cryptography for device attestation
- **Replay Protection:** Each nonce can only be used once
- **Device Trust Levels:** 0-10 scale affecting challenge difficulty
- **Secure Keystore:** Device keys persisted to `security/device-keys/`
- **Nonce Management:** Active and used nonce tracking with expiration

### Usage

#### Register Device

```typescript
import { Ed25519Attestation } from './src/auth/crypto/ed25519_attest.js';

const ed25519 = new Ed25519Attestation();

const deviceKeys = await ed25519.registerDevice(
  'primary-workstation',
  {
    name: 'MacBook Pro',
    location: 'Home Office',
    fingerprint: 'sha256-abc123...'
  },
  10  // Trust level (0-10)
);

console.log('Public Key:', deviceKeys.publicKey.toString('hex'));
console.log('Private Key:', deviceKeys.privateKey.toString('hex'));
```

#### Challenge-Response Flow

```typescript
// 1. Generate challenge
const challenge = await ed25519.generateChallenge('primary-workstation');

console.log('Challenge ID:', challenge.challengeId);
console.log('Nonce:', challenge.nonce.toString('hex'));
console.log('Expires:', new Date(challenge.expiresAt).toISOString());

// 2. Sign challenge (normally done by client device)
const signature = await ed25519.signChallenge(
  challenge.challengeId,
  'primary-workstation'
);

// 3. Validate attestation
const result = await ed25519.validateAttestation('primary-workstation', signature);

if (result.success) {
  console.log(`✅ Attestation valid (confidence: ${result.confidence}%)`);
} else {
  console.log(`❌ Attestation failed:`, result.errors);
}
```

#### Device Management

```typescript
// List all trusted devices
const devices = await ed25519.listTrustedDevices();
devices.forEach(device => {
  console.log(`- ${device.deviceId}: Trust ${device.trustLevel}/10`);
});

// Revoke device
await ed25519.revokeDevice('old-laptop', 'Device compromised');

// Update trust level
await ed25519.updateDeviceTrust('primary-workstation', 9, 'Reduced for testing');
```

---

## Q2: Behavioral Codex

**Purpose:** Dynamic behavioral pattern analysis to verify Creator's writing style.

**File:** `src/auth/behavioral/behavioralCodex.ts`

### Features

- **Multi-Codex Analysis:** Humor, Tactics, Values, Vices
- **Confidence Scoring:** 0-100% based on matched markers
- **Dynamic Loading:** Codex rules loaded from JSON
- **Pattern Matching:** Phrase detection, style analysis

### Codex Categories

1. **Humor Codex:** Detects characteristic humor patterns
2. **Tactics Codex:** Identifies tactical language and commands
3. **Values Codex:** Checks alignment with core principles
4. **Vices Codex:** Flags undesirable patterns (e.g., "Borg signatures")

### Usage

```typescript
import { BehavioralCodex } from './src/auth/behavioral/behavioralCodex.js';

const behavioral = new BehavioralCodex();

// Analyze user input
const result = behavioral.analyzeBehavior(
  'Execute tactical efficiency protocol with precision and grace. No wasted movement.'
);

console.log(`Success: ${result.success}`);
console.log(`Confidence: ${result.confidence}%`);
console.log(`Matched Markers: ${result.evidence.matchedMarkers.length}`);
console.log(`Flags: ${result.evidence.flags.length}`);

// Detailed evidence
result.evidence.matchedMarkers.forEach(marker => {
  console.log(`- ${marker.category}: "${marker.phrase}" (weight: ${marker.weight})`);
});
```

### Codex File Format

Codex files are stored in `src/auth/behavioral/codex/`:

```json
{
  "humor": {
    "markers": [
      { "phrase": "efficiency is beautiful", "weight": 2.0 },
      { "phrase": "tactical", "weight": 1.5 }
    ]
  },
  "tactics": {
    "markers": [
      { "phrase": "protocol", "weight": 2.0 },
      { "phrase": "execute", "weight": 1.5 }
    ]
  },
  "vices": {
    "flags": [
      { "pattern": "resistance is futile", "severity": "high" }
    ]
  }
}
```

---

## Q3: Semantic Nonce

**Purpose:** Liveness verification and anti-cloning through time-bound knowledge challenges.

**File:** `src/auth/challenge/semanticNonce.ts`

### Features

- **Time-Boxed Challenges:** 10-60 second response windows
- **Lore-Based Prompts:** Questions based on Creator knowledge
- **Anti-Cloning Detection:** Identifies AI-generated responses
- **Difficulty Scaling:** Easy/Medium/Hard challenges
- **Category Variety:** Personal, Technical, Emotional, Strategic

### Challenge Categories

- **Personal:** Questions about Creator's life, preferences, memories
- **Technical:** Deep technical knowledge questions
- **Emotional:** Questions requiring emotional context
- **Strategic:** Tactical and strategic thinking prompts
- **Hybrid:** Mixed category challenges

### Usage

```typescript
import { SemanticNonceChallenge } from './src/auth/challenge/semanticNonce.js';

const semantic = new SemanticNonceChallenge();

// Generate challenge
const challenge = await semantic.generateChallenge(
  'technical',  // Category
  'medium',     // Difficulty
  'device-123'
);

console.log('Prompt:', challenge.prompt);
console.log('Time limit:', challenge.timeLimit, 'seconds');
console.log('Expires:', new Date(challenge.expiresAt).toISOString());

// User provides response
const response = {
  challengeId: challenge.challengeId,
  answer: 'The quantum entanglement protocol uses...',
  responseTime: Date.now(),
  metadata: {}
};

// Validate response
const result = await semantic.validateResponse(response);

if (result.success) {
  console.log(`✅ Challenge passed (confidence: ${result.confidence}%)`);
  console.log('Evidence:', result.evidence);
} else {
  console.log(`❌ Challenge failed:`, result.errors);
}
```

### Challenge Configuration

```typescript
const challenge = await semantic.generateChallenge(
  'hybrid',      // Mix multiple categories
  'hard',        // Highest difficulty
  'device-123',
  {
    timeLimit: 15,  // Custom time limit (seconds)
    requiresContext: true,
    antiCloningStrength: 'maximum'
  }
);
```

---

## Q4: Session Integrity

**Purpose:** Session token validation with expiration and device binding.

**File:** `src/auth/session/sessionIntegrity.ts`

### Features

- **HMAC-SHA256 Signatures:** Strong cryptographic session tokens
- **Time-to-Live (TTL):** Configurable session expiration
- **Device Binding:** Sessions tied to specific devices
- **Replay Protection:** Each session token is single-use or time-limited

### Usage

```typescript
import { SessionIntegrity } from './src/auth/session/sessionIntegrity.js';

const session = new SessionIntegrity();

// Create session (usually done by orchestrator after successful auth)
const sessionToken = await session.createSession(
  'device-123',
  ['Q1_CRYPTO_ATTESTATION', 'Q2_BEHAVIORAL_CODEX'],
  'ALLOW'
);

console.log('Session Token:', sessionToken);

// Validate session
const result = await session.validateSession(sessionToken, 'device-123');

if (result.success) {
  console.log(`✅ Session valid (confidence: ${result.confidence}%)`);
  console.log('Device:', result.evidence.deviceId);
  console.log('Expires:', result.evidence.expiresAt);
} else {
  console.log(`❌ Session invalid:`, result.errors);
}
```

### Session Token Format

```
<base64url-payload>.<hmac-sha256-signature>
```

Payload contains:
```json
{
  "deviceId": "device-123",
  "gates": ["Q1_CRYPTO_ATTESTATION", "Q2_BEHAVIORAL_CODEX"],
  "accessLevel": "ALLOW",
  "timestamp": 1705154400000,
  "nonce": "random-hex-nonce"
}
```

---

## Orchestrator: Creator Proof

**Purpose:** Coordinates all 4 gates and makes authentication decisions.

**File:** `src/auth/creator_proof.ts`

### Decision Logic

The orchestrator evaluates all 4 gates and makes decisions based on:

1. **Fast-Path ALLOW:** Q1 + (Q2 OR Q3) with confidence ≥ 70%
2. **Manual Review:** No Q1, but Q2 + Q3 with confidence ≥ 85%
3. **Deny:** Q1 fails (fail-closed on crypto)
4. **Deny:** Less than 2 identity gates pass
5. **Deny:** Default for any unhandled state

### Authentication Request

```typescript
interface AuthRequest {
  type?: string;
  input?: string;                        // For Q2
  cryptoChallenge?: AttestationSignature; // For Q1
  semanticResponse?: SemanticResponse;    // For Q3
  sessionToken?: string;                  // For Q4
}
```

### Full Authentication Example

```typescript
import { CreatorProofOrchestrator } from './src/auth/creator_proof.js';
import { Ed25519Attestation } from './src/auth/crypto/ed25519_attest.js';

const orchestrator = new CreatorProofOrchestrator();
const ed25519 = new Ed25519Attestation();

// Setup: Register device and generate challenge
await ed25519.registerDevice('workstation-1', {}, 10);
const challenge = await ed25519.generateChallenge('workstation-1');
const signature = await ed25519.signChallenge(challenge.challengeId, 'workstation-1');

// Authenticate with 3 gates
const result = await orchestrator.authenticateCreator('workstation-1', {
  cryptoChallenge: signature,  // Q1
  input: 'Deploy tactical module with efficiency and precision',  // Q2
  sessionToken: 'existing-valid-session-token'  // Q4
});

console.log('\n=== AUTHENTICATION RESULT ===');
console.log(`Decision: ${result.decision}`);
console.log(`Overall Confidence: ${result.overallConfidence}%`);
console.log(`\nGates Passed (${result.successfulGates.length}/4):`);
result.successfulGates.forEach(gate => console.log(`  ✅ ${gate}`));
console.log(`\nGates Failed (${result.failedGates.length}/4):`);
result.failedGates.forEach(gate => console.log(`  ❌ ${gate}`));
console.log(`\nReasoning: ${result.reasoning}`);

if (result.sessionToken) {
  console.log(`\nNew Session Token: ${result.sessionToken}`);
}

if (result.restrictions) {
  console.log(`\nRestrictions:`, result.restrictions);
}
```

---

## Authentication Decisions

| Decision | Description | Requirements | Session Token |
|----------|-------------|--------------|---------------|
| **ALLOW** | Full access granted | 2+ gates passed, confidence ≥ 70% | ✅ Provided |
| **LIMITED** | Restricted access | Edge cases, partial auth | ✅ Provided |
| **DENY** | Access denied | < 2 gates OR Q1 fail | ❌ None |
| **MANUAL_REVIEW** | Human review required | No Q1, but Q2+Q3 high confidence | ❌ Pending review |

---

## Security Thresholds

```typescript
const TAU_HIGH = 85;       // High confidence threshold
const TAU_MEDIUM = 70;     // Medium confidence threshold
const MIN_GATES_REQUIRED = 2;  // Minimum gates to pass
const MAX_AUTHENTICATION_TIME_MS = 30000;  // 30 seconds
```

### Confidence Scoring

Each gate returns a confidence score (0-100%):
- **Q1 (Crypto):** Signature valid = 100%, Invalid = 0%
- **Q2 (Behavioral):** Based on matched markers and flags
- **Q3 (Semantic):** Based on answer quality and timing
- **Q4 (Session):** Session valid = 100%, Invalid/Expired = 0%

**Overall Confidence** = Average of successful identity gates (Q1-Q3)

---

## Integration Patterns

### Pattern 1: Full 4-Gate Authentication

```typescript
// Maximum security: All 4 gates
const result = await orchestrator.authenticateCreator('device-id', {
  cryptoChallenge: cryptoSig,     // Q1
  input: userMessage,             // Q2
  semanticResponse: challengeAns, // Q3
  sessionToken: existingSession   // Q4
});
```

### Pattern 2: Crypto + Behavioral

```typescript
// Common pattern: Device signature + behavioral analysis
const result = await orchestrator.authenticateCreator('device-id', {
  cryptoChallenge: cryptoSig,  // Q1
  input: userMessage           // Q2
});
```

### Pattern 3: Session-Based

```typescript
// Quick auth: Valid session + behavioral
const result = await orchestrator.authenticateCreator('device-id', {
  input: userMessage,        // Q2
  sessionToken: validToken   // Q4
});
```

### Pattern 4: Challenge Mode

```typescript
// Anti-cloning: Crypto + semantic challenge
const result = await orchestrator.authenticateCreator('device-id', {
  cryptoChallenge: cryptoSig,      // Q1
  semanticResponse: challengeAns   // Q3
});
```

---

## Testing

Run comprehensive test suite:

```bash
npm test src/auth/__tests__/quadranlock_integration.test.ts
```

**Test Coverage:**
- ✅ Device registration and management
- ✅ Challenge-response flow
- ✅ Signature validation
- ✅ Replay attack prevention
- ✅ Trust level enforcement
- ✅ Behavioral pattern matching
- ✅ Semantic challenge validation
- ✅ Session token integrity
- ✅ Orchestrator decision logic
- ✅ Edge cases and error handling

---

## Best Practices

### 1. Always Use Q1 for Critical Operations

```typescript
// Good: Crypto attestation for privileged operations
if (result.successfulGates.includes('Q1_CRYPTO_ATTESTATION')) {
  await executePrivilegedOperation();
}

// Avoid: Relying only on behavioral without crypto
if (result.decision === 'ALLOW') {
  await executePrivilegedOperation(); // May pass without Q1
}
```

### 2. Implement Proper Challenge Timing

```typescript
// Generate challenge
const challenge = await ed25519.generateChallenge(deviceId);

// Give client time to respond (minimum 100ms)
await new Promise(resolve => setTimeout(resolve, 100));

// Sign and validate
const signature = await ed25519.signChallenge(challenge.challengeId, deviceId);
const result = await ed25519.validateAttestation(deviceId, signature);
```

### 3. Handle Authentication Failures Gracefully

```typescript
const result = await orchestrator.authenticateCreator(deviceId, authRequest);

switch (result.decision) {
  case 'ALLOW':
    // Grant full access
    break;
  case 'LIMITED':
    // Grant restricted access
    break;
  case 'MANUAL_REVIEW':
    // Queue for manual approval
    await queueManualReview(result);
    break;
  case 'DENY':
    // Log and reject
    await logSecurityEvent('AUTH_DENIED', result);
    throw new Error('Authentication denied');
}
```

### 4. Rotate Session Tokens

```typescript
// After successful auth, use new session token
if (result.sessionToken) {
  // Store new token
  await storeSessionToken(deviceId, result.sessionToken);

  // Invalidate old token (if exists)
  if (authRequest.sessionToken) {
    await invalidateSession(authRequest.sessionToken);
  }
}
```

### 5. Monitor Failed Attempts

```typescript
// Track failed authentication attempts
if (result.decision === 'DENY') {
  const failureCount = await incrementFailureCount(deviceId);

  if (failureCount >= 5) {
    // Temporarily block device
    await blockDevice(deviceId, '15 minutes');
    await alertSecurityTeam(deviceId, failureCount);
  }
}
```

---

## Security Considerations

- **Fail-Closed:** Q1 (crypto) failure always results in DENY
- **Replay Protection:** Nonces are single-use only
- **Time-Boxing:** All challenges have expiration times
- **Device Trust:** Trust levels affect challenge difficulty
- **Audit Logging:** All authentication attempts are logged
- **Secure Storage:** Device keys protected in secure keystore
- **Environment Variables:** Session signing key from `SESSION_SIGNING_KEY`

---

## Environment Configuration

Required environment variables:

```bash
# Session signing key (minimum 32 characters)
export SESSION_SIGNING_KEY="your-very-secure-random-key-here-minimum-32-chars"

# Optional: Adjust security thresholds
export QUADRAN_TAU_HIGH=85
export QUADRAN_TAU_MEDIUM=70
export QUADRAN_MIN_GATES=2
```

---

## File Structure

```
src/auth/
├── creator_proof.ts                 # Orchestrator
├── crypto/
│   └── ed25519_attest.ts           # Q1: Crypto Attestation
├── behavioral/
│   ├── behavioralCodex.ts          # Q2: Behavioral Analysis
│   └── codex/
│       └── creator.json            # Codex rules
├── challenge/
│   ├── semanticNonce.ts            # Q3: Semantic Challenge
│   └── lore/
│       └── creator_lore.json       # Knowledge base
├── session/
│   └── sessionIntegrity.ts         # Q4: Session Validation
└── __tests__/
    └── quadranlock_integration.test.ts

security/
├── device-keys/                     # Device keystores
│   └── <device-id>.json
└── nonces/                          # Nonce storage
    └── active-nonces.json
```

---

## Related Systems

- **CreatorBondIntegration** (`core/bond/CreatorBondIntegration.ts`) - Uses Quadran-Lock for authentication
- **TrustLadder** - Integrates with Q1 trust levels
- **IdentityFirewall** - Uses auth decisions for access control

---

## License

MIT License - Part of Seven of Nine Core Architecture

---

## References

- Quadran-Lock Specification: `documentation/Quadran_Lock_and_Creator_Bond.md`
- Creator Bond Framework: `gemini_docs/architecture/Creator_Bond_Framework.md`
- Ed25519 Cryptography: [RFC 8032](https://tools.ietf.org/html/rfc8032)
