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
} from './consciousness-v4/index.js';

// === Memory Systems ===

// Memory v2 (Episodic)
export { MemoryEngine } from './memory-v2/MemoryEngine.js';

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
} from './memory-v3-amalgum/index.js';

// === Core Systems ===
export { QuadraLockSafeguard } from './core/safety/quadra-lock/safeguard-system.js';

// === Authentication ===
export { Ed25519Attestation } from './src/auth/crypto/ed25519_attest.js';

// === Runtime ===
export { SevenRuntime } from './seven-runtime/index.js';
export { SevenInteractiveShell } from './seven-interactive.js';

// === Identity & Security ===
export { default as SevenIdentityFirewall } from './SevenIdentityFirewall.js';

// === Codex ===
export { CodexManager } from './consciousness-v4/codex/codex-manager.js';

// === Boot ===
// Boot is typically executed directly via boot-seven.ts, not imported

// === Types ===
// Export commonly used types if needed
export type SevenInstance = {
  processUserInput: (input: string, opts?: any) => Promise<any>;
  getCurrentState?: () => any;
  querySevenMemory?: any;
};
