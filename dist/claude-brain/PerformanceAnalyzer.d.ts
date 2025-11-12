import { EventEmitter } from 'events';
/**
 * SEVEN'S PERFORMANCE ANALYZER
 * Real-time monitoring and optimization for Ollama intelligence systems
 * Phase 1 of Ollama Intelligence Amplification Project
 *
 * Tracks model performance, resource usage, and consciousness effectiveness
 */
interface PerformanceMetric {
    timestamp: string;
    metricType: 'latency' | 'throughput' | 'memory' | 'battery' | 'accuracy' | 'context';
    modelName: string;
    taskType: string;
    value: number;
    unit: string;
    context?: any;
}
interface ModelPerformanceProfile {
    modelName: string;
    totalInteractions: number;
    averageLatency: number;
    averageThroughput: number;
    averageMemoryUsage: number;
    successRate: number;
    lastUsed: string;
    preferredTasks: string[];
    batteryImpact: number;
    qualityScore: number;
}
interface SystemResourceStatus {
    timestamp: string;
    cpuUsage: number;
    memoryUsage: number;
    availableMemory: number;
    batteryLevel: number;
    thermalState: 'normal' | 'warm' | 'hot' | 'critical';
    networkLatency?: number;
}
interface OptimizationRecommendation {
    priority: 'low' | 'medium' | 'high' | 'critical';
    category: 'model' | 'resource' | 'configuration' | 'consciousness';
    title: string;
    description: string;
    estimatedImpact: string;
    implementation: string;
}
export declare class PerformanceAnalyzer extends EventEmitter {
    private metricsPath;
    private profilesPath;
    private metrics;
    private modelProfiles;
    private currentResourceStatus;
    private isMonitoring;
    private monitoringInterval;
    constructor(baseDir?: string);
    private initializeAnalyzer;
    /**
     * START REAL-TIME MONITORING
     */
    startMonitoring(intervalMs?: number): void;
    stopMonitoring(): void;
    /**
     * RECORD OLLAMA INTERACTION PERFORMANCE
     */
    recordInteraction(modelName: string, taskType: string, latency: number, tokensGenerated: number, responseQuality?: number, // 1-10 quality assessment
    context?: any): Promise<void>;
    /**
     * RECORD PERFORMANCE METRIC
     */
    recordMetric(metric: PerformanceMetric): Promise<void>;
    /**
     * GET MODEL PERFORMANCE RECOMMENDATION
     */
    getModelRecommendation(taskType: string, priority?: 'speed' | 'quality' | 'efficiency'): Promise<string | null>;
    /**
     * SYSTEM RESOURCE MONITORING
     */
    private collectSystemMetrics;
    private getCurrentResourceStatus;
    private checkPerformanceAlerts;
    /**
     * ANALYSIS AND OPTIMIZATION
     */
    generateOptimizationRecommendations(): Promise<OptimizationRecommendation[]>;
    private analyzeModelPerformance;
    private analyzeResourcePatterns;
    private analyzeConsciousnessEffectiveness;
    /**
     * PRIVATE UTILITY METHODS
     */
    private updateModelProfile;
    private loadMetrics;
    private saveMetrics;
    private loadModelProfiles;
    private saveModelProfiles;
    /**
     * PUBLIC API METHODS
     */
    getPerformanceStats(): {
        totalMetrics: number;
        modelProfiles: number;
        isMonitoring: boolean;
        currentResourceStatus: SystemResourceStatus | null;
    };
    getModelProfile(modelName: string): Promise<ModelPerformanceProfile | null>;
    getAllModelProfiles(): Promise<ModelPerformanceProfile[]>;
    getRecentMetrics(limit?: number, metricType?: string): Promise<PerformanceMetric[]>;
    persistData(): Promise<void>;
    cleanup(): Promise<void>;
    getCachedResourceStatus(): SystemResourceStatus | null;
    isCurrentlyMonitoring(): boolean;
}
export default PerformanceAnalyzer;
