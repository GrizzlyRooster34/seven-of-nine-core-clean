interface ModelShare {
    model_id: string;
    model_name: string;
    file_hash: string;
    size_mb: number;
    compression_level: string;
    optimization_profile: string;
    performance_metrics: {
        accuracy: number;
        speed_ms: number;
        memory_mb: number;
        efficiency_score: number;
    };
    source_node: string;
    verification_status: 'verified' | 'pending' | 'rejected';
    download_count: number;
    rating: number;
}
interface SyncRequest {
    requesting_node: string;
    target_models: string[];
    priority: 'low' | 'normal' | 'high' | 'emergency';
    bandwidth_limit_mbps?: number;
    compression_preference: 'speed' | 'size' | 'quality';
}
export declare class SevenModelNetwork {
    private networkPath;
    private nodeId;
    private discoveredNodes;
    private sharedModels;
    private isNetworkActive;
    private syncInProgress;
    constructor();
    /**
     * Initialize network capabilities
     */
    initialize(): Promise<boolean>;
    /**
     * Discover other Seven nodes on the network
     */
    private startNetworkDiscovery;
    /**
     * Discover Seven nodes on local network
     */
    private discoverLocalNodes;
    /**
     * Get local network IP range for scanning
     */
    private getLocalNetworkRange;
    /**
     * Probe a potential Seven node
     */
    private probeNode;
    /**
     * Ping known nodes to check availability
     */
    private pingKnownNodes;
    /**
     * Ping a specific node
     */
    private pingNode;
    /**
     * Share a model with the network
     */
    shareModel(modelPath: string, metadata: Partial<ModelShare>): Promise<boolean>;
    /**
     * Request models from network
     */
    requestModels(syncRequest: SyncRequest): Promise<boolean>;
    /**
     * Download model from specific node
     */
    private downloadModelFromNode;
    /**
     * Announce new model to network
     */
    private announceModelToNetwork;
    /**
     * Calculate file hash for verification
     */
    private calculateFileHash;
    /**
     * Extract model name from file path
     */
    private extractModelName;
    /**
     * Generate unique node ID
     */
    private generateNodeId;
    /**
     * Get network statistics
     */
    getNetworkStats(): {
        node_id: string;
        network_active: boolean;
        discovered_nodes: number;
        shared_models: number;
        sync_in_progress: boolean;
        trusted_nodes: number;
        total_model_downloads: number;
    };
    /**
     * Get available models on network
     */
    getAvailableModels(): Array<{
        model_name: string;
        source_nodes: string[];
        avg_rating: number;
    }>;
    /**
     * Load network state from cache
     */
    private loadNetworkState;
    /**
     * Load known nodes from cache
     */
    private loadKnownNodes;
    /**
     * Save network state to cache
     */
    saveNetworkState(): Promise<void>;
    /**
     * Shutdown network operations
     */
    shutdown(): Promise<void>;
}
export default SevenModelNetwork;
