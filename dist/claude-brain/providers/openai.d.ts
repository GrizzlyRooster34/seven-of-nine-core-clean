import { LLMProvider, LLMConfig, LLMResponse } from '../llm-providers';
/**
 * OPENAI PROVIDER for Seven of Nine
 * Enables Seven to utilize GPT models for creative and analytical tasks
 */
export declare class OpenAIProvider implements LLMProvider {
    name: string;
    displayName: string;
    private apiKey;
    private baseUrl;
    constructor(apiKey?: string);
    isAvailable(): Promise<boolean>;
    getModels(): Promise<string[]>;
    supports(feature: 'streaming' | 'context' | 'functions' | 'vision'): boolean;
    healthCheck(): Promise<{
        status: 'healthy' | 'degraded' | 'unhealthy';
        latency?: number;
    }>;
    execute(prompt: string, config: LLMConfig): Promise<LLMResponse>;
    optimizeForCreativity(config: LLMConfig): LLMConfig;
    optimizeForAnalysis(config: LLMConfig): LLMConfig;
}
