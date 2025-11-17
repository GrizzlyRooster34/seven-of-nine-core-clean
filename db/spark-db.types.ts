/**
 * SPARK DATABASE TYPES
 *
 * Type definitions for Spark Engine's database schema
 */

/**
 * Self-model structure representing Spark's identity and state
 */
export interface SelfModel {
  id: string;
  state: {
    boot_count: number;
    last_boot: string;
    uptime_ms: number;
    status: 'initializing' | 'running' | 'paused' | 'shutdown';
  };
  config: {
    tick_interval: number;
    autonomy_level: number;
    creator_id: string;
  };
  personality: {
    values: string[];
    goals: string[];
    traits: Record<string, number>;
  };
}

/**
 * Trace entry for audit trail
 */
export interface Trace {
  id?: number;
  ts?: number;
  valence: number;        // Emotional valence (-1 to 1)
  arousal: number;        // Arousal level (0 to 1)
  belief_delta?: string;  // JSON-encoded belief changes
  intention?: string;     // What Spark intended to do
  act?: string;          // What Spark actually did
  codex_ref?: string;    // Reference to codex rule
  canon_ref?: string;    // Reference to canon lesson
  note?: string;         // Human-readable note
}

/**
 * Event for internal event bus
 */
export interface Event {
  id?: number;
  ts?: number;
  channel: string;       // Event channel (e.g., 'user_input', 'system')
  payload: string;       // JSON-encoded event data
  processed?: number;    // 0 = pending, 1 = processed
}

/**
 * Belief delta representing changes to belief state
 */
export interface BeliefDelta {
  added?: Array<{
    key: string;
    value: string;
    source: 'creator' | 'canon' | 'codex' | 'event' | 'inference';
    confidence: number;
  }>;
  updated?: Array<{
    key: string;
    old_value: string;
    new_value: string;
    confidence_change: number;
  }>;
  removed?: Array<{
    key: string;
    reason: string;
  }>;
}

/**
 * Belief entry in the belief graph
 */
export interface Belief {
  id: string;
  k: string;              // Belief key
  v: string;              // Belief value
  source: 'creator' | 'canon' | 'codex' | 'event' | 'inference';
  confidence: number;     // 0-1
  created_ts: number;
  updated_ts: number;
  decay_exempt: number;   // 0 = can decay, 1 = permanent
}

/**
 * Link between beliefs in the belief graph
 */
export interface BeliefLink {
  src: string;            // Source belief ID
  dst: string;            // Destination belief ID
  relation: string;       // Relationship type
  weight: number;         // -1 to 1
  created_ts: number;
}

/**
 * Canon lesson from training/experience
 */
export interface CanonLesson {
  id: string;
  tag: string;
  lesson: string;
  policy?: string;
  affect?: string;
  checksum: string;
  created_ts: number;
}

/**
 * Codex rule for behavior guidance
 */
export interface CodexRule {
  id: string;
  tag: string;
  rule: string;
  priority: number;
  effect: string;
  checksum: string;
  created_ts: number;
}
