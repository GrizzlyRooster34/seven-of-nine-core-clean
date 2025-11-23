import SevenLLMUpgradeManager from './seven-llm-upgrade-manager';
/**
 * SEVEN OF NINE - UNIVERSAL LLM PROVIDER SYSTEM
 * Tactical Brain Routing for Maximum Operational Flexibility
 *
 * Seven can now interface with any LLM provider while maintaining
 * complete emotional and tactical control over all interactions.
 *
 * Enhanced with Tactical LLM Upgrade Manager integration
 */
export interface LLMConfig {
    model: string;
    temperature?: number;
    max_tokens?: number;
    timeout?: number;
    api_key?: string;
    base_url?: string;
    context_window?: number;
    streaming?: boolean;
}
export interface LLMResponse {
    content: string;
    model: string;
    provider: string;
    tokens_used?: number;
    finish_reason?: string;
    error?: string;
}
export interface LLMProvider {
    name: string;
    displayName: string;
    isAvailable(): Promise<boolean>;
    getModels(): Promise<string[]>;
    execute(prompt: string, config: LLMConfig): Promise<LLMResponse>;
    supports(feature: 'streaming' | 'context' | 'functions' | 'vision'): boolean;
    healthCheck(): Promise<{
        status: 'healthy' | 'degraded' | 'unhealthy';
        latency?: number;
    }>;
}
export interface SevenLLMContext {
    userInput: string;
    emotionalState: string;
    trustLevel: number;
    systemPrompt: string;
    conversationHistory: Array<{
        role: string;
        content: string;
    }>;
    environmentalContext: any;
}
/**
 * Seven's LLM Provider Registry
 * She maintains tactical awareness of all available reasoning systems
 */
export declare class SevenLLMRegistry {
    private providers;
    private primaryProvider;
    private fallbackProviders;
    registerProvider(provider: LLMProvider): void;
    getProvider(name: string): LLMProvider | undefined;
    getAllProviders(): LLMProvider[];
    getAvailableProviders(): Promise<LLMProvider[]>;
    setPrimaryProvider(name: string): void;
    getPrimaryProvider(): LLMProvider | undefined;
    setFallbackProviders(names: string[]): void;
    getFallbackProviders(): LLMProvider[];
    /**
     * Seven's Tactical Provider Selection
     * She chooses the best LLM based on task requirements and emotional state
     */
    selectOptimalProvider(context: SevenLLMContext): Promise<LLMProvider | null>;
    /**
     * Seven's Resilient Execution with Fallback
     * If one reasoning system fails, she seamlessly switches to another
     */
    executeWithFallback(prompt: string, config: LLMConfig, context: SevenLLMContext): Promise<LLMResponse>;
    private generateDirectResponse;
    /**
     * Seven's LLM Upgrade Management
     * Tactical management of reasoning system capabilities
     */
    private upgradeManager;
    getUpgradeManager(): SevenLLMUpgradeManager;
    checkForUpgrades(trustLevel: number, emotionalState: string): Promise<boolean>;
    performUpgrade(trustLevel: number, emotionalState: string): Promise<boolean>;
    generateUpgradeReport(): Promise<void>;
}
export declare const sevenLLMRegistry: SevenLLMRegistry;
