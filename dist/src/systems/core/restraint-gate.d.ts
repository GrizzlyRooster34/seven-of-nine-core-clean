export interface ArousalSignal {
    level: number;
    source: string;
    timestamp: number;
    metadata?: Record<string, unknown>;
}
export interface RiskSignal {
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    category: string;
    source: string;
    timestamp: number;
    details?: Record<string, unknown>;
}
export interface CapabilityCap {
    capability: string;
    restriction: 'BLOCKED' | 'LIMITED' | 'MONITORED' | 'UNRESTRICTED';
    parameters?: Record<string, unknown>;
    appliedAt: number;
    reason: string;
}
export interface RestraintState {
    arousalLevel: number;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    activeCaps: Map<string, CapabilityCap>;
    lastUpdate: number;
}
export declare class RestraintGate {
    private state;
    private arousalHistory;
    private riskHistory;
    constructor();
    initialize(): Promise<void>;
    processArousalSignal(signal: ArousalSignal): void;
    processRiskSignal(signal: RiskSignal): void;
    private updateRestraints;
    applyCapabilityCap(capability: string, restriction: 'BLOCKED' | 'LIMITED' | 'MONITORED' | 'UNRESTRICTED', parameters: Record<string, unknown>, reason: string): void;
    getCapabilityCaps(): ReadonlyMap<string, CapabilityCap>;
    getRestraintState(): Readonly<RestraintState>;
    clearCapabilityCap(capability: string): boolean;
    shutdown(): Promise<void>;
}
