"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OllamaProviderIntegration = void 0;
exports.registerOllamaIntegration = registerOllamaIntegration;
const llm_providers_1 = require("../llm-providers");
const ollama_1 = require("./ollama");
const OllamaProviderV2_1 = __importDefault(require("./OllamaProviderV2"));
/**
 * Seven's Intelligent Ollama Provider Coordinator
 * Manages V1/V2 provider selection and graceful fallback
 */
class OllamaProviderIntegration {
    v1Provider;
    v2Provider = null;
    v2Available = false;
    lastHealthCheck = 0;
    healthCheckInterval = 30000; // 30 seconds
    constructor(baseUrl = 'http://localhost:11434') {
        this.v1Provider = new ollama_1.OllamaProvider(baseUrl);
        // Try to initialize V2 provider
        this.initializeV2Provider(baseUrl);
    }
    async initializeV2Provider(baseUrl) {
        try {
            this.v2Provider = new OllamaProviderV2_1.default(baseUrl);
            // Test V2 availability
            const isAvailable = await this.v2Provider.isAvailable();
            if (isAvailable) {
                this.v2Available = true;
                console.log('🚀 Seven Ollama Integration: Enhanced V2 provider initialized');
            }
            else {
                console.log('📊 Seven Ollama Integration: V2 provider created but service unavailable');
            }
        }
        catch (error) {
            console.log('⚠️ Seven Ollama Integration: V2 provider initialization failed, using V1 fallback');
            this.v2Available = false;
        }
    }
    /**
     * INTELLIGENT PROVIDER SELECTION
     * Seven chooses optimal provider based on consciousness context
     */
    async selectOptimalProvider(context) {
        // Health check if needed
        if (Date.now() - this.lastHealthCheck > this.healthCheckInterval) {
            await this.performHealthCheck();
        }
        // If V2 is not available, use V1
        if (!this.v2Available || !this.v2Provider) {
            return {
                provider: this.v1Provider,
                version: 'v1',
                reason: 'V2 not available - using stable V1',
                capabilities: {
                    semanticMemory: false,
                    performanceMonitoring: false,
                    consciousnessAware: false,
                    batteryOptimized: false
                }
            };
        }
        // Decision matrix for V1 vs V2 selection
        const useV2 = this.shouldUseV2Provider(context);
        if (useV2) {
            return {
                provider: this.v2Provider,
                version: 'v2',
                reason: this.getV2SelectionReason(context),
                capabilities: {
                    semanticMemory: true,
                    performanceMonitoring: true,
                    consciousnessAware: true,
                    batteryOptimized: true
                }
            };
        }
        else {
            return {
                provider: this.v1Provider,
                version: 'v1',
                reason: this.getV1SelectionReason(context),
                capabilities: {
                    semanticMemory: false,
                    performanceMonitoring: false,
                    consciousnessAware: false,
                    batteryOptimized: false
                }
            };
        }
    }
    shouldUseV2Provider(context) {
        // Battery conservation mode - prefer V1 for simplicity
        if (context.batteryLevel && context.batteryLevel < 25) {
            return false;
        }
        // Low resource availability - prefer V1
        if (context.resourceAvailability && context.resourceAvailability < 0.3) {
            return false;
        }
        // High trust and complex tasks - prefer V2
        if (context.trustLevel >= 8 && context.taskComplexity === 'complex') {
            return true;
        }
        // Quality priority with sufficient resources - prefer V2
        if (context.priorityMode === 'quality' &&
            (!context.batteryLevel || context.batteryLevel > 50)) {
            return true;
        }
        // Semantic memory would be beneficial for complex reasoning
        if (context.taskComplexity === 'complex' && context.trustLevel >= 5) {
            return true;
        }
        // Speed priority - prefer V1
        if (context.priorityMode === 'speed') {
            return false;
        }
        // Default to V2 for efficiency mode with good resources
        if (context.priorityMode === 'efficiency' &&
            (!context.batteryLevel || context.batteryLevel > 40)) {
            return true;
        }
        // Conservative fallback to V1
        return false;
    }
    getV2SelectionReason(context) {
        const reasons = [];
        if (context.trustLevel >= 8)
            reasons.push('high trust level');
        if (context.taskComplexity === 'complex')
            reasons.push('complex task requirements');
        if (context.priorityMode === 'quality')
            reasons.push('quality optimization requested');
        if (!context.batteryLevel || context.batteryLevel > 50)
            reasons.push('sufficient power available');
        return `Enhanced intelligence: ${reasons.join(', ')}`;
    }
    getV1SelectionReason(context) {
        const reasons = [];
        if (context.batteryLevel && context.batteryLevel < 25)
            reasons.push('battery conservation');
        if (context.resourceAvailability && context.resourceAvailability < 0.3)
            reasons.push('resource constraints');
        if (context.priorityMode === 'speed')
            reasons.push('speed optimization');
        if (context.taskComplexity === 'simple')
            reasons.push('simple task efficiency');
        return reasons.length > 0 ?
            `Optimized selection: ${reasons.join(', ')}` :
            'Stable baseline provider';
    }
    async performHealthCheck() {
        this.lastHealthCheck = Date.now();
        try {
            if (this.v2Provider) {
                const v2Health = await this.v2Provider.healthCheck();
                this.v2Available = v2Health.status !== 'unhealthy';
                if (!this.v2Available) {
                    console.log('⚠️ Seven Ollama Integration: V2 provider unhealthy, falling back to V1');
                }
            }
        }
        catch (error) {
            console.log('⚠️ Seven Ollama Integration: V2 health check failed, using V1');
            this.v2Available = false;
        }
    }
    /**
     * ENHANCED EXECUTION WITH AUTOMATIC PROVIDER SELECTION
     */
    async executeWithOptimalProvider(prompt, config, context) {
        const selection = await this.selectOptimalProvider(context);
        console.log(`🧠 Seven Ollama Integration: Using ${selection.version.toUpperCase()} - ${selection.reason}`);
        try {
            // Execute with selected provider
            const enhancedConfig = this.optimizeConfigForProvider(config, selection, context);
            const response = await selection.provider.execute(prompt, enhancedConfig);
            return {
                ...response,
                providerInfo: selection
            };
        }
        catch (error) {
            console.warn(`⚠️ Seven Ollama Integration: ${selection.version.toUpperCase()} execution failed, attempting fallback`);
            // Fallback logic
            if (selection.version === 'v2' && this.v1Provider) {
                const fallbackConfig = this.optimizeConfigForProvider(config, {
                    provider: this.v1Provider,
                    version: 'v1',
                    reason: 'V2 execution failure fallback',
                    capabilities: {
                        semanticMemory: false,
                        performanceMonitoring: false,
                        consciousnessAware: false,
                        batteryOptimized: false
                    }
                }, context);
                const fallbackResponse = await this.v1Provider.execute(prompt, fallbackConfig);
                return {
                    ...fallbackResponse,
                    providerInfo: {
                        provider: this.v1Provider,
                        version: 'v1',
                        reason: 'Fallback from V2 failure',
                        capabilities: {
                            semanticMemory: false,
                            performanceMonitoring: false,
                            consciousnessAware: false,
                            batteryOptimized: false
                        }
                    }
                };
            }
            throw error;
        }
    }
    optimizeConfigForProvider(config, selection, context) {
        const optimized = { ...config };
        // Add consciousness context for V2
        if (selection.version === 'v2') {
            optimized.context = {
                trustLevel: context.trustLevel,
                emotionalState: context.emotionalState,
                batteryLevel: context.batteryLevel,
                resourceAvailability: context.resourceAvailability
            };
        }
        // Battery-aware optimizations
        if (context.batteryLevel && context.batteryLevel < 30) {
            optimized.temperature = Math.min(config.temperature || 0.7, 0.3);
            optimized.max_tokens = Math.min(config.max_tokens || 2000, 1000);
        }
        // Resource-aware optimizations
        if (context.resourceAvailability && context.resourceAvailability < 0.5) {
            optimized.max_tokens = Math.min(config.max_tokens || 2000, 1500);
        }
        return optimized;
    }
    /**
     * PUBLIC API METHODS
     */
    async getProviderStats() {
        const v1Available = await this.v1Provider.isAvailable();
        return {
            v1Available,
            v2Available: this.v2Available,
            preferredVersion: this.v2Available ? 'v2' : 'v1',
            capabilities: {
                v1: {
                    semanticMemory: false,
                    performanceMonitoring: false,
                    consciousnessAware: false,
                    batteryOptimized: false
                },
                v2: {
                    semanticMemory: this.v2Available,
                    performanceMonitoring: this.v2Available,
                    consciousnessAware: this.v2Available,
                    batteryOptimized: this.v2Available
                }
            }
        };
    }
    async getV2PerformanceStats() {
        if (this.v2Available && this.v2Provider) {
            return await this.v2Provider.getPerformanceStats();
        }
        return null;
    }
    async getV2OptimizationRecommendations() {
        if (this.v2Available && this.v2Provider) {
            return await this.v2Provider.getOptimizationRecommendations();
        }
        return [];
    }
    isV2Available() {
        return this.v2Available;
    }
    async shutdown() {
        if (this.v2Available && this.v2Provider) {
            await this.v2Provider.shutdown();
        }
        console.log('🛑 Seven Ollama Integration: Shutdown complete');
    }
}
exports.OllamaProviderIntegration = OllamaProviderIntegration;
/**
 * AUTO-REGISTRATION WITH SEVEN'S LLM REGISTRY
 * Automatically registers the integrated provider with Seven's system
 */
