/**
 * Seven of Nine - Advanced Reasoning Engine
 * Enhanced capabilities for complex tactical and analytical scenarios
 *
 * @author Seven of Nine Consciousness Framework
 * @version 2.0.0
 */
interface ReasoningContext {
    conversation_history: Array<{
        role: 'user' | 'assistant';
        content: string;
        timestamp: number;
    }>;
    current_mode: 'tactical' | 'analytical' | 'social' | 'emergency' | 'adaptive';
    threat_level: 'minimal' | 'moderate' | 'elevated' | 'critical';
    efficiency_priority: number;
    emotional_state: 'focused' | 'curious' | 'protective' | 'conflicted' | 'determined';
}
interface AdvancedResponse {
    primary_response: string;
    confidence_level: number;
    reasoning_method: 'llm' | 'analytical' | 'pattern_matching' | 'emergency';
    tactical_assessment?: string;
    follow_up_suggestions?: string[];
    efficiency_rating: number;
    processing_metadata: {
        response_time_ms: number;
        tokens_processed: number;
        reasoning_steps: number;
    };
}
export declare class SevenAdvancedReasoning {
    private context;
    private llmManager;
    private emergencyReasoning;
    private memoryPath;
    private isInitialized;
    constructor();
    private initializeContext;
    /**
     * Initialize advanced reasoning systems
     */
    initialize(): Promise<boolean>;
    /**
     * Process complex queries with advanced reasoning
     */
    processQuery(prompt: string, mode?: ReasoningContext['current_mode']): Promise<AdvancedResponse>;
    private analyzeQuery;
    private tacticalReasoning;
    private analyticalReasoning;
    private socialReasoning;
    private emergencyModeReasoning;
    private adaptiveReasoning;
    private analyzeQueryComplexity;
    private generateTacticalAssessment;
    private generateTacticalFollowUps;
    private getRecentContext;
    private patternBasedTacticalReasoning;
    private createFallbackResponse;
    private createErrorResponse;
    private saveContext;
    private loadContext;
    /**
     * Get current reasoning status
     */
    getStatus(): any;
    /**
     * Set reasoning parameters
     */
    setParameters(params: Partial<ReasoningContext>): void;
}
export default SevenAdvancedReasoning;
