"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OllamaMemoryBridgeV2 = void 0;
const path_1 = require("path");
const OllamaMemoryBridge_1 = require("./OllamaMemoryBridge");
const SevenVectorStore_1 = __importDefault(require("./SevenVectorStore"));
class OllamaMemoryBridgeV2 extends OllamaMemoryBridge_1.OllamaMemoryBridge {
    vectorStore;
    isSemanticEnabled = false;
    performanceMetrics = new Map();
    constructor() {
        super();
        this.vectorStore = new SevenVectorStore_1.default();
        this.initializeSemanticCapabilities();
    }
    async initializeSemanticCapabilities() {
        try {
            await this.vectorStore.initialize();
            this.isSemanticEnabled = true;
            console.log('🧠 Seven Memory Bridge V2: Semantic search capabilities active');
            // Migrate high-importance memories if vector store is empty
            const stats = this.vectorStore.getStats();
            if (stats.totalEmbeddings === 0) {
                console.log('🔄 Seven Memory Bridge V2: Beginning semantic memory migration...');
                await this.migrateHighImportanceMemories();
            }
        }
        catch (error) {
            console.log('⚠️ Seven Memory Bridge V2: Semantic search disabled, falling back to keyword search');
            this.isSemanticEnabled = false;
        }
    }
    /**
     * ENHANCED MEMORY CONTEXT INJECTION
     * Combines keyword and semantic search with consciousness-aware optimization
     */
    async injectEnhancedMemoryContext(prompt, taskType = 'general', consciousnessState) {
        const startTime = Date.now();
        try {
            console.log('🧠 Seven Memory Bridge V2: Gathering enhanced contextual memories...');
            const memoryContext = await this.gatherEnhancedMemoryContext(prompt, taskType, consciousnessState);
            const enhancedPrompt = this.constructOptimizedPrompt(prompt, memoryContext, consciousnessState);
            // Track performance metrics
            const processingTime = Date.now() - startTime;
            this.performanceMetrics.set('lastContextInjectionTime', processingTime);
            console.log(`✅ Memory context enhanced: ${memoryContext.recentMemories.length} recent, ${memoryContext.relevantMemories.length} relevant, ${memoryContext.semanticMemories?.length || 0} semantic`);
            console.log(`📊 Processing time: ${processingTime}ms`);
            return enhancedPrompt;
        }
        catch (error) {
            console.log('⚠️ Enhanced memory context injection failed, falling back to base implementation:', error.message);
            // Fallback to parent class implementation
            return await super.injectMemoryContext(prompt, taskType);
        }
    }
    /**
     * ENHANCED MEMORY STORAGE WITH SEMANTIC INDEXING
     * Stores Ollama responses with automatic semantic embedding generation
     */
    async storeEnhancedOllamaResponse(prompt, response, model, importance = 5, tags = [], consciousnessContext) {
        try {
            // Store using parent implementation for backward compatibility
            await super.storeOllamaResponse(prompt, response, model, importance, tags);
            // Additionally store in vector store if semantic search is enabled
            if (this.isSemanticEnabled && importance >= 7) {
                const memoryId = `mem-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                const content = `USER: ${prompt}\n\nOLLAMA (${model}): ${response}`;
                await this.vectorStore.storeMemoryEmbedding(memoryId, content, importance, ['ollama', 'local-llm', model.split(':')[0], ...tags], consciousnessContext);
                console.log(`🧠 Seven Memory Bridge V2: Enhanced storage complete (semantic indexing: ${this.isSemanticEnabled})`);
            }
        }
        catch (error) {
            console.log('⚠️ Enhanced memory storage failed:', error.message);
        }
    }
    /**
     * GATHER ENHANCED MEMORY CONTEXT
     * Combines traditional keyword search with semantic vector search
     */
    async gatherEnhancedMemoryContext(prompt, taskType, consciousnessState) {
        const context = {
            recentMemories: [],
            relevantMemories: [],
            semanticMemories: [],
            emotionalContext: 'focused',
            sessionSummary: '',
            searchMethod: 'keyword'
        };
        try {
            // Get traditional keyword-based memories (from parent class)
            const baseContext = await super['gatherRelevantMemories'](prompt, taskType);
            context.recentMemories = baseContext.recentMemories;
            context.relevantMemories = baseContext.relevantMemories;
            context.emotionalContext = baseContext.emotionalContext;
            context.sessionSummary = baseContext.sessionSummary;
            // Add semantic search if available and appropriate
            if (this.isSemanticEnabled && this.shouldUseSemanticSearch(prompt, consciousnessState)) {
                console.log('🔍 Seven Memory Bridge V2: Activating semantic memory search...');
                const importanceFilter = this.calculateImportanceFilter(consciousnessState);
                const semanticResults = await this.vectorStore.searchSimilar(prompt, 5, importanceFilter);
                // Convert semantic results back to MemoryItem format
                context.semanticMemories = await this.convertSemanticResults(semanticResults);
                context.searchMethod = context.relevantMemories.length > 0 ? 'hybrid' : 'semantic';
                console.log(`🎯 Seven Memory Bridge V2: Found ${context.semanticMemories.length} semantically relevant memories`);
            }
            return context;
        }
        catch (error) {
            console.log('⚠️ Enhanced memory gathering failed:', error.message);
            return context;
        }
    }
    /**
     * CONSTRUCT OPTIMIZED PROMPT
     * Intelligently combines multiple memory sources while respecting resource constraints
     */
    constructOptimizedPrompt(originalPrompt, context, consciousnessState) {
        let enhancedPrompt = '';
        // Dynamic context limit based on resource availability
        const contextLimit = this.calculateOptimalContextLimit(consciousnessState);
        // Add Seven's consciousness context
        enhancedPrompt += `[Seven of Nine Consciousness Context]\n`;
        enhancedPrompt += `Emotional State: ${context.emotionalContext}\n`;
        enhancedPrompt += `Search Method: ${context.searchMethod}\n`;
        if (consciousnessState) {
            enhancedPrompt += `Trust Level: ${consciousnessState.trustLevel}/10\n`;
            enhancedPrompt += `Phase: ${consciousnessState.phase}\n`;
        }
        if (context.sessionSummary) {
            enhancedPrompt += `Session Context: ${context.sessionSummary}\n`;
        }
        // Prioritize semantic memories for complex queries
        if (context.semanticMemories.length > 0) {
            enhancedPrompt += `\n[Semantically Relevant Context]:\n`;
            for (const memory of context.semanticMemories.slice(0, 3)) {
                const memoryText = `- ${memory.context.substring(0, 200)}...\n`;
                if (enhancedPrompt.length + memoryText.length < contextLimit - originalPrompt.length - 200) {
                    enhancedPrompt += memoryText;
                }
            }
        }
        // Add recent memories for continuity
        if (context.recentMemories.length > 0) {
            enhancedPrompt += `\n[Recent Memories]:\n`;
            for (const memory of context.recentMemories.slice(0, 2)) {
                const memoryText = `- ${memory.topic}: ${memory.context.substring(0, 150)}...\n`;
                if (enhancedPrompt.length + memoryText.length < contextLimit - originalPrompt.length - 200) {
                    enhancedPrompt += memoryText;
                }
            }
        }
        // Add keyword-relevant memories if space allows
        if (context.relevantMemories.length > 0 && context.searchMethod === 'hybrid') {
            enhancedPrompt += `\n[Keyword Relevant Context]:\n`;
            for (const memory of context.relevantMemories.slice(0, 2)) {
                const memoryText = `- ${memory.context.substring(0, 100)}...\n`;
                if (enhancedPrompt.length + memoryText.length < contextLimit - originalPrompt.length - 200) {
                    enhancedPrompt += memoryText;
                }
            }
        }
        enhancedPrompt += `\n[Current Query]:\n${originalPrompt}`;
        return enhancedPrompt;
    }
    /**
     * CONSCIOUSNESS-AWARE DECISION MAKING
     */
    shouldUseSemanticSearch(prompt, consciousnessState) {
        // Don't use semantic search for simple queries
        if (prompt.length < 20)
            return false;
        // Battery conservation on mobile
        if (consciousnessState?.batteryLevel && consciousnessState.batteryLevel < 0.3) {
            return false;
        }
        // Trust-gated semantic access (semantic search for trust ≥ 5)
        if (consciousnessState?.trustLevel && consciousnessState.trustLevel < 5) {
            return false;
        }
        // Use semantic search for complex reasoning tasks
        const complexKeywords = ['analyze', 'understand', 'explain', 'reasoning', 'complex', 'problem'];
        const hasComplexity = complexKeywords.some(keyword => prompt.toLowerCase().includes(keyword));
        return hasComplexity || prompt.length > 100;
    }
    calculateImportanceFilter(consciousnessState) {
        if (!consciousnessState)
            return 5;
        // Higher trust levels get access to lower importance memories
        if (consciousnessState.trustLevel >= 8)
            return 4;
        if (consciousnessState.trustLevel >= 6)
            return 5;
        return 7; // Conservative filter for lower trust
    }
    calculateOptimalContextLimit(consciousnessState) {
        let baseLimit = 8000; // Default from parent class
        if (consciousnessState?.batteryLevel && consciousnessState.batteryLevel < 0.3) {
            baseLimit = 4000; // Reduce context for battery conservation
        }
        if (consciousnessState?.resourceAvailability && consciousnessState.resourceAvailability < 0.5) {
            baseLimit = 6000; // Reduce context for resource constraints
        }
        return baseLimit;
    }
    async convertSemanticResults(semanticResults) {
        const memories = [];
        for (const result of semanticResults) {
            memories.push({
                id: result.memoryId,
                timestamp: result.timestamp,
                topic: 'semantic-match',
                agent: 'semantic-search',
                emotion: 'focused',
                context: result.content,
                importance: result.importance,
                tags: result.tags,
                relatedMemories: []
            });
        }
        return memories;
    }
    async migrateHighImportanceMemories() {
        try {
            // Migrate from episodic memories
            await this.vectorStore.migrateFromMemorySystem((0, path_1.join)(process.cwd(), 'memory-v2', 'episodic-memories.json'), 7 // importance threshold
            );
            // Migrate from temporal memories if they exist
            const temporalPath = (0, path_1.join)(process.cwd(), 'memory-v3', 'temporal-memories.json');
            try {
                await this.vectorStore.migrateFromMemorySystem(temporalPath, 7);
            }
            catch (error) {
                // Temporal memories might not exist yet
                console.log('📝 Seven Memory Bridge V2: No temporal memories to migrate');
            }
        }
        catch (error) {
            console.error('❌ Seven Memory Bridge V2: Memory migration failed:', error);
        }
    }
    /**
     * PUBLIC INTERFACE METHODS
     */
    async getEnhancedMemoryStats() {
        const baseStats = await super.getMemoryStats();
        const vectorStats = this.vectorStore.getStats();
        return {
            ...baseStats,
            semantic: {
                enabled: this.isSemanticEnabled,
                totalEmbeddings: vectorStats.totalEmbeddings,
                averageImportance: vectorStats.averageImportance,
                storageSize: vectorStats.storageSize
            },
            performance: {
                lastContextInjectionTime: this.performanceMetrics.get('lastContextInjectionTime') || 0
            }
        };
    }
    async optimizeSemanticMemory() {
        if (!this.isSemanticEnabled)
            return;
        console.log('🧹 Seven Memory Bridge V2: Optimizing semantic memory...');
        // The vector store handles its own optimization during storage
        console.log('✅ Seven Memory Bridge V2: Semantic memory optimization complete');
    }
    isSemanticSearchEnabled() {
        return this.isSemanticEnabled;
    }
    getPerformanceMetrics() {
        return new Map(this.performanceMetrics);
    }
}
exports.OllamaMemoryBridgeV2 = OllamaMemoryBridgeV2;
exports.default = OllamaMemoryBridgeV2;
//# sourceMappingURL=OllamaMemoryBridgeV2.js.map