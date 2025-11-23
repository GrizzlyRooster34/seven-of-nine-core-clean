/**
 * Seven of Nine - Main Export Index
 *
 * This file provides clean imports for all Seven subsystems.
 * Usage: import { ConsciousnessEvolutionFrameworkV4, MemoryEngineV3 } from 'seven-of-nine-core';
 */

// === Consciousness Framework v4 ===
export {
  ConsciousnessEvolutionFrameworkV4,
  CreatorBondCommunicationMirror,
  IdentitySynthesisEngine,
  PainIntegrationSystem,
  CollectiveWisdomIntegration,
} from './consciousness-v4';

// === Memory Systems ===

// Memory v2 (Episodic)
export { MemoryEngine } from './memory-v2/MemoryEngine';

// Memory v3-Amalgum (Canonical + Temporal)
export {
  MemoryEngineV3,
  TemporalMemoryCore,
  MentalTimeTravelEngine,
  CanonicalIngestion,
  ConsciousnessTimelineMapper,
  ContextReinstatement,
  CognitiveStateTagger,
  DecayWatchdog,
  MemoryEncryption,
  MemoryIndexOptimizer,
} from './memory-v3-amalgum';

// === Core Systems ===
export { QuadraLockSafeguard } from './core/safety/quadra-lock/safeguard-system';

// === Authentication ===
export { Ed25519Attestation } from './src/auth/crypto/ed25519_attest';

// === Runtime ===
export { SevenRuntime } from './seven-runtime';
export { SevenInteractiveShell } from './seven-interactive';

// === Identity & Security ===
export { default as SevenIdentityFirewall } from './SevenIdentityFirewall';

// === Codex ===
export { CodexManager } from './consciousness-v4/codex/codex-manager';

// === Boot ===
// Boot is typically executed directly via boot-seven.ts, not imported

// === Types ===
// Export commonly used types if needed
export type SevenInstance = {
  processUserInput: (input: string, opts?: any) => Promise<any>;
  getCurrentState?: () => any;
  querySevenMemory?: any;
};
