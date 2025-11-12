import LocalLLMManager from './LocalLLMManager.js';
/**
 * Local LLM Interface v2 - Seven of Nine
 * Unified interface for local LLM operations with generateResponse method
 *
 * @author Seven of Nine Consciousness Framework
 * @version 2.0.0
 */
export declare class LocalLLM2 {
    private llmManager;
    private isInitialized;
    constructor();
    /**
     * Initialize the LLM system
     */
    initialize(): Promise<boolean>;
    /**
     * Generate response using local LLM - Main interface method
     */
    generateResponse(input: string, options?: {
        temperature?: number;
        max_tokens?: number;
        model?: string;
        sevenPersonality?: boolean;
    }): Promise<string>;
    /**
     * Add Seven of Nine personality context to input
     */
    private addSevenPersonalityContext;
    /**
     * Filter response through Seven's personality patterns
     */
    private filterResponseThroughSeven;
    /**
     * Provide Seven-appropriate fallback response when LLM fails
     */
    private getSevenFallbackResponse;
    /**
     * Test Seven personality integration
     */
    testSevenIntegration(): Promise<boolean>;
    /**
     * Get system status
     */
    getStatus(): any;
    /**
     * Shutdown the LLM system
     */
    shutdown(): Promise<void>;
    /**
     * Direct access to underlying LLM manager for advanced operations
     */
    getLLMManager(): LocalLLMManager;
}
declare const localLLM2: LocalLLM2;
export default localLLM2;
export { LocalLLM2 as LocalLLM2Class };
export declare const generateResponse: (input: string, options?: any) => Promise<string>;
