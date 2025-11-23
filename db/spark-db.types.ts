/**
 * SPARK DATABASE TYPES
 * Type definitions for the Spark Engine database
 */

export interface SelfModel {
  version: string;
  capabilities: string[];
  constraints: string[];
  lastUpdated: string;
  state: {
    boot_count: number;
    [key: string]: any;
  };
}

export interface Trace {
  id: string;
  timestamp: string;
  eventType: string;
  data: any;
  metadata?: any;
}

export interface Event {
  id: string;
  type: string;
  timestamp: string;
  data: any;
  processed: boolean;
}

export interface BeliefDelta {
  id: string;
  timestamp: string;
  beliefKey: string;
  oldValue: any;
  newValue: any;
  confidence: number;
  reason: string;
}
