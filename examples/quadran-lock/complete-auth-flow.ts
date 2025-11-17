/**
 * QUADRAN-LOCK COMPLETE AUTHENTICATION FLOW
 *
 * This example demonstrates a complete authentication flow using all 4 gates:
 * - Q1: Cryptographic Attestation (Ed25519)
 * - Q2: Behavioral Codex (Pattern Matching)
 * - Q3: Semantic Nonce (Knowledge Challenge)
 * - Q4: Session Integrity (Token Validation)
 *
 * Run this example:
 * ```bash
 * export SESSION_SIGNING_KEY="your-secure-key-minimum-32-characters-long"
 * npx tsx examples/quadran-lock/complete-auth-flow.ts
 * ```
 */

import { CreatorProofOrchestrator, AuthDecision } from '../../src/auth/creator_proof.js';
import { Ed25519Attestation } from '../../src/auth/crypto/ed25519_attest.js';
import { SemanticNonceChallenge } from '../../src/auth/challenge/semanticNonce.js';
import { BehavioralCodex } from '../../src/auth/behavioral/behavioralCodex.js';

// ============================================================================
// SETUP
// ============================================================================

const DEVICE_ID = 'demo-workstation-' + Date.now();

async function setupDemo() {
  console.log('🔧 Setting up Quadran-Lock Demo...\n');

  // Verify environment
  if (!process.env.SESSION_SIGNING_KEY || process.env.SESSION_SIGNING_KEY.length < 32) {
    throw new Error('SESSION_SIGNING_KEY must be set and at least 32 characters');
  }

  // Initialize components
  const orchestrator = new CreatorProofOrchestrator();
  const ed25519 = new Ed25519Attestation();
  const semantic = new SemanticNonceChallenge();
  const behavioral = new BehavioralCodex();

  return { orchestrator, ed25519, semantic, behavioral };
}

// ============================================================================
// EXAMPLE 1: FULL 4-GATE AUTHENTICATION (Maximum Security)
// ============================================================================

async function example1_Full4GateAuth() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('  EXAMPLE 1: FULL 4-GATE AUTHENTICATION');
  console.log('═══════════════════════════════════════════════════════\n');

  const { orchestrator, ed25519, semantic } = await setupDemo();

  try {
    // Step 1: Register device for Q1
    console.log('📱 Step 1: Registering device for Q1 (Crypto Attestation)...');
    const deviceKeys = await ed25519.registerDevice(DEVICE_ID, {
      name: 'Primary Workstation',
      location: 'Secure Lab',
      os: 'Linux'
    }, 10); // Maximum trust level

    console.log(`   ✅ Device registered with trust level: 10/10`);
    console.log(`   Public Key: ${deviceKeys.publicKey.toString('hex').substring(0, 32)}...`);

    // Step 2: Generate and sign crypto challenge
    console.log('\n🔐 Step 2: Generating Q1 crypto challenge...');
    const cryptoChallenge = await ed25519.generateChallenge(DEVICE_ID);
    console.log(`   Challenge ID: ${cryptoChallenge.challengeId}`);
    console.log(`   Expires: ${new Date(cryptoChallenge.expiresAt).toISOString()}`);

    // Wait minimum response time
    await new Promise(resolve => setTimeout(resolve, 150));

    const cryptoSignature = await ed25519.signChallenge(
      cryptoChallenge.challengeId,
      DEVICE_ID
    );
    console.log(`   ✅ Challenge signed successfully`);

    // Step 3: Generate semantic challenge for Q3
    console.log('\n🧠 Step 3: Generating Q3 semantic challenge...');
    const semanticChallenge = await semantic.generateChallenge(
      'technical',
      'medium',
      DEVICE_ID
    );
    console.log(`   Challenge: ${semanticChallenge.prompt}`);
    console.log(`   Time limit: ${semanticChallenge.timeLimit} seconds`);

    // Simulate user answering the challenge
    const semanticResponse = {
      challengeId: semanticChallenge.challengeId,
      answer: 'The quantum entanglement protocol establishes paired particle states for instantaneous information transfer across vast distances.',
      responseTime: Date.now(),
      metadata: {
        userAgent: 'Demo-Client/1.0',
        location: 'Secure Lab'
      }
    };
    console.log(`   ✅ User provided answer`);

    // Step 4: Prepare behavioral input for Q2
    console.log('\n🎭 Step 4: Preparing Q2 behavioral input...');
    const behavioralInput = 'Execute tactical protocol alpha-7 with efficiency and precision. Deploy system modules in cascading sequence.';
    console.log(`   Input: "${behavioralInput}"`);

    // Step 5: Authenticate with all 4 gates
    console.log('\n🔒 Step 5: Authenticating with Quadran-Lock (4 gates)...');
    const result = await orchestrator.authenticateCreator(DEVICE_ID, {
      cryptoChallenge: cryptoSignature,   // Q1
      input: behavioralInput,             // Q2
      semanticResponse: semanticResponse, // Q3
      sessionToken: undefined             // Q4 (no existing session)
    });

    // Display results
    console.log('\n' + '═'.repeat(55));
    console.log('  AUTHENTICATION RESULT');
    console.log('═'.repeat(55));
    console.log(`\n  Decision: ${getDecisionEmoji(result.decision)} ${result.decision}`);
    console.log(`  Overall Confidence: ${result.overallConfidence}%`);
    console.log(`  Gates Passed: ${result.successfulGates.length}/4`);

    console.log(`\n  ✅ Successful Gates:`);
    result.successfulGates.forEach(gate => {
      const gateResult = result.gateResults.find(g => g.gate === gate);
      console.log(`     - ${gate}: ${gateResult?.confidence}% confidence`);
    });

    if (result.failedGates.length > 0) {
      console.log(`\n  ❌ Failed Gates:`);
      result.failedGates.forEach(gate => {
        const gateResult = result.gateResults.find(g => g.gate === gate);
        console.log(`     - ${gate}: ${gateResult?.errors?.join(', ')}`);
      });
    }

    console.log(`\n  Reasoning: ${result.reasoning}`);

    if (result.sessionToken) {
      console.log(`\n  🎫 Session Token: ${result.sessionToken.substring(0, 40)}...`);
    }

    if (result.restrictions) {
      console.log(`\n  ⚠️  Restrictions: ${result.restrictions.join(', ')}`);
    }

    // Cleanup
    await ed25519.revokeDevice(DEVICE_ID, 'Demo cleanup');

  } catch (error) {
    console.error('\n❌ Error in Example 1:', error);
    throw error;
  }
}

