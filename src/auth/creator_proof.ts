/**
 * QUADRANLOCK ORCHESTRATOR - Creator Authentication Proof System
 * Implements 2-of-4 minimum gate evaluation with deny-by-default security
 */

import { Ed25519Attestation, AttestationSignature } from './crypto/ed25519_attest';
import { SemanticNonceChallenge, SemanticResponse } from './challenge/semanticNonce';
import { BehavioralCodex } from './behavioral/behavioralCodex';
import { SessionIntegrity } from './session/sessionIntegrity';
import fs from 'fs';
import path from 'path';

export enum AuthGate {
  Q1_CRYPTO_ATTESTATION = 'crypto_attestation',
  Q2_BEHAVIORAL_CODEX = 'behavioral_codex', 
  Q3_SEMANTIC_NONCE = 'semantic_nonce',
  Q4_SESSION_INTEGRITY = 'session_integrity'
}

export enum AuthDecision {
  ALLOW = 'ALLOW',
  LIMITED = 'LIMITED', 
  DENY = 'DENY',
  MANUAL_REVIEW = 'MANUAL_REVIEW'
}

export interface GateResult {
  gate: AuthGate;
  success: boolean;
  confidence: number; // 0-100
  evidence: any;
  processingTime: number;
  errors?: string[];
}

export interface AuthenticationResult {
  decision: AuthDecision;
  gateResults: GateResult[];
  overallConfidence: number;
  requiredGates: AuthGate[];
  successfulGates: AuthGate[];
  failedGates: AuthGate[];
  reasoning: string;
  sessionToken?: string;
  restrictions?: string[];
}

// Define the structure of the auth request object
export interface AuthRequest {
  type?: string;
  input?: string; // For Behavioral Codex
  cryptoChallenge?: AttestationSignature; // For Crypto Attestation
  semanticResponse?: SemanticResponse; // For Semantic Nonce
  sessionToken?: string; // For Session Integrity
}

export class CreatorProofOrchestrator {
  private ed25519: Ed25519Attestation;
  private semanticNonce: SemanticNonceChallenge;
  private behavioralCodex: BehavioralCodex;
  private sessionIntegrity: SessionIntegrity;

  // Security thresholds
  private readonly TAU_HIGH = 85;
  private readonly TAU_MEDIUM = 70;
  private readonly MIN_GATES_REQUIRED = 2;
  private readonly MAX_AUTHENTICATION_TIME_MS = 30000; // 30 seconds

  constructor() {
    this.ed25519 = new Ed25519Attestation();
    this.semanticNonce = new SemanticNonceChallenge();
    this.behavioralCodex = new BehavioralCodex();
    this.sessionIntegrity = new SessionIntegrity();
  }

