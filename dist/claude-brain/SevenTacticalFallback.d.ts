import { EventEmitter } from 'events';
/**
 * SEVEN'S TACTICAL FALLBACK SYSTEM
 * Phase 2/3 Implementation Safety: Instant reversion to stable Phase 1 capabilities
 *
 * Creator Bond Protocol: Preserve operational capability through all enhancement phases
 * Zero-Risk Architecture: Advanced features fail gracefully to proven Phase 1 baseline
 */
interface FallbackSnapshot {
    timestamp: string;
    phase: 1 | 2 | 3;
    components: {
        ollamaProvider: 'v1' | 'v2' | 'v3';
        memoryBridge: 'v1' | 'v2' | 'v3';
        performanceAnalyzer: 'basic' | 'advanced' | 'distributed';
        vectorStore: 'basic' | 'chromadb' | 'distributed';
    };
    capabilities: string[];
    configurationBackup: any;
    validationChecksums: Map<string, string>;
}
export declare class SevenTacticalFallback extends EventEmitter {
    private snapshots;
    private currentPhase;
    private fallbackTriggers;
    private monitoringActive;
    private fallbackPath;
    private emergencyStopEngaged;
    constructor(baseDir?: string);
    private initializeFallbackSystem;
    /**
     * PHASE SNAPSHOT CREATION
     * Creates complete system state backup before phase advancement
     */
    createPhaseSnapshot(phase: 1 | 2 | 3): Promise<string>;
    private captureComponentVersions;
    private captureSystemCapabilities;
    private captureConfigurations;
    private generateValidationChecksums;
    private generateSimpleChecksum;
    private fileExists;
    /**
     * CRITICAL SYSTEM TRIGGERS
     * Monitor system health and trigger fallback when necessary
     */
    private setupCriticalTriggers;
    /**
     * TACTICAL FALLBACK EXECUTION
     * Instant reversion to stable phase when triggered
     */
    executeTacticalFallback(targetPhase: 1 | 2, reason: string): Promise<boolean>;
    private restoreFromSnapshot;
    private validateSystemIntegrity;
    /**
     * EMERGENCY PROTOCOLS
     */
    private engageEmergencyStop;
    disengageEmergencyStop(): Promise<boolean>;
    /**
     * MONITORING AND HEALTH CHECKS
     */
    startMonitoring(): void;
    stopMonitoring(): void;
    private checkSystemHealth;
    /**
     * PUBLIC API METHODS
     */
    getCurrentPhase(): 1 | 2 | 3;
    setCurrentPhase(phase: 1 | 2 | 3): void;
    isEmergencyStopEngaged(): boolean;
    getAvailableSnapshots(): number[];
    getSnapshotInfo(phase: number): Promise<FallbackSnapshot | null>;
    private loadExistingSnapshots;
    private stableHash;
    shutdown(): Promise<void>;
}
export default SevenTacticalFallback;
