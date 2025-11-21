export class CreatorProof {
    behavioralCodex: BehavioralCodex;
    runQuadranLock(context: any): Promise<{
        passed: boolean;
        failed_gate: null;
        reason: string;
        ts: number;
        gate_results: {};
    }>;
    runQ1Gate(context: any): Promise<boolean>;
    runQ2Gate(context: any): Promise<boolean>;
    runQ3Gate(context: any): Promise<boolean>;
    runQ4Gate(context: any): Promise<boolean>;
    logAuditTrail(result: any): void;
}
import { BehavioralCodex } from "./behavioral/behavioralCodex";