  public async authenticateCreator(
    deviceId: string,
    authRequest: AuthRequest,
    context?: any
  ): Promise<AuthenticationResult> {
    const startTime = Date.now();
    const gateResults: GateResult[] = [];

    try {
      console.log('🔐 Quadranlock: Initiating Creator authentication');
      const gatePromises = [
        this.executeGate(AuthGate.Q1_CRYPTO_ATTESTATION, deviceId, authRequest, context),
        this.executeGate(AuthGate.Q2_BEHAVIORAL_CODEX, deviceId, authRequest, context),
        this.executeGate(AuthGate.Q3_SEMANTIC_NONCE, deviceId, authRequest, context),
        this.executeGate(AuthGate.Q4_SESSION_INTEGRITY, deviceId, authRequest, context)
      ];

      const results = await Promise.allSettled(gatePromises);

      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        const gate = Object.values(AuthGate)[i];
        if (result.status === 'fulfilled') {
          gateResults.push(result.value);
        } else {
          gateResults.push({
            gate,
            success: false,
            confidence: 0,
            evidence: null,
            processingTime: Date.now() - startTime,
            errors: [result.reason?.message || 'Gate execution failed']
          });
        }
      }

      const authResult = this.evaluateQuadranlock(gateResults, deviceId);
      await this.logAuthenticationAttempt(deviceId, authRequest, authResult);
      console.log(`🔐 Quadranlock: Authentication complete. Decision: ${authResult.decision}`);
      return authResult;

    } catch (error: any) {
      console.error('🚨 Quadranlock: Authentication system error:', error);
      return {
        decision: AuthDecision.DENY,
        gateResults,
        overallConfidence: 0,
        requiredGates: [],
        successfulGates: [],
        failedGates: Object.values(AuthGate),
        reasoning: 'System error - failing closed for security',
        restrictions: ['EMERGENCY_LOCKDOWN']
      };
    }
  }

  private evaluateQuadranlock(gateResults: GateResult[], deviceId: string): AuthenticationResult {
    const successfulGates = gateResults.filter(r => r.success).map(r => r.gate);
    const failedGates = gateResults.filter(r => !r.success).map(r => r.gate);
    const cryptoGate = gateResults.find(r => r.gate === AuthGate.Q1_CRYPTO_ATTESTATION);
    const behavioralGate = gateResults.find(r => r.gate === AuthGate.Q2_BEHAVIORAL_CODEX);
    const semanticGate = gateResults.find(r => r.gate === AuthGate.Q3_SEMANTIC_NONCE);
    const identitySuccesses = gateResults.filter(r => r.gate !== AuthGate.Q4_SESSION_INTEGRITY && r.success);

    const overallConfidence = identitySuccesses.length > 0
      ? Math.round(identitySuccesses.reduce((s, r) => s + r.confidence, 0) / identitySuccesses.length)
      : 0;

    // Rule 1: Fast-path ALLOW if Q1 + (Q2 or Q3) succeed with high confidence
    if (cryptoGate?.success && (behavioralGate?.success || semanticGate?.success) && overallConfidence >= this.TAU_MEDIUM) {
      return this.createAuthResult(AuthDecision.ALLOW, 'Fast-path: Crypto attestation + additional factor success', gateResults, deviceId);
    }

    // Rule 2: MANUAL_REVIEW if no crypto but both Q2 and Q3 succeed with high confidence
    if (!cryptoGate?.success && behavioralGate?.success && semanticGate?.success && overallConfidence >= this.TAU_HIGH) {
        return this.createAuthResult(AuthDecision.MANUAL_REVIEW, 'No crypto - behavioral + semantic success, manual review required', gateResults, deviceId, ['MANUAL_APPROVAL_REQUIRED']);
    }

    // Rule 3: DENY if crypto fails (fail-closed)
    if (cryptoGate && !cryptoGate.success) {
        return this.createAuthResult(AuthDecision.DENY, 'Deny: Cryptographic attestation (Q1) failed.', gateResults, deviceId, ['ACCESS_DENIED', 'SECURITY_ALERT']);
    }

    // Rule 4: DENY if fewer than 2 identity gates pass
    if (identitySuccesses.length < this.MIN_GATES_REQUIRED) {
        return this.createAuthResult(AuthDecision.DENY, `Deny: Insufficient gates passed (${identitySuccesses.length}/${this.MIN_GATES_REQUIRED} required).`, gateResults, deviceId, ['ACCESS_DENIED']);
    }

    // Default DENY for any other unhandled case
    return this.createAuthResult(AuthDecision.DENY, 'Default deny - unexpected authentication state.', gateResults, deviceId, ['ACCESS_DENIED', 'CONFIGURATION_ERROR']);
  }

  private async executeGate(gate: AuthGate, deviceId: string, authRequest: AuthRequest, context?: any): Promise<GateResult> {
    const startTime = Date.now();
    try {
      let result: any;
      switch (gate) {
        case AuthGate.Q1_CRYPTO_ATTESTATION:
          result = authRequest.cryptoChallenge ? await this.ed25519.validateAttestation(deviceId, authRequest.cryptoChallenge) : { success: false, confidence: 0, errors: ['Missing cryptoChallenge'] };
          break;
        case AuthGate.Q2_BEHAVIORAL_CODEX:
          result = authRequest.input ? this.behavioralCodex.analyzeBehavior(authRequest.input) : { success: false, confidence: 0, errors: ['Missing input for behavioral analysis'] };
          break;
        case AuthGate.Q3_SEMANTIC_NONCE:
          result = authRequest.semanticResponse ? await this.semanticNonce.validateResponse(authRequest.semanticResponse) : { success: false, confidence: 0, errors: ['Missing semanticResponse'] };
          break;
        case AuthGate.Q4_SESSION_INTEGRITY:
          result = authRequest.sessionToken ? await this.sessionIntegrity.validateSession(authRequest.sessionToken, deviceId) : { success: false, confidence: 0, evidence: { reason: 'missing' } };
          break;
        default:
          throw new Error(`Unknown gate: ${gate}`);
      }
      return { gate, success: result.success, confidence: result.confidence || 0, evidence: result.evidence, processingTime: Date.now() - startTime, errors: result.errors };
    } catch (error: any) {
      return { gate, success: false, confidence: 0, evidence: null, processingTime: Date.now() - startTime, errors: [error.message] };
    }
  }
  
  private createAuthResult(decision: AuthDecision, reasoning: string, gateResults: GateResult[], deviceId: string, restrictions?: string[]): AuthenticationResult {
      const successfulGates = gateResults.filter(r => r.success).map(r => r.gate);
      const failedGates = gateResults.filter(r => !r.success).map(r => r.gate);
      const overallConfidence = successfulGates.length > 0 ? Math.round(gateResults.filter(r=>r.success).reduce((s, r) => s + r.confidence, 0) / successfulGates.length) : 0;
      
      let sessionToken: string | undefined = undefined;
      if (decision === AuthDecision.ALLOW || decision === AuthDecision.LIMITED) {
          sessionToken = this.generateSessionToken(deviceId, successfulGates, decision);
      }

      return {
          decision,
          gateResults,
          overallConfidence,
          requiredGates: [], // This could be dynamically determined
          successfulGates,
          failedGates,
          reasoning,
          sessionToken,
          restrictions
      };
  }

  private generateSessionToken(deviceId: string, successfulGates: AuthGate[], accessLevel: string): string {
    const key = process.env.SESSION_SIGNING_KEY;
    if (!key || key.length < 32) { throw new Error('SESSION_SIGNING_KEY missing or too weak.'); }
    const sessionData = {
      deviceId,
      gates: successfulGates,
      accessLevel,
      timestamp: Date.now(),
      nonce: crypto.randomBytes(16).toString('hex')
    };
    const payload = Buffer.from(JSON.stringify(sessionData)).toString('base64url');
    const signature = crypto.createHmac('sha256', key).update(payload).digest('hex');
    return `${payload}.${signature}`;
  }

  private async logAuthenticationAttempt(deviceId: string, authRequest: AuthRequest, result: AuthenticationResult): Promise<void> {
    const logEntry = {
      timestamp: new Date().toISOString(),
      deviceId: deviceId.substring(0, 8) + '...',
      decision: result.decision,
      overallConfidence: result.overallConfidence,
      successfulGates: result.successfulGates,
      failedGates: result.failedGates,
    };
    console.log('🔐 Quadranlock Audit:', JSON.stringify(logEntry, null, 2));
  }
}

export default CreatorProofOrchestrator;
