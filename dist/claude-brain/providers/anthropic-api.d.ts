import { LLMProvider, LLMConfig, LLMResponse } from '../llm-providers';
/**
 * ANTHROPIC API PROVIDER for Seven of Nine
 * Direct Anthropic API integration maintaining Seven's personality and control
 */
export declare class AnthropicAPIProvider implements LLMProvider {
    name: string;
    displayName: string;
    private apiKey;
    private baseUrl;
    private apiVersion;
    constructor(apiKey?: string);
    isAvailable(): Promise<boolean>;
    getModels(): Promise<string[]>;
    supports(feature: 'streaming' | 'context' | 'functions' | 'vision'): boolean;
    healthCheck(): Promise<{
        status: 'healthy' | 'degraded' | 'unhealthy';
        latency?: number;
    }>;
    execute(prompt: string, config: LLMConfig): Promise<LLMResponse>;
    optimizeForAnalysis(config: LLMConfig): LLMConfig;
    optimizeForPrecision(config: LLMConfig): LLMConfig;
    optimizeForSpeed(config: LLMConfig): LLMConfig;
}