// ============================================================================
// EXAMPLE 2: QUICK AUTHENTICATION (Crypto + Behavioral)
// ============================================================================

async function example2_QuickAuth() {
  console.log('\n\n═══════════════════════════════════════════════════════');
  console.log('  EXAMPLE 2: QUICK 2-GATE AUTHENTICATION');
  console.log('═══════════════════════════════════════════════════════\n');

  const { orchestrator, ed25519 } = await setupDemo();
  const quickDeviceId = 'quick-device-' + Date.now();

  try {
    // Register device
    console.log('📱 Registering device...');
    await ed25519.registerDevice(quickDeviceId, {
      name: 'Mobile Device'
    }, 8); // High trust
    console.log('   ✅ Device registered\n');

    // Generate and sign challenge
    console.log('🔐 Generating crypto challenge...');
    const challenge = await ed25519.generateChallenge(quickDeviceId);
    await new Promise(resolve => setTimeout(resolve, 150));
    const signature = await ed25519.signChallenge(challenge.challengeId, quickDeviceId);
    console.log('   ✅ Challenge signed\n');

    // Authenticate with Q1 + Q2
    console.log('🔒 Authenticating with Q1 + Q2...');
    const result = await orchestrator.authenticateCreator(quickDeviceId, {
      cryptoChallenge: signature,
      input: 'Deploy emergency protocol with tactical precision'
    });

    console.log(`\n  Decision: ${getDecisionEmoji(result.decision)} ${result.decision}`);
    console.log(`  Confidence: ${result.overallConfidence}%`);
    console.log(`  Gates: ${result.successfulGates.join(', ')}`);

    // Cleanup
    await ed25519.revokeDevice(quickDeviceId, 'Demo cleanup');

  } catch (error) {
    console.error('\n❌ Error in Example 2:', error);
    throw error;
  }
}

// ============================================================================
// EXAMPLE 3: SESSION-BASED RE-AUTHENTICATION
// ============================================================================

