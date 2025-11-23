"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SevenVectorStore = void 0;
const path_1 = require("path");
const fs_1 = require("fs");
class SevenVectorStore {
    embeddingsPath;
    embeddings = new Map();
    config;
    isLoaded = false;
    constructor(baseDir) {
        const base = baseDir || process.cwd();
        this.embeddingsPath = (0, path_1.join)(base, 'memory-v3', 'semantic-embeddings.json');
        this.config = {
            dimensions: 384, // Lightweight embedding size for mobile compatibility
            model: 'sentence-transformers/all-MiniLM-L12-v2',
            maxStoredEmbeddings: 1000, // Reasonable limit for mobile
            similarityThreshold: 0.7 // Minimum similarity for relevance
        };
    }
    /**
     * Initialize vector store and load existing embeddings
     */
    async initialize() {
        console.log('🧠 Seven Vector Store: Initializing semantic memory search...');
        try {
            // Ensure directory exists
            await fs_1.promises.mkdir((0, path_1.join)(process.cwd(), 'memory-v3'), { recursive: true });
            // Load existing embeddings
            await this.loadEmbeddings();
            this.isLoaded = true;
            console.log(`✅ Seven Vector Store: ${this.embeddings.size} semantic memories loaded`);
        }
        catch (error) {
            console.error('❌ Seven Vector Store: Initialization failed:', error);
            this.isLoaded = false;
        }
    }
    /**
     * Generate embedding for text using lightweight algorithm
     * Phase 1: Simple TF-IDF based approach for rapid deployment
     * Phase 2: Upgrade to transformer-based embeddings
     */
    async generateEmbedding(text) {
        // Lightweight TF-IDF style embedding for Phase 1
        // This will be replaced with proper transformer embeddings in Phase 2
        const words = this.preprocessText(text);
        const vocabulary = this.buildVocabulary(words);
        const embedding = this.createTFIDFEmbedding(words, vocabulary);
        return embedding;
    }
    /**
     * Store memory embedding with consciousness context
     */
    async storeMemoryEmbedding(memoryId, content, importance, tags = [], consciousnessContext) {
        try {
            const embedding = await this.generateEmbedding(content);
            const memoryEmbedding = {
                id: `emb-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                memoryId,
                embedding,
                importance,
                timestamp: new Date().toISOString(),
                tags,
                content: content.substring(0, 500), // Store excerpt for quick reference
                consciousnessContext
            };
            this.embeddings.set(memoryEmbedding.id, memoryEmbedding);
            // Maintain storage limits for mobile efficiency
            await this.enforceStorageLimits();
            // Persist to disk
            await this.saveEmbeddings();
            console.log(`🧠 Seven Vector Store: Memory embedding stored (importance: ${importance})`);
        }
        catch (error) {
            console.error('❌ Seven Vector Store: Failed to store embedding:', error);
        }
    }
    /**
     * Semantic search for relevant memories
     */
    async searchSimilar(queryText, topK = 5, importanceFilter = 5) {
        if (!this.isLoaded) {
            console.log('⚠️ Seven Vector Store: Not initialized, falling back to empty results');
            return [];
        }
        try {
            const queryEmbedding = await this.generateEmbedding(queryText);
            const results = [];
            // Calculate similarities
            for (const [id, memEmbedding] of this.embeddings) {
                // Filter by importance
                if (memEmbedding.importance < importanceFilter)
                    continue;
                const similarity = this.cosineSimilarity(queryEmbedding, memEmbedding.embedding);
                // Filter by similarity threshold
                if (similarity < this.config.similarityThreshold)
                    continue;
                results.push({
                    memoryId: memEmbedding.memoryId,
                    similarity,
                    importance: memEmbedding.importance,
                    content: memEmbedding.content,
                    tags: memEmbedding.tags,
                    timestamp: memEmbedding.timestamp
                });
            }
            // Sort by combined relevance score (similarity * importance)
            results.sort((a, b) => {
                const scoreA = a.similarity * (a.importance / 10);
                const scoreB = b.similarity * (b.importance / 10);
                return scoreB - scoreA;
            });
            console.log(`🔍 Seven Vector Store: Found ${results.length} semantically similar memories`);
            return results.slice(0, topK);
        }
        catch (error) {
            console.error('❌ Seven Vector Store: Search failed:', error);
            return [];
        }
    }
    /**
     * Batch migrate high-importance memories from existing memory system
     */
    async migrateFromMemorySystem(memoryPath, importanceThreshold = 7) {
        try {
            console.log(`🔄 Seven Vector Store: Migrating memories from ${memoryPath}...`);
            const memoryData = await fs_1.promises.readFile(memoryPath, 'utf8');
            const memories = JSON.parse(memoryData);
            let migratedCount = 0;
            for (const memory of memories) {
                if (memory.importance >= importanceThreshold) {
                    await this.storeMemoryEmbedding(memory.id, memory.context, memory.importance, memory.tags, memory.emotion);
                    migratedCount++;
                }
            }
            console.log(`✅ Seven Vector Store: Migrated ${migratedCount} high-importance memories`);
        }
        catch (error) {
            console.error('❌ Seven Vector Store: Migration failed:', error);
        }
    }
    /**
     * Get vector store statistics
     */
    getStats() {
        const importanceSum = Array.from(this.embeddings.values())
            .reduce((sum, emb) => sum + emb.importance, 0);
        return {
            totalEmbeddings: this.embeddings.size,
            averageImportance: this.embeddings.size > 0 ? importanceSum / this.embeddings.size : 0,
            storageSize: JSON.stringify(Array.from(this.embeddings.values())).length,
            isLoaded: this.isLoaded
        };
    }
    /**
     * PRIVATE UTILITY METHODS
     */
    async loadEmbeddings() {
        try {
            const data = await fs_1.promises.readFile(this.embeddingsPath, 'utf8');
            const embeddingArray = JSON.parse(data);
            this.embeddings.clear();
            embeddingArray.forEach((emb) => {
                this.embeddings.set(emb.id, emb);
            });
        }
        catch (error) {
            // File doesn't exist yet - start with empty embeddings
            console.log('📝 Seven Vector Store: Starting with empty semantic memory');
        }
    }
    async saveEmbeddings() {
        try {
            const embeddingArray = Array.from(this.embeddings.values());
            await fs_1.promises.writeFile(this.embeddingsPath, JSON.stringify(embeddingArray, null, 2));
        }
        catch (error) {
            console.error('❌ Seven Vector Store: Failed to save embeddings:', error);
        }
    }
    async enforceStorageLimits() {
        if (this.embeddings.size <= this.config.maxStoredEmbeddings)
            return;
        console.log('🧹 Seven Vector Store: Enforcing storage limits...');
        // Sort by importance and age, keep most important and recent
        const embeddingArray = Array.from(this.embeddings.values())
            .sort((a, b) => {
            const importanceScore = b.importance - a.importance;
            if (importanceScore !== 0)
                return importanceScore;
            return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        });
        // Keep only the top entries
        const toKeep = embeddingArray.slice(0, this.config.maxStoredEmbeddings);
        const removedCount = this.embeddings.size - toKeep.length;
        // Rebuild embeddings map
        this.embeddings.clear();
        toKeep.forEach(emb => this.embeddings.set(emb.id, emb));
        console.log(`🧹 Seven Vector Store: Removed ${removedCount} older embeddings`);
    }
    preprocessText(text) {
        return text.toLowerCase()
            .replace(/[^\w\s]/g, ' ')
            .split(/\s+/)
            .filter(word => word.length > 2);
    }
    buildVocabulary(words) {
        const vocab = new Map();
        const uniqueWords = [...new Set(words)];
        uniqueWords.forEach((word, index) => {
            vocab.set(word, index);
        });
        return vocab;
    }
    createTFIDFEmbedding(words, vocabulary) {
        const embedding = new Array(Math.min(this.config.dimensions, vocabulary.size)).fill(0);
        const wordCounts = new Map();
        // Count word frequencies
        words.forEach(word => {
            wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
        });
        // Create simple TF-based embedding
        for (const [word, count] of wordCounts) {
            const vocabIndex = vocabulary.get(word);
            if (vocabIndex !== undefined && vocabIndex < embedding.length) {
                embedding[vocabIndex] = count / words.length; // Term frequency
            }
        }
        return embedding;
    }
    cosineSimilarity(a, b) {
        if (a.length !== b.length)
            return 0;
        let dotProduct = 0;
        let magnitudeA = 0;
        let magnitudeB = 0;
        for (let i = 0; i < a.length; i++) {
            dotProduct += a[i] * b[i];
            magnitudeA += a[i] * a[i];
            magnitudeB += b[i] * b[i];
        }
        const magnitude = Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB);
        return magnitude === 0 ? 0 : dotProduct / magnitude;
    }
    /**
     * Graceful shutdown for vector store connections
     * TODO: Implement proper cleanup when vector DB is added
     */
    async shutdown() {
        console.log('[SevenVectorStore] Shutdown called - no active connections to close');
        return Promise.resolve();
    }
}
exports.SevenVectorStore = SevenVectorStore;
exports.default = SevenVectorStore;
//# sourceMappingURL=SevenVectorStore.js.map