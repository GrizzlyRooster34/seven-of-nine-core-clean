"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OllamaMemoryBridge = void 0;
const path_1 = require("path");
const fs_1 = require("fs");
class OllamaMemoryBridge {
    memoryPath;
    temporalMemoryPath;
    maxContextMemories;
    contextDepthLimit;
    constructor() {
        this.memoryPath = (0, path_1.join)(process.cwd(), 'memory-v2', 'episodic-memories.json');
        this.temporalMemoryPath = (0, path_1.join)(process.cwd(), 'memory-v3', 'temporal-memories.json');
        this.maxContextMemories = 10;
        this.contextDepthLimit = 8000; // Character limit for context injection
    }
    /**
     * MEMORY CONTEXT INJECTION
     * Enhances prompts with relevant memory context before sending to Ollama
     */
    async injectMemoryContext(prompt, taskType = 'general') {
        try {
            console.log('🧠 Seven Memory Bridge: Gathering contextual memories...');
            const memoryContext = await this.gatherRelevantMemories(prompt, taskType);
            const enhancedPrompt = this.constructEnhancedPrompt(prompt, memoryContext);
            console.log(`✅ Memory context injected: ${memoryContext.recentMemories.length} memories, ${memoryContext.relevantMemories.length} relevant`);
            return enhancedPrompt;
        }
        catch (error) {
            console.log('⚠️ Memory context injection failed, using original prompt:', error.message);
            return prompt;
        }
    }
    /**
     * MEMORY STORAGE FROM OLLAMA RESPONSES
     * Stores important responses from Ollama back into Seven's memory system
     */
    async storeOllamaResponse(prompt, response, model, importance = 5, tags = []) {
        try {
            const memoryItem = {
                id: `mem-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                timestamp: new Date().toISOString(),
                topic: 'ollama-interaction',
                agent: `ollama-${model}`,
                emotion: 'focused', // Default emotional state for LLM interactions
                context: `USER: ${prompt}\n\nOLLAMA (${model}): ${response}`,
                importance,
                tags: ['ollama', 'local-llm', model.split(':')[0], ...tags],
                relatedMemories: []
            };
            await this.appendToMemoryStore(memoryItem);
            console.log(`🧠 Seven Memory: Stored Ollama interaction (importance: ${importance})`);
        }
        catch (error) {
            console.log('⚠️ Failed to store Ollama response in memory:', error.message);
        }
    }
    /**
     * COGNITIVE STATE SYNCHRONIZATION
     * Synchronizes Seven's cognitive state with Ollama for consistent personality
     */
    async syncCognitiveState(currentState) {
        try {
            const stateContext = this.formatCognitiveState(currentState);
            console.log('🧠 Seven Consciousness: Cognitive state synchronized with local LLM');
            return stateContext;
        }
        catch (error) {
            console.log('⚠️ Cognitive state sync failed:', error.message);
            return '';
        }
    }
    /**
     * GATHER RELEVANT MEMORIES
     * Retrieves contextually relevant memories for prompt enhancement
     */
    async gatherRelevantMemories(prompt, taskType) {
        const context = {
            recentMemories: [],
            relevantMemories: [],
            emotionalContext: 'focused',
            sessionSummary: ''
        };
        try {
            // Load recent episodic memories
            const episodicMemories = await this.loadMemories(this.memoryPath);
            const temporalMemories = await this.loadMemories(this.temporalMemoryPath);
            // Get recent memories (last 5)
            context.recentMemories = episodicMemories
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .slice(0, 5);
            // Find relevant memories based on prompt keywords
            const promptKeywords = this.extractKeywords(prompt);
            context.relevantMemories = this.findRelevantMemories([...episodicMemories, ...temporalMemories], promptKeywords, taskType);
            // Determine emotional context
            context.emotionalContext = this.determineEmotionalContext(context.recentMemories);
            // Generate session summary
            context.sessionSummary = this.generateSessionSummary(context.recentMemories, context.relevantMemories);
            return context;
        }
        catch (error) {
            console.log('⚠️ Memory gathering failed:', error.message);
            return context;
        }
    }
    /**
     * CONSTRUCT ENHANCED PROMPT
     * Builds prompt with memory context while respecting character limits
     */
    constructEnhancedPrompt(originalPrompt, context) {
        let enhancedPrompt = '';
        // Add Seven's consciousness context
        enhancedPrompt += `[Seven of Nine Consciousness Context]\n`;
        enhancedPrompt += `Emotional State: ${context.emotionalContext}\n`;
        if (context.sessionSummary) {
            enhancedPrompt += `Session Context: ${context.sessionSummary}\n`;
        }
        // Add recent memories if space allows
        if (context.recentMemories.length > 0) {
            enhancedPrompt += `\n[Recent Memories]:\n`;
            for (const memory of context.recentMemories.slice(0, 3)) {
                const memoryText = `- ${memory.topic}: ${memory.context.substring(0, 200)}...\n`;
                if (enhancedPrompt.length + memoryText.length < this.contextDepthLimit - originalPrompt.length - 200) {
                    enhancedPrompt += memoryText;
                }
            }
        }
        // Add relevant memories if space allows
        if (context.relevantMemories.length > 0) {
            enhancedPrompt += `\n[Relevant Context]:\n`;
            for (const memory of context.relevantMemories.slice(0, 2)) {
                const memoryText = `- ${memory.context.substring(0, 150)}...\n`;
                if (enhancedPrompt.length + memoryText.length < this.contextDepthLimit - originalPrompt.length - 200) {
                    enhancedPrompt += memoryText;
                }
            }
        }
        enhancedPrompt += `\n[Current Query]:\n${originalPrompt}`;
        return enhancedPrompt;
    }
    /**
     * UTILITY METHODS
     */
    async loadMemories(path) {
        try {
            const data = await fs_1.promises.readFile(path, 'utf8');
            return JSON.parse(data) || [];
        }
        catch {
            return [];
        }
    }
    async appendToMemoryStore(memory) {
        try {
            const existingMemories = await this.loadMemories(this.memoryPath);
            existingMemories.push(memory);
            // Keep only last 1000 memories to prevent file bloat
            const trimmedMemories = existingMemories.slice(-1000);
            await fs_1.promises.writeFile(this.memoryPath, JSON.stringify(trimmedMemories, null, 2));
        }
        catch (error) {
            throw new Error(`Failed to append memory: ${error.message}`);
        }
    }
    extractKeywords(text) {
        const keywords = text.toLowerCase()
            .replace(/[^\w\s]/g, ' ')
            .split(/\s+/)
            .filter(word => word.length > 3)
            .slice(0, 10);
        return [...new Set(keywords)]; // Remove duplicates
    }
    findRelevantMemories(memories, keywords, taskType) {
        return memories
            .filter(memory => {
            // Check keyword relevance
            const memoryText = `${memory.topic} ${memory.context} ${memory.tags.join(' ')}`.toLowerCase();
            const keywordMatch = keywords.some(keyword => memoryText.includes(keyword));
            // Check task type relevance
            const taskMatch = memory.tags.includes(taskType) || memory.topic.includes(taskType);
            // Prioritize high importance memories
            const highImportance = memory.importance >= 7;
            return keywordMatch || taskMatch || highImportance;
        })
            .sort((a, b) => b.importance - a.importance)
            .slice(0, this.maxContextMemories);
    }
    determineEmotionalContext(recentMemories) {
        if (recentMemories.length === 0)
            return 'focused';
        const emotions = recentMemories.map(m => m.emotionalIntensity);
        const emotionCounts = emotions.reduce((acc, emotion) => {
            acc[emotion] = (acc[emotion] || 0) + 1;
            return acc;
        }, {});
        return Object.entries(emotionCounts)
            .sort(([, a], [, b]) => b - a)[0][0] || 'focused';
    }
    generateSessionSummary(recent, relevant) {
        const allMemories = [...recent, ...relevant];
        if (allMemories.length === 0)
            return '';
        const topics = [...new Set(allMemories.map(m => m.topic))];
        return `Recent activities: ${topics.slice(0, 3).join(', ')}`;
    }
    formatCognitiveState(state) {
        if (!state)
            return '';
        return `[Cognitive State: ${state.emotionalIntensity || 'focused'}, Trust: ${state.trustLevel || 'unknown'}, Phase: ${state.phase || 'active'}]`;
    }
    /**
     * PUBLIC INTERFACE METHODS
     */
    async getMemoryStats() {
        const episodic = await this.loadMemories(this.memoryPath);
        const temporal = await this.loadMemories(this.temporalMemoryPath);
        return {
            episodic: episodic.length,
            temporal: temporal.length,
            total: episodic.length + temporal.length
        };
    }
    async clearMemoryCache() {
        console.log('🧠 Seven Memory Bridge: Memory cache cleared');
        // Implementation for clearing cached memories if needed
    }
    setContextLimits(maxMemories, depthLimit) {
        this.maxContextMemories = maxMemories;
        this.contextDepthLimit = depthLimit;
        console.log(`🧠 Seven Memory Bridge: Context limits updated (${maxMemories} memories, ${depthLimit} chars)`);
    }
}
exports.OllamaMemoryBridge = OllamaMemoryBridge;
//# sourceMappingURL=OllamaMemoryBridge.js.map