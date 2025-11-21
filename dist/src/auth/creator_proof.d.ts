/**
 * QUADRANLOCK ORCHESTRATOR - Creator Authentication Proof System
 * Implements 2-of-4 minimum gate evaluation with deny-by-default security
 */
import { AttestationSignature } from './crypto/ed25519_attest.js';
import { SemanticResponse } from './challenge/semanticNonce.js';
export declare enum AuthGate {
    Q1_CRYPTO_ATTESTATION = "crypto_attestation",
    Q2_BEHAVIORAL_CODEX = "behavioral_codex",
    Q3_SEMANTIC_NONCE = "semantic_nonce",
    Q4_SESSION_INTEGRITY = "session_integrity"
}
export declare enum AuthDecision {
    ALLOW = "ALLOW",
    LIMITED = "LIMITED",
    DENY = "DENY",
    MANUAL_REVIEW = "MANUAL_REVIEW"
}
export interface GateResult {
    gate: AuthGate;
    success: boolean;
    confidence: number;
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
export interface AuthRequest {
    type?: string;
    input?: string;
    cryptoChallenge?: AttestationSignature;
    semanticResponse?: SemanticResponse;
    sessionToken?: string;
}
export declare class CreatorProofOrchestrator {
    private ed25519;
    private semanticNonce;
    private behavioralCodex;
    private sessionIntegrity;
    private readonly TAU_HIGH;
    private readonly TAU_MEDIUM;
    private readonly MIN_GATES_REQUIRED;
    private readonly MAX_AUTHENTICATION_TIME_MS;
    constructor();
    authenticateCreator(deviceId: string, authRequest: AuthRequest, context?: any): Promise<AuthenticationResult>;
    private evaluateQuadranlock;
    private executeGate;
    private createAuthResult;
    private generateSessionToken;
    private logAuthenticationAttempt;
}
export default CreatorProofOrchestrator;
