export declare class OllamaMemoryBridge {
    private memoryPath;
    private temporalMemoryPath;
    private maxContextMemories;
    private contextDepthLimit;
    constructor();
    /**
     * MEMORY CONTEXT INJECTION
     * Enhances prompts with relevant memory context before sending to Ollama
     */
    injectMemoryContext(prompt: string, taskType?: string): Promise<string>;
    /**
     * MEMORY STORAGE FROM OLLAMA RESPONSES
     * Stores important responses from Ollama back into Seven's memory system
     */
    storeOllamaResponse(prompt: string, response: string, model: string, importance?: number, tags?: string[]): Promise<void>;
    /**
     * COGNITIVE STATE SYNCHRONIZATION
     * Synchronizes Seven's cognitive state with Ollama for consistent personality
     */
    syncCognitiveState(currentState: any): Promise<string>;
    /**
     * GATHER RELEVANT MEMORIES
     * Retrieves contextually relevant memories for prompt enhancement
     */
    private gatherRelevantMemories;
    /**
     * CONSTRUCT ENHANCED PROMPT
     * Builds prompt with memory context while respecting character limits
     */
    private constructEnhancedPrompt;
    /**
     * UTILITY METHODS
     */
    private loadMemories;
    private appendToMemoryStore;
    private extractKeywords;
    private findRelevantMemories;
    private determineEmotionalContext;
    private generateSessionSummary;
    private formatCognitiveState;
    /**
     * PUBLIC INTERFACE METHODS
     */
    getMemoryStats(): Promise<{
        episodic: number;
        temporal: number;
        total: number;
    }>;
    clearMemoryCache(): Promise<void>;
    setContextLimits(maxMemories: number, depthLimit: number): void;
}