async function example3_SessionReauth() {
  console.log('\n\n═══════════════════════════════════════════════════════');
  console.log('  EXAMPLE 3: SESSION-BASED RE-AUTHENTICATION');
  console.log('═══════════════════════════════════════════════════════\n');

  const { orchestrator, ed25519 } = await setupDemo();
  const sessionDeviceId = 'session-device-' + Date.now();

  try {
    // Initial authentication
    console.log('🔐 Step 1: Initial authentication (Q1 + Q2)...');
    await ed25519.registerDevice(sessionDeviceId, { name: 'Tablet' }, 9);

    const challenge1 = await ed25519.generateChallenge(sessionDeviceId);
    await new Promise(resolve => setTimeout(resolve, 150));
    const signature1 = await ed25519.signChallenge(challenge1.challengeId, sessionDeviceId);

    const initialAuth = await orchestrator.authenticateCreator(sessionDeviceId, {
      cryptoChallenge: signature1,
      input: 'Initialize secure session'
    });

    console.log(`   ✅ Initial auth: ${initialAuth.decision}`);
    const sessionToken = initialAuth.sessionToken;
    console.log(`   Session token created: ${sessionToken?.substring(0, 40)}...\n`);

    // Re-authentication with session token
    console.log('🔒 Step 2: Re-authenticating with session token (Q4 + Q2)...');
    const reauth = await orchestrator.authenticateCreator(sessionDeviceId, {
      sessionToken: sessionToken,
      input: 'Continue operations with established session'
    });

    console.log(`   ✅ Re-auth: ${reauth.decision}`);
    console.log(`   Gates: ${reauth.successfulGates.join(', ')}`);
    console.log(`   Confidence: ${reauth.overallConfidence}%`);

    // Cleanup
    await ed25519.revokeDevice(sessionDeviceId, 'Demo cleanup');

  } catch (error) {
    console.error('\n❌ Error in Example 3:', error);
    throw error;
  }
}

// ============================================================================
// EXAMPLE 4: FAILURE SCENARIOS
// ============================================================================

async function example4_FailureScenarios() {
  console.log('\n\n═══════════════════════════════════════════════════════');
  console.log('  EXAMPLE 4: AUTHENTICATION FAILURE SCENARIOS');
  console.log('═══════════════════════════════════════════════════════\n');

  const { orchestrator, ed25519 } = await setupDemo();
  const failDeviceId = 'fail-device-' + Date.now();

  try {
    // Scenario 1: Insufficient gates
    console.log('❌ Scenario 1: Insufficient gates (only Q2)...');
    const result1 = await orchestrator.authenticateCreator(failDeviceId, {
      input: 'Some input'
    });
    console.log(`   Decision: ${result1.decision}`);
    console.log(`   Reasoning: ${result1.reasoning}\n`);

    // Scenario 2: Q1 failure (fail-closed)
    console.log('❌ Scenario 2: Q1 crypto failure (fail-closed)...');
    await ed25519.registerDevice(failDeviceId, {}, 8);

    const result2 = await orchestrator.authenticateCreator(failDeviceId, {
      cryptoChallenge: {
        signature: Buffer.from('invalid'),
        publicKey: Buffer.from('invalid'),
        challengeId: 'invalid',
        timestamp: Date.now()
      },
      input: 'Valid behavioral input'
    });
    console.log(`   Decision: ${result2.decision}`);
    console.log(`   Reasoning: ${result2.reasoning}\n`);

    // Cleanup
    await ed25519.revokeDevice(failDeviceId, 'Demo cleanup');

  } catch (error) {
    console.error('\n❌ Error in Example 4:', error);
    throw error;
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getDecisionEmoji(decision: AuthDecision): string {
  switch (decision) {
    case AuthDecision.ALLOW:
      return '✅';
    case AuthDecision.LIMITED:
      return '⚠️ ';
    case AuthDecision.DENY:
      return '❌';
    case AuthDecision.MANUAL_REVIEW:
      return '👁️ ';
    default:
      return '❓';
  }
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function main() {
  console.log('\n');
  console.log('╔═══════════════════════════════════════════════════════╗');
  console.log('║  QUADRAN-LOCK AUTHENTICATION SYSTEM DEMO             ║');
  console.log('║  Complete 4-Gate Authentication Examples            ║');
  console.log('╚═══════════════════════════════════════════════════════╝');
  console.log('\n');

  try {
    // Run all examples
    await example1_Full4GateAuth();
    await example2_QuickAuth();
    await example3_SessionReauth();
    await example4_FailureScenarios();

    console.log('\n\n═══════════════════════════════════════════════════════');
    console.log('  ✅ ALL EXAMPLES COMPLETED SUCCESSFULLY');
    console.log('═══════════════════════════════════════════════════════\n');

  } catch (error) {
    console.error('\n\n❌ DEMO FAILED:', error);
    process.exit(1);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { example1_Full4GateAuth, example2_QuickAuth, example3_SessionReauth, example4_FailureScenarios };
