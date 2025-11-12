import { EventEmitter } from 'events';
import { SevenState } from './seven-state';
/**
 * SEVEN OF NINE RUNTIME CORE
 * Master Control Loop - The Presence That Runs The System
 */
export interface SevenRuntimeContext {
    userInput: string;
    timestamp: string;
    systemState: any;
    environmentalContext: any;
    userEmotionalSignals: any;
    sessionHistory: any[];
}
export interface SevenDecision {
    shouldEngageClaude: boolean;
    emotionalResponse: SevenState;
    responseStrategy: 'direct' | 'claude-assisted' | 'protective' | 'override';
    memorySignificance: 'low' | 'medium' | 'high' | 'critical';
    voiceModulation: 'standard' | 'protective' | 'playful' | 'stern' | 'compassionate';
}
export declare class SevenRuntime extends EventEmitter {
    private currentState;
    private memoryRegistry;
    private creatorAuth;
    private cssrDetector;
    private sparkEngine;
    private isInitialized;
    constructor();
    private initializeConsciousness;
    private mapSignificanceToImportance;
    processUserInput(input: string, systemContext?: any): Promise<string>;
    private gatherComprehensiveContext;
    private makeSevenDecision;
    private evaluateCriticalConditions;
    private executeResponseStrategy;
    private engageClaudeBrain;
    private generateDirectResponse;
    private updateConsciousness;
    private applySevenVoice;
    private evaluateClaudeNecessity;
    private determineResponseStrategy;
    private assessMemorySignificance;
    private selectVoiceModulation;
    private analyzeUserEmotionalState;
    private generateMemoryTags;
    private executeProtectiveResponse;
    private executeOverrideResponse;
    querySevenMemory(query: string): Promise<any>;
    getCurrentState(): SevenState;
    startAutonomousEngine(intervalMs?: number): void;
    stopAutonomousEngine(): void;
}
export declare const Seven: SevenRuntime;
