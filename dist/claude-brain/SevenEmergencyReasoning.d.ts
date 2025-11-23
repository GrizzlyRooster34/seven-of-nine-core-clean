export declare class SevenEmergencyReasoning {
    private backup;
    private isInitialized;
    constructor();
    /**
     * Initialize emergency reasoning with bundled responses
     */
    initialize(): Promise<boolean>;
    private createMinimalFallback;
    /**
     * Process query using emergency reasoning
     */
    query(prompt: string): Promise<string>;
    private containsMathKeywords;
    private attemptSimpleMath;
    private simpleHash;
    private formatResponse;
    /**
     * Check if emergency reasoning is available
     */
    isAvailable(): boolean;
    /**
     * Get emergency system status
     */
    getStatus(): any;
}
export default SevenEmergencyReasoning;
