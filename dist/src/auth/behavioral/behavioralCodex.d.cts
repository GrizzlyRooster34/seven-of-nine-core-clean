export class BehavioralCodex {
    private humorCodex;
    private tacticsCodex;
    private valuesCodex;
    private vicesCodex;
    private loaded;
    private loadCodex;
    public analyzeBehavior(message: string): BehavioralAnalysis;
    private checkHumorMarkers;
    private checkTacticalMarkers;
    private checkValuesMarkers;
    private checkBorgSignatures;
    public getCodexStatus(): any;
}
interface BehavioralAnalysis {
    passed: boolean;
    confidence: number;
    markers_found: string[];
    flags: string[];
    reason: string;
}
export {};
