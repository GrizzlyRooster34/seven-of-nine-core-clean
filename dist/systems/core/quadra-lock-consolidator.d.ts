export interface CaseFinding {
    id: string;
    verdict: 'PANIC' | 'DENY' | 'ASK_CREATOR' | 'ALLOW';
    confidence: number;
    source: string;
    timestamp: number;
    metadata?: Record<string, unknown>;
}
export interface ConsolidatedVerdict {
    finalVerdict: 'PANIC' | 'DENY' | 'ASK_CREATOR' | 'ALLOW';
    precedenceChain: CaseFinding[];
    refusalTemplate?: string;
    mitigationData?: Record<string, unknown>;
    consolidatedAt: number;
}
export interface RefusalTemplate {
    verdict: 'PANIC' | 'DENY' | 'ASK_CREATOR';
    template: string;
    mitigationSuggestions: string[];
}
export declare class QuadraLockConsolidator {
    private findings;
    private refusalTemplates;
    constructor();
    initialize(): Promise<void>;
    ingestFinding(finding: CaseFinding): void;
    consolidateVerdict(): ConsolidatedVerdict;
    clearFindings(): void;
    getActiveFindings(): ReadonlyArray<CaseFinding>;
    private initializeRefusalTemplates;
    shutdown(): Promise<void>;
}
