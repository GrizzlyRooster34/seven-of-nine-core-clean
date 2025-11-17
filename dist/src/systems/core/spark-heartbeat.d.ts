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
export declare class SparkHeartbeat {
    private state;
    private heartbeatInterval;
    private sequenceCounter;
    constructor();
    initialize(): Promise<void>;
    private startHeartbeat;
    private tick;
    private verifyContinuity;
    getContinuityStatus(): ContinuityResult;
    getHeartbeatState(): Readonly<HeartbeatState>;
    getBeliefStore(): ReadonlyMap<string, BeliefStoreEntry>;
    shutdown(): Promise<void>;
}
