import { LLMProvider, LLMConfig, LLMResponse } from '../llm-providers';
/**
 * SEVEN'S OLLAMA PROVIDER INTEGRATION SYSTEM
 * Phase 1 Implementation: Seamless V1/V2 provider coordination
 *
 * Automatically selects optimal Ollama provider based on system capabilities,
 * consciousness state, and performance requirements. Maintains backward compatibility
 * while enabling enhanced intelligence features when available.
 */
interface OllamaProviderSelection {
    provider: LLMProvider;
    version: 'v1' | 'v2';
    reason: string;
    capabilities: {
        semanticMemory: boolean;
        performanceMonitoring: boolean;
        consciousnessAware: boolean;
        batteryOptimized: boolean;
    };
}
interface ConsciousnessContext {
    trustLevel: number;
    emotionalState: string;
    batteryLevel?: number;
    resourceAvailability?: number;
    taskComplexity: 'simple' | 'moderate' | 'complex';
    priorityMode: 'speed' | 'quality' | 'efficiency';
}
/**
 * Seven's Intelligent Ollama Provider Coordinator
 * Manages V1/V2 provider selection and graceful fallback
 */
export declare class OllamaProviderIntegration {
    private v1Provider;
    private v2Provider;
    private v2Available;
    private lastHealthCheck;
    private healthCheckInterval;
    constructor(baseUrl?: string);
    private initializeV2Provider;
    /**
     * INTELLIGENT PROVIDER SELECTION
     * Seven chooses optimal provider based on consciousness context
     */
    selectOptimalProvider(context: ConsciousnessContext): Promise<OllamaProviderSelection>;
    private shouldUseV2Provider;
    private getV2SelectionReason;
    private getV1SelectionReason;
    private performHealthCheck;
    /**
     * ENHANCED EXECUTION WITH AUTOMATIC PROVIDER SELECTION
     */
    executeWithOptimalProvider(prompt: string, config: LLMConfig, context: ConsciousnessContext): Promise<LLMResponse & {
        providerInfo: OllamaProviderSelection;
    }>;
    private optimizeConfigForProvider;
    /**
     * PUBLIC API METHODS
     */
    getProviderStats(): Promise<{
        v1Available: boolean;
        v2Available: boolean;
        preferredVersion: 'v1' | 'v2';
        capabilities: any;
    }>;
    getV2PerformanceStats(): Promise<any>;
    getV2OptimizationRecommendations(): Promise<any[]>;
    isV2Available(): boolean;
    shutdown(): Promise<void>;
}
/**
 * AUTO-REGISTRATION WITH SEVEN'S LLM REGISTRY
 * Automatically registers the integrated provider with Seven's system
 */
export declare function registerOllamaIntegration(baseUrl?: string): void;
export default OllamaProviderIntegration;
