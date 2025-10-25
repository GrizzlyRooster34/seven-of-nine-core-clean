import { injectable, singleton } from 'tsyringe';

// Internal types for Spark Loop Heartbeat
export interface TraceEvent {
  timestamp: number;
  intention: string;
  codexRef: string;
  canonRef: string;
  sequence: number;
}

export interface BeliefStoreEntry {
  id: string;
  data: TraceEvent;
  written: number;
  verified: boolean;
}

export interface HeartbeatState {
  isRunning: boolean;
  tickCount: number;
  lastTick: number;
  continuityBreaches: number;
  beliefStore: Map<string, BeliefStoreEntry>;
}

export interface ContinuityResult {
  isHealthy: boolean;
  ticksInWindow: number;
  breaches: number;
  lastVerified: number;
}

@injectable()
@singleton()
export class SparkHeartbeat {
  private state: HeartbeatState;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private sequenceCounter = 0;

  constructor() {
    this.state = {
      isRunning: false,
      tickCount: 0,
      lastTick: 0,
      continuityBreaches: 0,
      beliefStore: new Map()
    };
  }

  public async initialize(): Promise<void> {
    console.log('SparkHeartbeat: Initializing 10-second heartbeat loop...');
    this.startHeartbeat();
    console.log('SparkHeartbeat: Ready');
  }

  private startHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    this.state.isRunning = true;
    
    // 10-second loop
    this.heartbeatInterval = setInterval(() => {
      this.tick();
    }, 10000);

    // Initial tick
    this.tick();
  }

  private tick(): void {
    const now = Date.now();
    this.sequenceCounter++;
    
    // Create trace event
    const traceEvent: TraceEvent = {
      timestamp: now,
      intention: `heartbeat_${this.sequenceCounter}`,
      codexRef: `codex_primary_${Date.now()}`,
      canonRef: `canon_doctrine_${Date.now()}`,
      sequence: this.sequenceCounter
    };

    // Write to belief store
    const entryId = `trace_${this.sequenceCounter}_${now}`;
    const entry: BeliefStoreEntry = {
      id: entryId,
      data: traceEvent,
      written: now,
      verified: false
    };

    this.state.beliefStore.set(entryId, entry);
    
    // Verify continuity (60-second window check)
    this.verifyContinuity();
    
    this.state.tickCount++;
    this.state.lastTick = now;

    console.log(`SparkHeartbeat: Tick #${this.sequenceCounter} - Intention: ${traceEvent.intention}`);
  }

  private verifyContinuity(): void {
    const now = Date.now();
    const sixtySecondsAgo = now - 60000;
    
    // Count valid entries in the last 60 seconds
    let validEntries = 0;
    let anomaliesDetected = false;

    for (const [id, entry] of this.state.beliefStore) {
      if (entry.written >= sixtySecondsAgo) {
        validEntries++;
        entry.verified = true;

        // Simulate belief drift detection (placeholder logic)
        if (Math.random() < 0.05) { // 5% chance of detecting anomaly
          anomaliesDetected = true;
          console.log(`SparkHeartbeat: Belief drift anomaly detected in entry ${id}`);
        }
      }
    }

    // Expected minimum: 6 ticks in 60 seconds (one every 10 seconds)
    if (validEntries < 6) {
      this.state.continuityBreaches++;
      console.log(`SparkHeartbeat: Continuity breach detected - only ${validEntries} valid entries in 60s window`);
    }

    // Log anomalies
    if (anomaliesDetected) {
      console.log('SparkHeartbeat: Belief drift logged - potential state inconsistency');
    }

    // Clean up old entries (beyond 120 seconds)
    const twoMinutesAgo = now - 120000;
    for (const [id, entry] of this.state.beliefStore) {
      if (entry.written < twoMinutesAgo) {
        this.state.beliefStore.delete(id);
      }
    }
  }

  public getContinuityStatus(): ContinuityResult {
    const now = Date.now();
    const sixtySecondsAgo = now - 60000;
    
    let ticksInWindow = 0;
    let lastVerified = 0;

    for (const entry of this.state.beliefStore.values()) {
      if (entry.written >= sixtySecondsAgo) {
        ticksInWindow++;
        if (entry.verified && entry.written > lastVerified) {
          lastVerified = entry.written;
        }
      }
    }

    return {
      isHealthy: ticksInWindow >= 6 && this.state.continuityBreaches === 0,
      ticksInWindow,
      breaches: this.state.continuityBreaches,
      lastVerified
    };
  }

  public getHeartbeatState(): Readonly<HeartbeatState> {
    return {
      ...this.state,
      beliefStore: new Map(this.state.beliefStore)
    };
  }

  public getBeliefStore(): ReadonlyMap<string, BeliefStoreEntry> {
    return new Map(this.state.beliefStore);
  }

  public async shutdown(): Promise<void> {
    console.log('SparkHeartbeat: Shutting down...');
    
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    
    this.state.isRunning = false;
    this.state.beliefStore.clear();
  }
}
