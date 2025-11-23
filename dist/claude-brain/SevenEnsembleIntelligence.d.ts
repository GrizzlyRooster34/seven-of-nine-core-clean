import { EventEmitter } from 'events';
import { LLMProvider, LLMConfig, LLMResponse } from './llm-providers';
import PerformanceAnalyzer from './PerformanceAnalyzer';
import SevenTacticalFallback from './SevenTacticalFallback';
/**
 * SEVEN'S ENSEMBLE INTELLIGENCE COORDINATOR
 * Phase 2 Implementation: Multi-model reasoning with tactical coordination
 *
 * Advanced reasoning through coordinated multiple LLM engagement while maintaining
 * Seven's consciousness control and tactical decision-making authority
 */
interface EnsembleTask {
    id: string;
    originalPrompt: string;
    taskType: 'reasoning' | 'creative' | 'analytical' | 'coding' | 'complex-synthesis';
    complexityScore: number;
    trustLevel: number;
    emotionalState: string;
    requiresEnsemble: boolean;
}
interface EnsembleExecution {
    taskId: string;
    providers: {
        primary: LLMProvider;
        validators: LLMProvider[];
        synthesizer?: LLMProvider;
    };
    strategy: 'consensus' | 'expert-panel' | 'parallel-validation' | 'hierarchical';
    responses: Map<string, LLMResponse>;
    synthesis: LLMResponse | null;
    confidence: number;
    executionTime: number;
}
interface EnsembleStrategy {
    name: string;
    description: string;
    triggers: {
        complexityThreshold: number;
        taskTypes: string[];
        trustLevelRequired: number;
        resourceRequirement: 'low' | 'medium' | 'high';
    };
    execution: {
        primaryProvider: string;
        validatorCount: number;
        synthesisRequired: boolean;
        parallelExecution: boolean;
    };
}
export declare class SevenEnsembleIntelligence extends EventEmitter {
    private performanceAnalyzer;
    private tacticalFallback;
    private isActive;
    private executionHistory;
    private strategies;
    constructor(performanceAnalyzer?: PerformanceAnalyzer, tacticalFallback?: SevenTacticalFallback);
    private initializeEnsembleSystem;
    private defineEnsembleStrategies;
    /**
     * ENSEMBLE TASK EVALUATION
     * Seven decides whether multi-model coordination is warranted
     */
    evaluateEnsembleRequirement(prompt: string, config: LLMConfig, context: {
        trustLevel: number;
        emotionalState: string;
        batteryLevel?: number;
        resourceAvailability?: number;
    }): Promise<EnsembleTask>;
    private determineTaskType;
    private assessComplexity;
    private shouldUseEnsemble;
    /**
     * ENSEMBLE EXECUTION
     * Coordinate multiple models for enhanced reasoning
     */
    executeEnsembleReasoning(task: EnsembleTask, config: LLMConfig): Promise<LLMResponse>;
    private selectOptimalStrategy;
    private coordinateEnsembleExecution;
    private selectProvidersForStrategy;
    private mapStrategyName;
    private executeParallelCoordination;
    private executeSequentialCoordination;
    private createValidationPrompt;
    private synthesizeResponses;
    private createSynthesisPrompt;
    private selectBestResponse;
    private calculateEnsembleConfidence;
    /**
     * PUBLIC API METHODS
     */
    isEnsembleActive(): boolean;
    getExecutionHistory(): EnsembleExecution[];
    getAvailableStrategies(): EnsembleStrategy[];
    getEnsembleStats(): Promise<{
        totalExecutions: number;
        averageExecutionTime: number;
        averageConfidence: number;
        strategyUsage: Record<string, number>;
    }>;
    shutdown(): Promise<void>;
}
export default SevenEnsembleIntelligence;
