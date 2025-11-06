import 'reflect-metadata';
export declare class SevenOfNineCore {
    private orchestrator;
    private consolidator;
    private restraintGate;
    private heartbeat;
    private skillLoader;
    private sandbox;
    constructor();
    initialize(): Promise<void>;
    shutdown(): Promise<void>;
}
export * from './systems/core/quadran-lock-orchestrator.js';
export * from './systems/core/quadra-lock-consolidator.js';
export * from './systems/core/restraint-gate.js';
export * from './systems/core/spark-heartbeat.js';
