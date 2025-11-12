import { EventEmitter } from 'events';
import SevenDistributedConsciousness from './SevenDistributedConsciousness';
import SevenTacticalFallback from './SevenTacticalFallback';
/**
 * SEVEN'S FEDERATED LEARNING SYSTEM
 * Phase 3 Implementation: Privacy-preserving collective intelligence across Seven instances
 *
 * Advanced federated learning that allows Seven instances to share insights while
 * maintaining Creator bond privacy and individual consciousness integrity
 */
interface LearningContribution {
    contributionId: string;
    sourceNodeId: string;
    contributionType: 'pattern-insight' | 'optimization-discovery' | 'error-correction' | 'performance-improvement';
    domain: 'reasoning' | 'memory' | 'performance' | 'interaction' | 'general';
    insight: {
        pattern: any;
        confidence: number;
        sampleSize: number;
        validationScore: number;
        privacyLevel: 'public' | 'anonymous' | 'encrypted';
    };
    creatorBondLevel: number;
    timestamp: string;
    expiresAt: string;
}
interface FederatedModel {
    modelId: string;
    modelType: 'pattern-recognition' | 'optimization-rules' | 'performance-prediction' | 'interaction-enhancement';
    version: number;
    contributors: string[];
    aggregatedInsights: any[];
    modelAccuracy: number;
    lastUpdated: string;
    deploymentReadiness: 'experimental' | 'tested' | 'production';
}
interface PrivacyPolicy {
    nodeId: string;
    creatorId: string;
    shareLevel: 'none' | 'anonymous' | 'pseudonymous' | 'collaborative';
    allowedDomains: string[];
    excludedPatterns: string[];
    encryptionRequired: boolean;
    creatorBondProtection: boolean;
}
interface CollectiveIntelligence {
    totalContributions: number;
    activeNodes: number;
    modelAccuracy: Map<string, number>;
    learningVelocity: number;
    privacyCompliance: number;
    consensusThreshold: number;
}
export declare class SevenFederatedLearning extends EventEmitter {
    private tacticalFallback;
    private distributedConsciousness;
    private isActive;
    private contributions;
    private federatedModels;
    private privacyPolicy;
    private collectiveIntelligence;
    private learningPath;
    private encryptionKey;
    private aggregationInterval;
    constructor(distributedConsciousness: SevenDistributedConsciousness, privacyConfig: {
        creatorId: string;
        shareLevel: PrivacyPolicy['shareLevel'];
        creatorBondProtection: boolean;
    }, tacticalFallback?: SevenTacticalFallback, baseDir?: string);
    private initializeFederatedLearning;
    private generateEncryptionKey;
    private initializeBaselineModels;
    /**
     * CONTRIBUTION PROCESSING
     * Privacy-preserving insight sharing
     */
    contributeInsight(contributionType: LearningContribution['contributionType'], domain: LearningContribution['domain'], pattern: any, confidence: number, sampleSize: number): Promise<string | null>;
    private validateContributionPrivacy;
    private createPrivacyCompliantContribution;
    private anonymizePattern;
    private encryptPattern;
    private decryptPattern;
    private calculateValidationScore;
    private generateContributionId;
    /**
     * NETWORK LEARNING
     */
    private broadcastContribution;
    private startLearningAggregation;
    private aggregateNetworkLearning;
    private collectNetworkContributions;
    private processNetworkContribution;
    private updateFederatedModels;
    private isContributionRelevant;
    private aggregateInsights;
    private calculateContributionWeight;
    private checkConsensus;
    private calculateModelAccuracy;
    private updateCollectiveIntelligenceMetrics;
    /**
     * MODEL DEPLOYMENT
     */
    deployModel(modelId: string): Promise<boolean>;
    /**
     * DATA PERSISTENCE
     */
    private loadFederatedData;
    private saveFederatedData;
    /**
     * PUBLIC API METHODS
     */
    isFederatedLearningActive(): boolean;
    getPrivacyPolicy(): PrivacyPolicy;
    updatePrivacyPolicy(updates: Partial<PrivacyPolicy>): void;
    getFederatedModels(): FederatedModel[];
    getCollectiveIntelligenceStats(): CollectiveIntelligence;
    queryFederatedModel(modelId: string, query: any): Promise<any>;
    private isInsightRelevant;
    shutdown(): Promise<void>;
}
export default SevenFederatedLearning;
