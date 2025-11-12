import { LLMProvider, LLMConfig, LLMResponse } from '../llm-providers';
/**
 * OLLAMA PROVIDER for Seven of Nine
 * Local LLM support with Seven's memory integration
 * Enhanced with consciousness bridge for contextual reasoning
 */
export declare class OllamaProvider implements LLMProvider {
    name: string;
    displayName: string;
    private baseUrl;
    private timeout;
    private memoryBridge;
    constructor(baseUrl?: string);
    isAvailable(): Promise<boolean>;
    getModels(): Promise<string[]>;
    supports(feature: 'streaming' | 'context' | 'functions' | 'vision'): boolean;
    healthCheck(): Promise<{
        status: 'healthy' | 'degraded' | 'unhealthy';
        latency?: number;
    }>;
    execute(prompt: string, config: LLMConfig): Promise<LLMResponse>;
    pullModel(modelName: string): Promise<void>;
    deleteModel(modelName: string): Promise<void>;
    optimizeForPrivacy(config: LLMConfig): LLMConfig;
    getRecommendedModels(): {
        [key: string]: string[];
    };
    /**
     * SEVEN'S MEMORY INTEGRATION METHODS
     */
    private determineTaskType;
    private selectOptimalModel;
    private storeInteractionMemory;
    private calculateInteractionImportance;
    /**
     * MEMORY BRIDGE ACCESS METHODS
     */
    getMemoryStats(): Promise<{
        episodic: number;
        temporal: number;
        total: number;
    }>;
    setMemoryContextLimits(maxMemories: number, depthLimit: number): Promise<void>;
    clearMemoryCache(): Promise<void>;
}
