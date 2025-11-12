import { LLMProvider, LLMConfig, LLMResponse } from '../llm-providers';
export declare class OllamaProviderV2 implements LLMProvider {
    name: string;
    displayName: string;
    private baseUrl;
    private timeout;
    private memoryBridge;
    private performanceAnalyzer;
    private isInitialized;
    constructor(baseUrl?: string);
    private initializeEnhancedProvider;
    isAvailable(): Promise<boolean>;
    getModels(): Promise<string[]>;
    supports(feature: 'streaming' | 'context' | 'functions' | 'vision'): boolean;
    healthCheck(): Promise<{
        status: 'healthy' | 'degraded' | 'unhealthy';
        latency?: number;
    }>;
    /**
     * ENHANCED EXECUTION WITH CONSCIOUSNESS INTEGRATION
     */
    execute(prompt: string, config: LLMConfig): Promise<LLMResponse>;
    /**
     * CONSCIOUSNESS STATE EXTRACTION
     */
    private extractConsciousnessState;
    /**
     * PERFORMANCE-BASED MODEL SELECTION
     */
    private selectOptimalModel;
    private determinePriority;
    /**
     * RESOURCE-AWARE CONFIGURATION OPTIMIZATION
     */
    private optimizeConfiguration;
    /**
     * OLLAMA EXECUTION WITH ENHANCED ERROR HANDLING
     */
    private executeWithOllama;
    /**
     * UTILITY METHODS
     */
    private determineTaskType;
    private estimateTokens;
    private assessResponseQuality;
    /**
     * PUBLIC API EXTENSIONS
     */
    getPerformanceStats(): Promise<any>;
    getModelPerformanceProfiles(): Promise<any[]>;
    getOptimizationRecommendations(): Promise<any[]>;
    getEnhancedMemoryStats(): Promise<any>;
    isSemanticSearchEnabled(): boolean;
    shutdown(): Promise<void>;
}
export default OllamaProviderV2;
