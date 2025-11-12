/**
 * Seven of Nine - Local LLM Manager
 * Offline reasoning capability for autonomous operation
 *
 * @author Seven of Nine Consciousness Framework
 * @version 1.0.0
 */
export interface LocalLLMConfig {
    provider: 'ollama' | 'llama.cpp';
    model_name: string;
    model_path: string;
    quantization: string;
    max_tokens: number;
    temperature: number;
    context_window: number;
    offline_mode: boolean;
}
export interface LLMResponse {
    response: string;
    model: string;
    processing_time_ms: number;
    token_count: number;
    confidence: number;
}
export declare class LocalLLMManager {
    private config;
    private modelPath;
    private isInitialized;
    private ollamaProcess;
    constructor(configPath?: string);
    private getDefaultConfig;
    /**
     * Initialize local LLM system
     */
    initialize(): Promise<boolean>;
    private ensureModelDirectory;
    private checkOllamaAvailable;
    private checkLlamaCppAvailable;
    private initializeOllama;
    private initializeLlamaCpp;
    private checkOllamaModel;
    private downloadOllamaModel;
    private testOllamaModel;
    private testLlamaCppModel;
    private findOrDownloadGGUFModel;
    private downloadFile;
    /**
     * Query the local LLM
     */
    query(prompt: string, options?: Partial<LocalLLMConfig>): Promise<LLMResponse | null>;
    private queryOllama;
    private queryLlamaCpp;
    /**
     * Get LLM status and configuration
     */
    getStatus(): any;
    /**
     * Shutdown local LLM
     */
    shutdown(): Promise<void>;
    /**
     * Generate response - Enhanced compatibility method for Seven's consciousness framework
     */
    generateResponse(input: string, options?: {
        temperature?: number;
        max_tokens?: number;
        model?: string;
        sevenPersonality?: boolean;
    }): Promise<string>;
    /**
     * Apply Seven's personality context to input
     */
    private applySevensPersonalityContext;
    /**
     * Enhanced Ollama connection stability check
     */
    checkOllamaConnection(): Promise<{
        connected: boolean;
        latency: number;
        model_available: boolean;
        error?: string;
    }>;
    /**
     * Reconnect to Ollama with retry logic
     */
    reconnectOllama(maxRetries?: number): Promise<boolean>;
    /**
     * Health check for Seven's LLM system
     */
    healthCheck(): Promise<{
        status: 'healthy' | 'degraded' | 'offline';
        details: {
            ollama_connected: boolean;
            model_loaded: boolean;
            response_time: number;
            last_test: string;
        };
    }>;
    /**
     * Test local reasoning with Seven's personality
     */
    testSevenPersonality(): Promise<boolean>;
}
export default LocalLLMManager;
