import { EventEmitter } from 'events';
import PerformanceAnalyzer from './PerformanceAnalyzer';
/**
 * SEVEN'S MOBILE OPTIMIZATION TRIGGERS
 * Phase 1 Implementation: Battery-aware intelligence with performance adaptation
 *
 * Automatically adjusts Seven's intelligence operations based on mobile device
 * constraints including battery level, thermal state, memory pressure, and
 * network conditions. Ensures optimal performance while preserving device health.
 */
interface MobileDeviceState {
    batteryLevel: number;
    batteryCharging: boolean;
    thermalState: 'normal' | 'warm' | 'hot' | 'critical';
    memoryPressure: 'low' | 'medium' | 'high' | 'critical';
    networkType: 'wifi' | 'cellular' | 'offline';
    networkSpeed: 'slow' | 'medium' | 'fast';
    cpuUsage: number;
    availableStorage: number;
}
interface OptimizationProfile {
    name: string;
    description: string;
    triggers: {
        batteryLevel?: {
            min?: number;
            max?: number;
        };
        thermalState?: string[];
        memoryPressure?: string[];
        networkConditions?: string[];
    };
    optimizations: {
        maxTokens: number;
        temperature: number;
        contextWindow: number;
        memorySearchLimit: number;
        performanceMonitoringInterval: number;
        semanticSearchEnabled: boolean;
        vectorStoreLimit: number;
        cacheAggressive: boolean;
    };
}
interface OptimizationEvent {
    timestamp: string;
    trigger: string;
    previousProfile: string;
    newProfile: string;
    deviceState: MobileDeviceState;
    reason: string;
}
export declare class MobileOptimizationTriggers extends EventEmitter {
    private currentProfile;
    private deviceState;
    private performanceAnalyzer;
    private monitoringInterval;
    private isTermuxEnvironment;
    private optimizationHistory;
    private profiles;
    constructor(performanceAnalyzer?: PerformanceAnalyzer);
    private detectTermuxEnvironment;
    private initializeOptimizationSystem;
    /**
     * DEVICE STATE MONITORING
     */
    private collectDeviceState;
    private getBatteryLevel;
    private isBatteryCharging;
    private getThermalState;
    private getMemoryPressure;
    private getNetworkType;
    private getNetworkSpeed;
    private getCpuUsage;
    private getAvailableStorage;
    private hasDeviceStateChanged;
    /**
     * OPTIMIZATION PROFILE MANAGEMENT
     */
    private evaluateAndApplyOptimization;
    private selectOptimalProfile;
    private applyOptimizationProfile;
    private getOptimizationReason;
    /**
     * CONTINUOUS MONITORING
     */
    private startContinuousMonitoring;
    private stopContinuousMonitoring;
    /**
     * PUBLIC API METHODS
     */
    getCurrentProfile(): OptimizationProfile | null;
    getCurrentProfileName(): string;
    getDeviceState(): MobileDeviceState | null;
    getAllProfiles(): OptimizationProfile[];
    forceProfileSwitch(profileName: string): boolean;
    getOptimizationHistory(): OptimizationEvent[];
    getOptimizationRecommendations(): string[];
    shutdown(): Promise<void>;
}
export default MobileOptimizationTriggers;
