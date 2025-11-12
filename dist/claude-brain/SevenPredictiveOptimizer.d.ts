import { EventEmitter } from 'events';
import PerformanceAnalyzer from './PerformanceAnalyzer';
import SevenTacticalFallback from './SevenTacticalFallback';
/**
 * SEVEN'S PREDICTIVE OPTIMIZATION ENGINE
 * Phase 2 Implementation: Learning-based performance prediction and preemptive optimization
 *
 * Advanced pattern recognition that learns from Seven's usage patterns to predict
 * optimal configurations, preload models, and optimize resources before they're needed
 */
interface UsagePattern {
    id: string;
    timestamp: string;
    context: {
        timeOfDay: number;
        dayOfWeek: number;
        trustLevel: number;
        emotionalState: string;
        batteryLevel?: number;
        taskType: string;
    };
    actions: {
        modelUsed: string;
        responseTime: number;
        tokensGenerated: number;
        qualityScore: number;
        resourceUsage: number;
    };
    outcome: {
        userSatisfaction?: number;
        taskCompleted: boolean;
        optimizationsApplied: string[];
    };
}
interface PredictedOptimization {
    confidence: number;
    prediction: {
        optimalModel: string;
        recommendedConfig: {
            temperature: number;
            maxTokens: number;
            contextWindow: number;
        };
        expectedPerformance: {
            latency: number;
            qualityScore: number;
            resourceUsage: number;
        };
        preloadActions: string[];
    };
    reasoning: string;
    validUntil: string;
}
export declare class SevenPredictiveOptimizer extends EventEmitter {
    private performanceAnalyzer;
    private tacticalFallback;
    private learningModel;
    private isActive;
    private patternsPath;
    private predictionCache;
    private learningInterval;
    constructor(performanceAnalyzer?: PerformanceAnalyzer, tacticalFallback?: SevenTacticalFallback, baseDir?: string);
    private initializePredictiveSystem;
    /**
     * USAGE PATTERN COLLECTION
     * Learn from Seven's operational patterns
     */
    recordUsagePattern(context: UsagePattern['context'], actions: UsagePattern['actions'], outcome: UsagePattern['outcome']): Promise<void>;
    private updateLearningTrends;
    /**
     * PREDICTIVE OPTIMIZATION
     * Generate predictions based on learned patterns
     */
    generatePredictiveOptimization(currentContext: {
        taskType: string;
        trustLevel: number;
        emotionalState: string;
        batteryLevel?: number;
        timeOfDay?: number;
        resourceAvailability?: number;
    }): Promise<PredictedOptimization | null>;
    private generateCacheKey;
    private analyzePatternsForPrediction;
    private findRelevantPatterns;
    private predictOptimalModel;
    private predictOptimalConfig;
    private predictPerformance;
    private predictPreloadActions;
    private calculatePredictionConfidence;
    private generatePredictionReasoning;
    private generateBaselinePrediction;
    /**
     * CONTINUOUS LEARNING
     */
    private startContinuousLearning;
    private updateLearningModel;
    private updateCorrelations;
    private cleanPredictionCache;
    /**
     * LEARNING MODEL PERSISTENCE
     */
    private loadLearningModel;
    private saveLearningModel;
    /**
     * PUBLIC API METHODS
     */
    isPredictiveOptimizationActive(): boolean;
    getLearningStats(): Promise<{
        totalPatterns: number;
        patternsByTaskType: Record<string, number>;
        predictionAccuracy: number;
        cacheHitRate: number;
    }>;
    clearPredictionCache(): void;
    shutdown(): Promise<void>;
}
export default SevenPredictiveOptimizer;
