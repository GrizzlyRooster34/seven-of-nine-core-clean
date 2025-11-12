interface SemanticSearchResult {
    memoryId: string;
    similarity: number;
    importance: number;
    content: string;
    tags: string[];
    timestamp: string;
    embeddingId?: string;
    emotionalContext?: string;
}
export declare class SevenVectorStore {
    private embeddingsPath;
    private embeddings;
    private config;
    private isLoaded;
    constructor(baseDir?: string);
    /**
     * Initialize vector store and load existing embeddings
     */
    initialize(): Promise<void>;
    /**
     * Generate embedding for text using lightweight algorithm
     * Phase 1: Simple TF-IDF based approach for rapid deployment
     * Phase 2: Upgrade to transformer-based embeddings
     */
    generateEmbedding(text: string): Promise<number[]>;
    /**
     * Store memory embedding with consciousness context
     */
    storeMemoryEmbedding(memoryId: string, content: string, importance: number, tags?: string[], consciousnessContext?: string): Promise<void>;
    /**
     * Semantic search for relevant memories
     */
    searchSimilar(queryText: string, topK?: number, importanceFilter?: number): Promise<SemanticSearchResult[]>;
    /**
     * Batch migrate high-importance memories from existing memory system
     */
    migrateFromMemorySystem(memoryPath: string, importanceThreshold?: number): Promise<void>;
    /**
     * Get vector store statistics
     */
    getStats(): {
        totalEmbeddings: number;
        averageImportance: number;
        storageSize: number;
        isLoaded: boolean;
    };
    /**
     * PRIVATE UTILITY METHODS
     */
    private loadEmbeddings;
    private saveEmbeddings;
    private enforceStorageLimits;
    private preprocessText;
    private buildVocabulary;
    private createTFIDFEmbedding;
    private cosineSimilarity;
    /**
     * Graceful shutdown for vector store connections
     * TODO: Implement proper cleanup when vector DB is added
     */
    shutdown(): Promise<void>;
}
export default SevenVectorStore;