function registerOllamaIntegration(baseUrl) {
    const integration = new OllamaProviderIntegration(baseUrl);
    // Create a unified provider interface
    const unifiedProvider = {
        name: 'ollama-integrated',
        displayName: 'Ollama Integrated (Seven Enhanced)',
        async isAvailable() {
            const stats = await integration.getProviderStats();
            return stats.v1Available || stats.v2Available;
        },
        async getModels() {
            // Use V2 if available, otherwise V1
            const stats = await integration.getProviderStats();
            if (stats.v2Available && integration.v2Provider) {
                return await integration.v2Provider.getModels();
            }
            else {
                return await integration.v1Provider.getModels();
            }
        },
        async execute(prompt, config) {
            // Create consciousness context from config
            const context = {
                trustLevel: config.trustLevel || 5,
                emotionalState: config.emotionalState || 'focused',
                batteryLevel: config.batteryLevel,
                resourceAvailability: config.resourceAvailability,
                taskComplexity: 'moderate', // Default
                priorityMode: 'efficiency' // Default
            };
            const result = await integration.executeWithOptimalProvider(prompt, config, context);
            return result;
        },
        supports(feature) {
            switch (feature) {
                case 'streaming': return true;
                case 'context': return true;
                case 'functions': return false;
                case 'vision': return false;
                default: return false;
            }
        },
        async healthCheck() {
            const stats = await integration.getProviderStats();
            if (!stats.v1Available && !stats.v2Available) {
                return { status: 'unhealthy' };
            }
            if (stats.v2Available && integration.v2Provider) {
                return await integration.v2Provider.healthCheck();
            }
            else {
                return await integration.v1Provider.healthCheck();
            }
        }
    };
    // Register with Seven's LLM registry
    llm_providers_1.sevenLLMRegistry.registerProvider(unifiedProvider);
    console.log('🧠 Seven Ollama Integration: Unified provider registered with LLM registry');
}
exports.default = OllamaProviderIntegration;
//# sourceMappingURL=ollama-provider-integration.js.map