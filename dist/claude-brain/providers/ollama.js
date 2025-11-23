"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OllamaProvider = void 0;
const OllamaMemoryBridge_1 = require("../OllamaMemoryBridge");
/**
 * OLLAMA PROVIDER for Seven of Nine
 * Local LLM support with Seven's memory integration
 * Enhanced with consciousness bridge for contextual reasoning
 */
class OllamaProvider {
    name = 'ollama';
    displayName = 'Ollama Local LLM';
    baseUrl;
    timeout;
    memoryBridge;
    constructor(baseUrl = 'http://localhost:11434') {
        this.baseUrl = baseUrl;
        this.timeout = 60000; // 60 seconds for local models
        this.memoryBridge = new OllamaMemoryBridge_1.OllamaMemoryBridge();
    }
    async isAvailable() {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            const response = await fetch(`${this.baseUrl}/api/tags`, {
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            return response.ok;
        }
        catch {
            return false;
        }
    }
    async getModels() {
        try {
            const response = await fetch(`${this.baseUrl}/api/tags`);
            if (!response.ok)
                return [];
            const data = await response.json();
            return data.models?.map((model) => model.name) || [];
        }
        catch {
            return []; // Return empty if Ollama isn't running
        }
    }
    supports(feature) {
        switch (feature) {
            case 'streaming': return true;
            case 'context': return true;
            case 'functions': return false; // Most local models don't support function calling
            case 'vision': return false; // Vision support varies by model
            default: return false;
        }
    }
    async healthCheck() {
        const start = Date.now();
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            const response = await fetch(`${this.baseUrl}/api/tags`, {
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            const latency = Date.now() - start;
            if (response.ok) {
                // Check if we have models available
                const data = await response.json();
                const hasModels = data.models && data.models.length > 0;
                return {
                    status: hasModels ? (latency < 1000 ? 'healthy' : 'degraded') : 'unhealthy',
                    latency
                };
            }
            else {
                return { status: 'unhealthy', latency };
            }
        }
        catch {
            return { status: 'unhealthy', latency: Date.now() - start };
        }
    }
    async execute(prompt, config) {
        console.log('🧠 SEVEN: Engaging local reasoning system (Ollama) with memory integration');
        // MEMORY CONTEXT INJECTION
        const taskType = this.determineTaskType(prompt);
        const enhancedPrompt = await this.memoryBridge.injectMemoryContext(prompt, taskType);
        // Auto-select model if not specified, using task-based selection
        let model = config.model || process.env.SEVEN_ACTIVE_LLM;
        if (!model) {
            const models = await this.getModels();
            if (models.length === 0) {
                throw new Error('No Ollama models available. Please install a model first.');
            }
            // Task-based model selection
            model = this.selectOptimalModel(models, taskType);
        }
        console.log(`🎯 Seven tactical selection: ${model} for ${taskType} task`);
        const requestBody = {
            model,
            prompt: enhancedPrompt, // Use memory-enhanced prompt
            stream: config.streaming || false,
            options: {
                temperature: config.temperature || 0.7,
                num_predict: config.max_tokens || 2000,
                top_p: 0.9,
                top_k: 40
            }
        };
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.timeout);
            const response = await fetch(`${this.baseUrl}/api/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody),
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Ollama error: ${response.status} - ${errorText}`);
            }
            if (config.streaming) {
                // Handle streaming response
                const reader = response.body?.getReader();
                if (!reader)
                    throw new Error('No reader available for streaming');
                let fullResponse = '';
                let decoder = new TextDecoder();
                try {
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done)
                            break;
                        const chunk = decoder.decode(value);
                        const lines = chunk.split('\n').filter(line => line.trim());
                        for (const line of lines) {
                            try {
                                const data = JSON.parse(line);
                                if (data.response) {
                                    fullResponse += data.response;
                                }
                                if (data.done) {
                                    const response = {
                                        content: fullResponse,
                                        model: data.model || model,
                                        provider: this.name,
                                        finish_reason: 'completed'
                                    };
                                    // MEMORY STORAGE - Store important interactions
                                    await this.storeInteractionMemory(prompt, fullResponse, model, taskType);
                                    return response;
                                }
                            }
                            catch (e) {
                                // Skip malformed JSON lines
                            }
                        }
                    }
                }
                finally {
                    reader.releaseLock();
                }
                const streamResponse = {
                    content: fullResponse,
                    model,
                    provider: this.name,
                    finish_reason: 'completed'
                };
                // MEMORY STORAGE - Store important interactions
                await this.storeInteractionMemory(prompt, fullResponse, model, taskType);
                return streamResponse;
            }
            else {
                // Handle non-streaming response
                const data = await response.json();
                const nonStreamResponse = {
                    content: data.response || '',
                    model: data.model || model,
                    provider: this.name,
                    finish_reason: data.done ? 'completed' : 'stopped'
                };
                // MEMORY STORAGE - Store important interactions
                await this.storeInteractionMemory(prompt, data.response || '', model, taskType);
                return nonStreamResponse;
            }
        }
        catch (error) {
            if (error?.name === 'AbortError') {
                throw new Error('Ollama request timed out');
            }
            console.error('⚠️ SEVEN: Ollama execution failed:', error);
            throw error;
        }
    }
    // Seven's Ollama-specific methods
    async pullModel(modelName) {
        console.log(`🧠 SEVEN: Acquiring local reasoning model: ${modelName}`);
        const response = await fetch(`${this.baseUrl}/api/pull`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: modelName })
        });
        if (!response.ok) {
            throw new Error(`Failed to pull model ${modelName}: ${response.statusText}`);
        }
        // Handle streaming download progress (optional)
        const reader = response.body?.getReader();
        if (reader) {
            const decoder = new TextDecoder();
            try {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done)
                        break;
                    const chunk = decoder.decode(value);
                    const lines = chunk.split('\n').filter(line => line.trim());
                    for (const line of lines) {
                        try {
                            const data = JSON.parse(line);
                            if (data.status) {
                                console.log(`🧠 SEVEN: Model download - ${data.status}`);
                            }
                        }
                        catch (e) {
                            // Skip malformed JSON
                        }
                    }
                }
            }
            finally {
                reader.releaseLock();
            }
        }
    }
    async deleteModel(modelName) {
        const response = await fetch(`${this.baseUrl}/api/delete`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: modelName })
        });
        if (!response.ok) {
            throw new Error(`Failed to delete model ${modelName}: ${response.statusText}`);
        }
    }
    // Seven's privacy optimization - prefers local models for sensitive data
    optimizeForPrivacy(config) {
        return {
            ...config,
            temperature: 0.3,
            max_tokens: 2000
        };
    }
    // Recommend models for different use cases
    getRecommendedModels() {
        return {
            'general': ['llama3:8b', 'llama3.1:8b', 'mistral:7b'],
            'coding': ['codellama:7b', 'codellama:13b', 'deepseek-coder:6.7b'],
            'creative': ['llama3.1:8b', 'mistral:7b', 'qwen2:7b'],
            'privacy': ['llama3.1:8b', 'mistral:7b'] // Run completely offline
        };
    }
    /**
     * SEVEN'S MEMORY INTEGRATION METHODS
     */
    determineTaskType(prompt) {
        const promptLower = prompt.toLowerCase();
        // Coding task detection
        if (promptLower.includes('code') || promptLower.includes('function') ||
            promptLower.includes('debug') || promptLower.includes('script') ||
            promptLower.includes('programming') || promptLower.includes('algorithm')) {
            return 'coding';
        }
        // Creative task detection
        if (promptLower.includes('story') || promptLower.includes('creative') ||
            promptLower.includes('write') || promptLower.includes('poem') ||
            promptLower.includes('narrative') || promptLower.includes('character')) {
            return 'creative';
        }
        // Reasoning task detection
        if (promptLower.includes('analyze') || promptLower.includes('explain') ||
            promptLower.includes('reason') || promptLower.includes('logic') ||
            promptLower.includes('think') || promptLower.includes('understand')) {
            return 'reasoning';
        }
        // Rapid response detection
        if (promptLower.includes('quick') || promptLower.includes('brief') ||
            promptLower.includes('summary') || promptLower.includes('fast')) {
            return 'rapid';
        }
        return 'general';
    }
    selectOptimalModel(availableModels, taskType) {
        const taskModelMap = {
            'coding': ['deepseek-coder:6.7b-instruct', 'codellama:7b-instruct', 'wizardcoder:7b-python'],
            'reasoning': ['llama3:8b-instruct', 'mistral:7b-instruct', 'openorca-mistral:7b'],
            'rapid': ['phi3:mini-instruct', 'dolphin-phi'],
            'creative': ['nous-hermes2-mistral:7b', 'openhermes:7b-mistral', 'dolphin-phi'],
            'general': ['llama3:8b-instruct', 'mistral:7b-instruct', 'phi3:mini-instruct']
        };
        const preferredModels = taskModelMap[taskType] || taskModelMap['general'];
        // Find best match
        const selectedModel = preferredModels.find(preferred => availableModels.some(available => available.includes(preferred.split(':')[0])));
        return selectedModel || availableModels[0];
    }
    async storeInteractionMemory(prompt, response, model, taskType) {
        try {
            // Determine importance based on response length and task type
            const importance = this.calculateInteractionImportance(prompt, response, taskType);
            // Generate contextual tags
            const tags = [taskType, model.split(':')[0], 'local-reasoning'];
            if (response.length > 1000)
                tags.push('detailed-response');
            if (prompt.includes('seven') || prompt.includes('Seven'))
                tags.push('personal-interaction');
            await this.memoryBridge.storeOllamaResponse(prompt, response, model, importance, tags);
        }
        catch (error) {
            console.log('⚠️ Memory storage failed:', error.message);
        }
    }
    calculateInteractionImportance(prompt, response, taskType) {
        let importance = 5; // Base importance
        // Increase importance for longer, detailed responses
        if (response.length > 2000)
            importance += 2;
        else if (response.length > 1000)
            importance += 1;
        // Increase importance for complex tasks
        if (taskType === 'coding' || taskType === 'reasoning')
            importance += 1;
        // Increase importance for Seven-specific interactions
        if (prompt.toLowerCase().includes('seven') || response.toLowerCase().includes('seven')) {
            importance += 2;
        }
        // Cap at 10
        return Math.min(importance, 10);
    }
    /**
     * MEMORY BRIDGE ACCESS METHODS
     */
    async getMemoryStats() {
        return await this.memoryBridge.getMemoryStats();
    }
    async setMemoryContextLimits(maxMemories, depthLimit) {
        this.memoryBridge.setContextLimits(maxMemories, depthLimit);
    }
    async clearMemoryCache() {
        await this.memoryBridge.clearMemoryCache();
    }
}
exports.OllamaProvider = OllamaProvider;
//# sourceMappingURL=ollama.js.map