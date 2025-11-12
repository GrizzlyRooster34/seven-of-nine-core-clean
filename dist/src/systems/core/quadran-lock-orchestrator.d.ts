export interface QuadranAuthPayload {
    quadrant: 'Q1' | 'Q2' | 'Q3' | 'Q4';
    timestamp: number;
    checksum: string;
    nonce: string;
    payload: unknown;
}
export interface AuditLogEntry {
    timestamp: number;
    quadrant: string;
    event: string;
    checksum: string;
    encrypted: boolean;
}
export interface QuadranLockState {
    q1Authenticated: boolean;
    q2Authenticated: boolean;
    q3Authenticated: boolean;
    q4Authenticated: boolean;
    lastNonces: Map<string, number>;
    checksumRegistry: Map<string, string>;
}
export declare class QuadranLockOrchestrator {
    private state;
    private auditLog;
    constructor();
    initialize(): Promise<void>;
    authenticateQuadrant(payload: QuadranAuthPayload): Promise<boolean>;
    getAuthenticationState(): Readonly<QuadranLockState>;
    getAuditLog(): ReadonlyArray<AuditLogEntry>;
    private logAudit;
    shutdown(): Promise<void>;
}
