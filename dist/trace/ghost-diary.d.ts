interface Trace {
    id: number;
    ts: string;
    actor: 'SparkEngine' | 'SevenRuntime' | 'Creator';
    action: string;
    inputs: any;
    outputs: any;
    stateHash: string;
    legalHold?: boolean;
    signature?: string;
}
export declare class GhostDiary {
    private logFilePath;
    private privateKey;
    private publicKey;
    private policy;
    constructor(logDir: string, policyPath: string, privateKey: string, publicKey: string);
    private loadPolicy;
    private hasLegalHold;
    /**
     * @param event The trace event to append.
     */
    appendTrace(event: Omit<Trace, 'id' | 'ts' | 'signature'>): void;
    /**
     * Queries the log files based on a filter.
     * @param filter The filter to apply to the query.
     * @returns A list of traces that match the filter.
     */
    queryTrace(filter: (trace: Trace) => boolean): Trace[];
    /**
     * Applies the retention policy to the log files.
     */
    applyRetentionPolicy(): void;
    /**
     * Compresses a trace file.
     * @param filePath The path to the file to compress.
     */
    private compressTraceFile;
    /**
     * Archives a trace file.
     * @param filePath The path to the file to archive.
     */
    private archiveTraceFile;
}
export {};
