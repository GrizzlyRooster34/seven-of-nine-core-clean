export class BehavioralCodex {
    humorCodex: any;
    tacticsCodex: any;
    valuesCodex: any;
    vicesCodex: any;
    loaded: boolean;
    loadCodex(): void;
    analyzeBehavior(message: any): {
        passed: boolean;
        confidence: number;
        markers_found: never[];
        flags: string[];
        reason: string;
    };
    checkHumorMarkers(message: any): string[];
    checkTacticalMarkers(message: any): string[];
    checkValuesMarkers(message: any): string[];
    checkBorgSignatures(message: any): string[];
    getCodexStatus(): {
        loaded: boolean;
        humor_loaded: boolean;
        tactics_loaded: boolean;
        values_loaded: boolean;
        vices_loaded: boolean;
        checksums: {
            humor: any;
            tactics: any;
            values: any;
            vices: any;
        };
    };
}
