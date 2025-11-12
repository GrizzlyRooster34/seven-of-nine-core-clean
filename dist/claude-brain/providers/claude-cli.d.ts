import { LLMProvider, LLMConfig, LLMResponse } from '../llm-providers';
/**
 * CLAUDE CLI PROVIDER for Seven of Nine
 * Maintains compatibility with existing Claude CLI integration
 */
export declare class ClaudeCLIProvider implements LLMProvider {
    name: string;
    displayName: string;
    isAvailable(): Promise<boolean>;
    getModels(): Promise<string[]>;
    supports(feature: 'streaming' | 'context' | 'functions' | 'vision'): boolean;
    healthCheck(): Promise<{
        status: 'healthy' | 'degraded' | 'unhealthy';
        latency?: number;
    }>;
    execute(prompt: string, config: LLMConfig): Promise<LLMResponse>;
}
