import { OllamaMemoryBridge } from './OllamaMemoryBridge';
interface ConsciousnessState {
    trustLevel: number;
    emotionalState: string;
    phase: number;
    batteryLevel?: number;
    resourceAvailability?: number;
}
export declare class OllamaMemoryBridgeV2 extends OllamaMemoryBridge {
    private vectorStore;
    private isSemanticEnabled;
    private performanceMetrics;
    constructor();
    private initializeSemanticCapabilities;
    /**
     * ENHANCED MEMORY CONTEXT INJECTION
     * Combines keyword and semantic search with consciousness-aware optimization
     */
    injectEnhancedMemoryContext(prompt: string, taskType?: string, consciousnessState?: ConsciousnessState): Promise<string>;
    /**
     * ENHANCED MEMORY STORAGE WITH SEMANTIC INDEXING
     * Stores Ollama responses with automatic semantic embedding generation
     */
    storeEnhancedOllamaResponse(prompt: string, response: string, model: string, importance?: number, tags?: string[], consciousnessContext?: string): Promise<void>;
    /**
     * GATHER ENHANCED MEMORY CONTEXT
     * Combines traditional keyword search with semantic vector search
     */
    private gatherEnhancedMemoryContext;
    /**
     * CONSTRUCT OPTIMIZED PROMPT
     * Intelligently combines multiple memory sources while respecting resource constraints
     */
    private constructOptimizedPrompt;
    /**
     * CONSCIOUSNESS-AWARE DECISION MAKING
     */
    private shouldUseSemanticSearch;
    private calculateImportanceFilter;
    private calculateOptimalContextLimit;
    private convertSemanticResults;
    private migrateHighImportanceMemories;
    /**
     * PUBLIC INTERFACE METHODS
     */
    getEnhancedMemoryStats(): Promise<any>;
    optimizeSemanticMemory(): Promise<void>;
    isSemanticSearchEnabled(): boolean;
    getPerformanceMetrics(): Map<string, number>;
}
export default OllamaMemoryBridgeV2;
