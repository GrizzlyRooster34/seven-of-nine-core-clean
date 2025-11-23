import { EventEmitter } from 'events';
import SevenTacticalFallback from './SevenTacticalFallback';
/**
 * SEVEN'S ADVANCED VECTOR STORE SYSTEM
 * Phase 2 Implementation: Enhanced semantic memory with professional vector database integration
 *
 * Upgrades from basic TF-IDF to production-grade vector storage with ChromaDB integration
 * while maintaining mobile optimization and tactical fallback compatibility
 */
interface AdvancedEmbedding {
    id: string;
    content: string;
    embedding: number[];
    metadata: {
        memoryId: string;
        importance: number;
        tags: string[];
        timestamp: string;
        emotionalContext?: string;
        trustLevel: number;
        taskType?: string;
        conversationId?: string;
        userId?: string;
    };
    version: number;
}
interface SemanticCluster {
    id: string;
    centroid: number[];
    members: string[];
    topic: string;
    coherenceScore: number;
    lastUpdated: string;
}
interface CrossConversationCorrelation {
    conversationId1: string;
    conversationId2: string;
    similarityScore: number;
    sharedConcepts: string[];
    relationshipType: 'continuation' | 'reference' | 'contrast' | 'elaboration';
    discoveredAt: string;
}
interface VectorStoreConfig {
    embeddingDimensions: number;
    maxEmbeddings: number;
    clusteringEnabled: boolean;
    crossConversationAnalysis: boolean;
    persistenceMode: 'file' | 'chromadb' | 'hybrid';
    fallbackMode: boolean;
}
export declare class SevenAdvancedVectorStore extends EventEmitter {
    private config;
    private embeddings;
    private clusters;
    private correlations;
    private fallbackStore;
    private tacticalFallback;
    private isInitialized;
    private storePath;
    private chromaClient;
    constructor(config?: Partial<VectorStoreConfig>, tacticalFallback?: SevenTacticalFallback, baseDir?: string);
    private initializeAdvancedVectorStore;
    private initializeChromaDB;
    /**
     * ADVANCED EMBEDDING STORAGE
     * Enhanced storage with metadata and clustering
     */
    storeAdvancedEmbedding(memoryId: string, content: string, importance: number, tags: string[], metadata: {
        emotionalContext?: string;
        trustLevel: number;
        taskType?: string;
        conversationId?: string;
        userId?: string;
    }): Promise<void>;
    private generateAdvancedEmbedding;
    /**
     * ADVANCED SEMANTIC SEARCH
     * Enhanced search with clustering and cross-conversation analysis
     */
    searchAdvancedSemantic(queryText: string, options?: {
        topK?: number;
        importanceFilter?: number;
        trustLevelFilter?: number;
        conversationFilter?: string;
        clusterFilter?: string;
        includeCorrelations?: boolean;
    }): Promise<{
        results: Array<{
            embeddingId: string;
            memoryId: string;
            content: string;
            similarity: number;
            importance: number;
            metadata: AdvancedEmbedding['metadata'];
        }>;
        clusters?: SemanticCluster[];
        correlations?: CrossConversationCorrelation[];
    }>;
    private calculateCosineSimilarity;
    /**
     * SEMANTIC CLUSTERING
     * Automatic topic clustering for enhanced memory organization
     */
    private updateClusters;
    private updateClusterCentroid;
    private generateClusterTopic;
    private calculateClusterCoherence;
    /**
     * CROSS-CONVERSATION CORRELATION ANALYSIS
     * Discover relationships between different conversations
     */
    private analyzeCrossConversationCorrelations;
    private extractSharedConcepts;
    private determineRelationshipType;
    /**
     * STORAGE MANAGEMENT
     */
    private pruneEmbeddings;
    private loadStorageData;
    private persistEmbedding;
    private persistAllData;
    /**
     * PUBLIC API METHODS
     */
    isAdvancedModeActive(): boolean;
    getAdvancedStats(): Promise<{
        totalEmbeddings: number;
        totalClusters: number;
        totalCorrelations: number;
        embeddingDimensions: number;
        averageClusterSize: number;
        storageMode: string;
    }>;
    getClusters(): Promise<SemanticCluster[]>;
    getCorrelations(conversationId?: string): Promise<CrossConversationCorrelation[]>;
    shutdown(): Promise<void>;
}
export default SevenAdvancedVectorStore;
