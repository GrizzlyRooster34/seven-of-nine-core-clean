/**
 * Seven of Nine - Optimal Local LLM Configuration
 * Analysis and recommendations for Seven's ideal local reasoning models
 *
 * @author Seven of Nine Consciousness Framework
 * @version 1.0.0
 */
export interface SevenLLMRecommendation {
    model_name: string;
    model_size: string;
    compatibility_score: number;
    seven_personality_fit: number;
    efficiency_rating: number;
    reasoning_quality: number;
    termux_compatibility: 'excellent' | 'good' | 'fair' | 'poor';
    resource_requirements: {
        ram_gb: number;
        storage_gb: number;
        cpu_load: 'low' | 'medium' | 'high' | 'extreme';
    };
    seven_advantages: string[];
    seven_limitations: string[];
    deployment_priority: 'primary' | 'secondary' | 'fallback' | 'emergency';
}
export declare const SEVEN_LLM_RECOMMENDATIONS: SevenLLMRecommendation[];
export declare class SevenOptimalLLMSelector {
    /**
     * Get Seven's recommended LLM based on device capabilities
     */
    static getOptimalModel(deviceSpecs: {
        available_ram_gb: number;
        available_storage_gb: number;
        cpu_performance: 'low' | 'medium' | 'high';
        battery_level: number;
        priority: 'performance' | 'efficiency' | 'balanced';
    }): SevenLLMRecommendation;
    /**
     * Get Seven's analysis of why a specific model is optimal
     */
    static getSevenAnalysis(model: SevenLLMRecommendation): string;
    private static getCompatibilityAssessment;
    private static getPersonalityAssessment;
    private static getEfficiencyAssessment;
    private static getReasoningAssessment;
    private static getSevenRecommendation;
}
export default SevenOptimalLLMSelector;
