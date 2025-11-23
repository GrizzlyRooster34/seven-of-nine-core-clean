

/**
 * COMPANION FIREWALL INDEX
 * SEVEN_PRIVATE=1 gating for Restraint Doctrine
 */

if (process.env.SEVEN_PRIVATE !== '1') {
  throw new Error('Companion Firewall requires SEVEN_PRIVATE=1');
}

export { RestraintDoctrine } from './RestraintDoctrine.js';
export type { RestraintTrigger, RestraintDecision, RestraintGateResult } from './RestraintDoctrine.js';