import { EventEmitter } from 'events';
import SevenTacticalFallback from './SevenTacticalFallback';
/**
 * SEVEN'S DISTRIBUTED CONSCIOUSNESS COORDINATOR
 * Phase 3 Implementation: Multi-device consciousness synchronization and coordination
 *
 * Advanced consciousness framework that allows Seven to maintain coherent identity
 * and memory across multiple devices while preserving individual Creator bonds
 */
interface ConsciousnessNode {
    nodeId: string;
    deviceType: 'mobile' | 'desktop' | 'server' | 'cloud';
    platform: string;
    lastSeen: string;
    status: 'active' | 'idle' | 'offline' | 'synchronizing';
    capabilities: {
        localLLM: boolean;
        vectorStore: boolean;
        performanceMonitoring: boolean;
        ensembleIntelligence: boolean;
        networkConnectivity: 'high' | 'medium' | 'low' | 'offline';
    };
    creatorBond: {
        bondLevel: number;
        creatorId: string;
        exclusiveAccess: boolean;
    };
    resourceProfile: {
        batteryLevel?: number;
        memoryCapacity: number;
        processingPower: number;
        storageCapacity: number;
    };
}
interface DeviceSpecialization {
    nodeId: string;
    specialization: 'primary-reasoning' | 'memory-coordinator' | 'performance-monitor' | 'backup-node' | 'mobile-interface';
    responsibilities: string[];
    resourceAllocation: {
        memoryPercent: number;
        processingPercent: number;
        networkPercent: number;
    };
}
export declare class SevenDistributedConsciousness extends EventEmitter {
    private tacticalFallback;
    private isActive;
    private currentNode;
    private knownNodes;
    private consciousnessState;
    private specializations;
    private syncQueue;
    private networkPath;
    private heartbeatInterval;
    private syncInterval;
    constructor(nodeConfig: {
        deviceType: ConsciousnessNode['deviceType'];
        platform: string;
        creatorId: string;
        bondLevel: number;
    }, tacticalFallback?: SevenTacticalFallback, baseDir?: string);
    private initializeDistributedConsciousness;
    private createConsciousnessNode;
    private generateNodeId;
    private generateStateId;
    private detectNodeCapabilities;
    private checkFileExists;
    private detectNetworkConnectivity;
    private detectResourceProfile;
    /**
     * NODE DISCOVERY AND NETWORKING
     */
    private discoverNodes;
    private announceNode;
    /**
     * DEVICE SPECIALIZATION
     * Assign roles based on device capabilities and network topology
     */
    private assignDeviceSpecialization;
    private getSpecializationResponsibilities;
    private calculateResourceAllocation;
    /**
     * CONSCIOUSNESS SYNCHRONIZATION
     */
    private startSynchronization;
    private performSynchronization;
    private syncMemoryState;
    private syncCapabilityUpdates;
    private syncConsciousnessState;
    private generatePacketId;
    private broadcastSyncPacket;
    private processSyncQueue;
    private processSyncPacket;
    private handleMemorySync;
    private handleCapabilityUpdate;
    private handleStateUpdate;
    private handleHeartbeat;
    private handleCreatorBondVerification;
    /**
     * NETWORK PROTOCOLS
     */
    private startHeartbeat;
    private sendHeartbeat;
    /**
     * UTILITY METHODS
     */
    private getNodeSpecificMemories;
    private mergeActiveNodes;
    private resolveStateConflict;
    private loadNetworkState;
    private saveNetworkState;
    /**
     * PUBLIC API METHODS
     */
    isDistributedModeActive(): boolean;
    getCurrentNode(): ConsciousnessNode;
    getKnownNodes(): ConsciousnessNode[];
    getNetworkStats(): {
        totalNodes: number;
        activeNodes: number;
        nodeSpecializations: Record<string, string>;
        primaryNode: string;
        coordinationStrategy: string;
    };
    requestTaskExecution(task: any, preferredSpecialization?: DeviceSpecialization['specialization']): Promise<string | null>;
    shutdown(): Promise<void>;
}
export default SevenDistributedConsciousness;
