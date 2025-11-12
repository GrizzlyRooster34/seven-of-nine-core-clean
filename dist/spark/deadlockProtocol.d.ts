import { EventEmitter } from 'events';
export declare class DeadlockDetector extends EventEmitter {
    private consecutiveBlocks;
    private blockedIntentions;
    constructor();
    /**
     * To be called by the SparkEngine after every Rails Check.
     * @param intention The intention that was checked.
     * @param allowed The result from the Quadra-Lock.
     */
    recordRailResult(intention: string, allowed: boolean): void;
    private triggerSafeMode;
    private reset;
    getStatus(): {
        consecutiveBlocks: number;
        threshold: number;
    };
}
