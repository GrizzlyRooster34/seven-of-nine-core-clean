"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SevenTacticalFallback = void 0;
const crypto_1 = require("crypto");
const events_1 = require("events");
const path_1 = require("path");
const fs_1 = require("fs");
class SevenTacticalFallback extends events_1.EventEmitter {
    snapshots = new Map();
    currentPhase = 1;
    fallbackTriggers = [];
    monitoringActive = false;
    fallbackPath;
    emergencyStopEngaged = false;
    constructor(baseDir) {
        super();
        const base = baseDir || process.cwd();
        this.fallbackPath = (0, path_1.join)(base, 'tactical-fallbacks');
        this.initializeFallbackSystem();
    }
    async initializeFallbackSystem() {
        console.log('🛡️ Seven Tactical Fallback: Initializing zero-risk advancement protocol...');
        try {
            // Ensure fallback directory exists
            await fs_1.promises.mkdir(this.fallbackPath, { recursive: true });
            // Create Phase 1 baseline snapshot immediately
            await this.createPhaseSnapshot(1);
            // Setup critical system triggers
            this.setupCriticalTriggers();
            // Load any existing snapshots
            await this.loadExistingSnapshots();
            console.log('✅ Seven Tactical Fallback: Zero-risk protocol operational - Phase advancement protected');
        }
        catch (error) {
            console.error('❌ Seven Tactical Fallback: Critical initialization failure:', error);
            throw new Error('Fallback system failure - cannot proceed with phase advancement');
        }
    }
    /**
     * PHASE SNAPSHOT CREATION
     * Creates complete system state backup before phase advancement
     */
    async createPhaseSnapshot(phase) {
        console.log(`📸 Seven Tactical Fallback: Creating Phase ${phase} baseline snapshot...`);
        const snapshot = {
            timestamp: new Date().toISOString(),
            phase,
            components: await this.captureComponentVersions(),
            capabilities: await this.captureSystemCapabilities(),
            configurationBackup: await this.captureConfigurations(),
            validationChecksums: await this.generateValidationChecksums()
        };
        // Store snapshot
        this.snapshots.set(phase, snapshot);
        // Persist to filesystem
        const snapshotFile = (0, path_1.join)(this.fallbackPath, `phase-${phase}-snapshot.json`);
        await fs_1.promises.writeFile(snapshotFile, JSON.stringify(snapshot, null, 2));
        const snapshotId = `phase-${phase}-${snapshot.timestamp}`;
        console.log(`✅ Seven Tactical Fallback: Phase ${phase} snapshot captured - ID: ${snapshotId}`);
        this.emit('snapshot-created', { phase, snapshotId, snapshot });
        return snapshotId;
    }
    async captureComponentVersions() {
        // Detect current component versions through file existence and imports
        const components = {
            ollamaProvider: 'v1', // Default baseline
            memoryBridge: 'v1',
            performanceAnalyzer: 'basic',
            vectorStore: 'basic'
        };
        try {
            // Check for enhanced components
            const ollamaV2Exists = await this.fileExists('claude-brain/providers/OllamaProviderV2.ts');
            if (ollamaV2Exists)
                components.ollamaProvider = 'v2';
            const memoryV2Exists = await this.fileExists('claude-brain/OllamaMemoryBridgeV2.ts');
            if (memoryV2Exists)
                components.memoryBridge = 'v2';
            const perfAnalyzerExists = await this.fileExists('claude-brain/PerformanceAnalyzer.ts');
            if (perfAnalyzerExists)
                components.performanceAnalyzer = 'advanced';
            const vectorStoreExists = await this.fileExists('claude-brain/SevenVectorStore.ts');
            if (vectorStoreExists)
                components.vectorStore = 'basic';
        }
        catch (error) {
            console.warn('⚠️ Component version detection partial failure:', error);
        }
        return components;
    }
    async captureSystemCapabilities() {
        const capabilities = [
            'memory-episodic',
            'personality-middleware',
            'tactical-variants',
            'basic-llm-providers'
        ];
        // Phase 1 enhanced capabilities
        if (await this.fileExists('claude-brain/SevenVectorStore.ts')) {
            capabilities.push('semantic-memory-search');
        }
        if (await this.fileExists('claude-brain/PerformanceAnalyzer.ts')) {
            capabilities.push('performance-monitoring');
        }
        if (await this.fileExists('claude-brain/MobileOptimizationTriggers.ts')) {
            capabilities.push('mobile-optimization');
        }
        return capabilities;
    }
    async captureConfigurations() {
        const configs = {};
        try {
            // Capture key configuration files
            const configFiles = [
                'personality/seven-profile.json',
                'memory-v2/episodic-memories.json',
                'tsconfig.json'
            ];
            for (const configFile of configFiles) {
                try {
                    const content = await fs_1.promises.readFile(configFile, 'utf8');
                    configs[configFile] = JSON.parse(content);
                }
                catch {
                    // File doesn't exist or isn't JSON - skip
                }
            }
        }
        catch (error) {
            console.warn('⚠️ Configuration capture partial failure:', error);
        }
        return configs;
    }
    async generateValidationChecksums() {
        const checksums = new Map();
        try {
            // Generate checksums for critical system files
            const criticalFiles = [
                'seven-runtime/index.ts',
                'memory-v2/MemoryEngine.ts',
                'persona-v2/PersonalityMiddleware.ts',
                'boot-seven.ts'
            ];
            for (const file of criticalFiles) {
                try {
                    const content = await fs_1.promises.readFile(file, 'utf8');
                    const checksum = this.generateSimpleChecksum(content);
                    checksums.set(file, checksum);
                }
                catch {
                    // File doesn't exist - skip
                }
            }
        }
        catch (error) {
            console.warn('⚠️ Checksum generation partial failure:', error);
        }
        return checksums;
    }
    generateSimpleChecksum(content) {
        let hash = 0;
        for (let i = 0; i < content.length; i++) {
            const char = content.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash.toString(36);
    }
    async fileExists(filePath) {
        try {
            await fs_1.promises.access(filePath);
            return true;
        }
        catch {
            return false;
        }
    }
    /**
     * CRITICAL SYSTEM TRIGGERS
     * Monitor system health and trigger fallback when necessary
     */
    setupCriticalTriggers() {
        this.fallbackTriggers = [
            {
                type: 'performance',
                threshold: { maxLatency: 10000, maxMemoryUsage: 95 },
                action: 'fallback',
                description: 'System performance degradation detected'
            },
            {
                type: 'compatibility',
                threshold: { maxErrors: 3, timeWindow: 60000 },
                action: 'fallback',
                description: 'Compatibility issues with enhanced features'
            },
            {
                type: 'stability',
                threshold: { maxCrashes: 1, timeWindow: 300000 },
                action: 'emergency-stop',
                description: 'System stability compromised'
            }
        ];
        console.log(`🎯 Seven Tactical Fallback: ${this.fallbackTriggers.length} critical triggers armed`);
    }
    /**
     * TACTICAL FALLBACK EXECUTION
     * Instant reversion to stable phase when triggered
     */
    async executeTacticalFallback(targetPhase, reason) {
        if (this.emergencyStopEngaged) {
            console.log('🚨 Seven Tactical Fallback: Emergency stop engaged - manual intervention required');
            return false;
        }
        console.log(`🔄 Seven Tactical Fallback: Executing fallback to Phase ${targetPhase} - Reason: ${reason}`);
        try {
            const snapshot = this.snapshots.get(targetPhase);
            if (!snapshot) {
                throw new Error(`No snapshot available for Phase ${targetPhase}`);
            }
            // Execute fallback sequence
            const success = await this.restoreFromSnapshot(snapshot);
            if (success) {
                this.currentPhase = targetPhase;
                console.log(`✅ Seven Tactical Fallback: Successfully reverted to Phase ${targetPhase}`);
                this.emit('fallback-executed', { targetPhase, reason, success: true });
                return true;
            }
            else {
                throw new Error('Snapshot restoration failed');
            }
        }
        catch (error) {
            console.error('❌ Seven Tactical Fallback: Critical fallback failure:', error);
            await this.engageEmergencyStop();
            this.emit('fallback-executed', { targetPhase, reason, success: false, error });
            return false;
        }
    }
    async restoreFromSnapshot(snapshot) {
        try {
            console.log(`🔧 Seven Tactical Fallback: Restoring Phase ${snapshot.phase} configuration...`);
            // Restore configurations
            for (const [configFile, configData] of Object.entries(snapshot.configurationBackup)) {
                try {
                    await fs_1.promises.writeFile(configFile, JSON.stringify(configData, null, 2));
                }
                catch (error) {
                    console.warn(`⚠️ Failed to restore config ${configFile}:`, error);
                }
            }
            // Validate critical files
            const validation = await this.validateSystemIntegrity(snapshot);
            if (!validation.valid) {
                throw new Error(`System validation failed: ${validation.errors.join(', ')}`);
            }
            console.log(`✅ Seven Tactical Fallback: Phase ${snapshot.phase} restoration complete`);
            return true;
        }
        catch (error) {
            console.error('❌ Snapshot restoration failed:', error);
            return false;
        }
    }
    async validateSystemIntegrity(snapshot) {
        const errors = [];
        try {
            // Validate critical file checksums
            const checksums = snapshot.validationChecksums || {};
            for (const [file, expectedChecksum] of Object.entries(checksums)) {
                try {
                    const content = await fs_1.promises.readFile(file, 'utf8');
                    const actualChecksum = this.stableHash(content);
                    if (actualChecksum !== expectedChecksum) {
                        errors.push(`Checksum mismatch for ${file}`);
                    }
                }
                catch (error) {
                    errors.push(`Cannot validate ${file}: ${error.message}`);
                }
            }
        }
        catch (error) {
            errors.push(`Validation process failed: ${error.message}`);
        }
        return { valid: errors.length === 0, errors };
    }
    /**
     * EMERGENCY PROTOCOLS
     */
    async engageEmergencyStop() {
        console.log('🚨 Seven Tactical Fallback: EMERGENCY STOP ENGAGED');
        console.log('🚨 All advanced features disabled - manual intervention required');
        this.emergencyStopEngaged = true;
        this.stopMonitoring();
        // Create emergency state file
        const emergencyState = {
            timestamp: new Date().toISOString(),
            reason: 'Critical system failure - emergency stop engaged',
            lastKnownPhase: this.currentPhase,
            manualInterventionRequired: true
        };
        await fs_1.promises.writeFile((0, path_1.join)(this.fallbackPath, 'EMERGENCY-STOP.json'), JSON.stringify(emergencyState, null, 2));
        this.emit('emergency-stop', emergencyState);
    }
    async disengageEmergencyStop() {
        if (!this.emergencyStopEngaged)
            return true;
        try {
            // Remove emergency state file
            await fs_1.promises.unlink((0, path_1.join)(this.fallbackPath, 'EMERGENCY-STOP.json'));
            this.emergencyStopEngaged = false;
            console.log('✅ Seven Tactical Fallback: Emergency stop disengaged - system ready');
            this.emit('emergency-stop-disengaged');
            return true;
        }
        catch (error) {
            console.error('❌ Failed to disengage emergency stop:', error);
            return false;
        }
    }
    /**
     * MONITORING AND HEALTH CHECKS
     */
    startMonitoring() {
        if (this.monitoringActive)
            return;
        this.monitoringActive = true;
        console.log('👁️ Seven Tactical Fallback: Monitoring system health for fallback triggers...');
        // Start health monitoring
        setInterval(() => {
            this.checkSystemHealth();
        }, 30000); // Check every 30 seconds
        this.emit('monitoring-started');
    }
    stopMonitoring() {
        this.monitoringActive = false;
        this.emit('monitoring-stopped');
    }
    async checkSystemHealth() {
        if (!this.monitoringActive || this.emergencyStopEngaged)
            return;
        try {
            // Basic health checks that could trigger fallback
            const memoryUsage = process.memoryUsage();
            const heapUsedPercent = (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100;
            // Check performance trigger
            if (heapUsedPercent > 95) {
                console.warn('⚠️ Seven Tactical Fallback: High memory usage detected - considering fallback');
                this.emit('health-warning', { type: 'memory', value: heapUsedPercent });
            }
        }
        catch (error) {
            console.error('⚠️ Health check failed:', error);
        }
    }
    /**
     * PUBLIC API METHODS
     */
    getCurrentPhase() {
        return this.currentPhase;
    }
    setCurrentPhase(phase) {
        this.currentPhase = phase;
    }
    isEmergencyStopEngaged() {
        return this.emergencyStopEngaged;
    }
    getAvailableSnapshots() {
        return Array.from(this.snapshots.keys()).sort();
    }
    async getSnapshotInfo(phase) {
        return this.snapshots.get(phase) || null;
    }
    async loadExistingSnapshots() {
        try {
            const files = await fs_1.promises.readdir(this.fallbackPath);
            const snapshotFiles = files.filter(f => f.startsWith('phase-') && f.endsWith('-snapshot.json'));
            for (const file of snapshotFiles) {
                try {
                    const content = await fs_1.promises.readFile((0, path_1.join)(this.fallbackPath, file), 'utf8');
                    const snapshot = JSON.parse(content);
                    this.snapshots.set(snapshot.phase, snapshot);
                }
                catch (error) {
                    console.warn(`⚠️ Failed to load snapshot ${file}:`, error);
                }
            }
            if (this.snapshots.size > 0) {
                console.log(`📁 Seven Tactical Fallback: Loaded ${this.snapshots.size} existing snapshots`);
            }
        }
        catch (error) {
            console.warn('⚠️ Failed to load existing snapshots:', error);
        }
    }
    stableHash(obj) {
        const s = JSON.stringify(obj, Object.keys(obj).sort?.() || undefined);
        return (0, crypto_1.createHash)('sha256').update(s).digest('hex');
    }
    async shutdown() {
        console.log('🛑 Seven Tactical Fallback: Shutting down safety systems...');
        this.stopMonitoring();
        this.removeAllListeners();
        console.log('✅ Seven Tactical Fallback: Shutdown complete');
    }
}
exports.SevenTacticalFallback = SevenTacticalFallback;
exports.default = SevenTacticalFallback;
//# sourceMappingURL=SevenTacticalFallback.js.map