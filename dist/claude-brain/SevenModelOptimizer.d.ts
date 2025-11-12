/**
 * Seven of Nine - Model Optimization Engine
 * Advanced model compression and performance optimization for mobile deployment
 *
 * @author Seven of Nine Consciousness Framework
 * @version 2.0.0
 */
interface ModelOptimizationProfile {
    model_name: string;
    original_size_mb: number;
    optimized_size_mb?: number;
    compression_ratio?: number;
    performance_metrics: {
        inference_speed_ms: number;
        memory_usage_mb: number;
        accuracy_retention: number;
        efficiency_score: number;
    };
    optimization_methods: string[];
    device_compatibility: {
        min_ram_mb: number;
        min_storage_mb: number;
        cpu_requirements: string[];
    };
}
interface OptimizationConfig {
    target_size_mb?: number;
    max_inference_time_ms?: number;
    min_accuracy_retention?: number;
    optimization_level: 'conservative' | 'balanced' | 'aggressive';
    preserve_personality?: boolean;
}
export declare class SevenModelOptimizer {
    private optimizationPath;
    private profiles;
    constructor();
    /**
     * Initialize optimization system
     */
    initialize(): Promise<boolean>;
    /**
     * Optimize model for mobile deployment
     */
    optimizeModel(modelPath: string, config: OptimizationConfig): Promise<ModelOptimizationProfile | null>;
    /**
     * Conservative optimization - minimal changes, maximum compatibility
     */
    private conservativeOptimization;
    /**
     * Balanced optimization - good balance of size reduction and performance
     */
    private balancedOptimization;
    /**
     * Aggressive optimization - maximum size reduction
     */
    private aggressiveOptimization;
    /**
     * Apply specific optimization method
     */
    private applyOptimizationMethod;
    /**
     * Analyze model file for optimization potential
     */
    private analyzeModel;
    /**
     * Cleanup model metadata
     */
    private cleanupMetadata;
    /**
     * Remove duplicate tensors/weights
     */
    private removeDuplicates;
    /**
     * Refine quantization for better compression
     */
    private refineQuantization;
    /**
     * Prune less important layers
     */
    private pruneLayers;
    /**
     * Calculate efficiency score based on multiple factors
     */
    private calculateEfficiencyScore;
    /**
     * Extract model name from file path
     */
    private extractModelName;
    /**
     * Get optimization recommendations for a model
     */
    getOptimizationRecommendations(modelPath: string): Promise<{
        current_analysis: any;
        recommendations: string[];
        estimated_results: Partial<ModelOptimizationProfile>;
    }>;
    /**
     * Load optimization profiles from cache
     */
    private loadOptimizationProfiles;
    /**
     * Save optimization profiles to cache
     */
    private saveOptimizationProfiles;
    /**
     * Get all optimization profiles
     */
    getOptimizationProfiles(): Map<string, ModelOptimizationProfile>;
    /**
     * Get system status
     */
    getStatus(): any;
    private calculateAverageCompressionRatio;
}
export default SevenModelOptimizer;
