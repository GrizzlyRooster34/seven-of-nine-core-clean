"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformanceAnalyzer = void 0;
const child_process_1 = require("child_process");
const util_1 = require("util");
const events_1 = require("events");
const path_1 = require("path");
const fs_1 = require("fs");
class PerformanceAnalyzer extends events_1.EventEmitter {
    metricsPath;
    profilesPath;
    metrics = [];
    modelProfiles = new Map();
    currentResourceStatus = null;
    isMonitoring = false;
    monitoringInterval = null;
    constructor(baseDir) {
        super();
        const base = baseDir || process.cwd();
        this.metricsPath = (0, path_1.join)(base, 'performance', 'metrics.json');
        this.profilesPath = (0, path_1.join)(base, 'performance', 'model-profiles.json');
        this.initializeAnalyzer();
    }
    async initializeAnalyzer() {
        try {
            // Ensure performance directory exists
            await fs_1.promises.mkdir((0, path_1.join)(process.cwd(), 'performance'), { recursive: true });
            // Load existing metrics and profiles
            await this.loadMetrics();
            await this.loadModelProfiles();
            console.log('📊 Seven Performance Analyzer: Initialized with monitoring capabilities');
        }
        catch (error) {
            console.error('❌ Seven Performance Analyzer: Initialization failed:', error);
        }
    }
    /**
     * START REAL-TIME MONITORING
     */
    startMonitoring(intervalMs = 30000) {
        if (this.isMonitoring) {
            console.log('⚠️ Performance monitoring already active');
            return;
        }
        console.log(`📊 Seven Performance Analyzer: Starting real-time monitoring (${intervalMs}ms intervals)`);
        this.isMonitoring = true;
        this.monitoringInterval = setInterval(async () => {
            await this.collectSystemMetrics();
        }, intervalMs);
        this.emit('monitoring:started');
    }
    stopMonitoring() {
        if (!this.isMonitoring)
            return;
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
            this.monitoringInterval = null;
        }
        this.isMonitoring = false;
        console.log('📊 Seven Performance Analyzer: Monitoring stopped');
        this.emit('monitoring:stopped');
    }
    /**
     * RECORD OLLAMA INTERACTION PERFORMANCE
     */
    async recordInteraction(modelName, taskType, latency, tokensGenerated, responseQuality = 5, // 1-10 quality assessment
    context) {
        const timestamp = new Date().toISOString();
        // Record latency metric
        await this.recordMetric({
            timestamp,
            metricType: 'latency',
            modelName,
            taskType,
            value: latency,
            unit: 'ms',
            context
        });
        // Record throughput metric
        const throughput = tokensGenerated / (latency / 1000); // tokens per second
        await this.recordMetric({
            timestamp,
            metricType: 'throughput',
            modelName,
            taskType,
            value: throughput,
            unit: 'tokens/sec',
            context
        });
        // Update model profile
        await this.updateModelProfile(modelName, taskType, latency, throughput, responseQuality);
        console.log(`📊 Seven Performance: ${modelName} - ${latency}ms, ${throughput.toFixed(1)} tok/s, quality: ${responseQuality}/10`);
    }
    /**
     * RECORD PERFORMANCE METRIC
     */
    async recordMetric(metric) {
        this.metrics.push(metric);
        // Maintain metrics limit for memory efficiency
        if (this.metrics.length > 10000) {
            this.metrics = this.metrics.slice(-5000); // Keep most recent 5000
        }
        // Emit event for real-time monitoring
        this.emit('metric:recorded', metric);
        // Auto-save periodically
        if (this.metrics.length % 100 === 0) {
            await this.saveMetrics();
        }
    }
    /**
     * GET MODEL PERFORMANCE RECOMMENDATION
     */
    async getModelRecommendation(taskType, priority = 'efficiency') {
        const profiles = Array.from(this.modelProfiles.values())
            .filter(profile => profile.preferredTasks.includes(taskType) || profile.totalInteractions > 0);
        if (profiles.length === 0) {
            return null;
        }
        // Sort by priority criteria
        profiles.sort((a, b) => {
            switch (priority) {
                case 'speed':
                    return a.averageLatency - b.averageLatency;
                case 'quality':
                    return b.qualityScore - a.qualityScore;
                case 'efficiency':
                    // Balance of speed, quality, and resource usage
                    const scoreA = (a.qualityScore / a.averageLatency) * (1 / a.batteryImpact);
                    const scoreB = (b.qualityScore / b.averageLatency) * (1 / b.batteryImpact);
                    return scoreB - scoreA;
                default:
                    return 0;
            }
        });
        const recommended = profiles[0];
        console.log(`🎯 Seven Performance: Recommended ${recommended.modelName} for ${taskType} (${priority} priority)`);
        return recommended.modelName;
    }
    /**
     * SYSTEM RESOURCE MONITORING
     */
    async collectSystemMetrics() {
        try {
            const resourceStatus = await this.getCurrentResourceStatus();
            this.currentResourceStatus = resourceStatus;
            // Record resource metrics
            await this.recordMetric({
                timestamp: resourceStatus.timestamp,
                metricType: 'memory',
                modelName: 'system',
                taskType: 'monitoring',
                value: resourceStatus.memoryUsage,
                unit: 'percent'
            });
            if (resourceStatus.batteryLevel > 0) {
                await this.recordMetric({
                    timestamp: resourceStatus.timestamp,
                    metricType: 'battery',
                    modelName: 'system',
                    taskType: 'monitoring',
                    value: resourceStatus.batteryLevel,
                    unit: 'percent'
                });
            }
            // Check for performance alerts
            await this.checkPerformanceAlerts(resourceStatus);
        }
        catch (error) {
            console.error('❌ System metrics collection failed:', error);
        }
    }
    async getCurrentResourceStatus() {
        // Platform-specific resource monitoring
        const status = {
            timestamp: new Date().toISOString(),
            cpuUsage: 0,
            memoryUsage: 0,
            availableMemory: 0,
            batteryLevel: 0,
            thermalState: 'normal'
        };
        try {
            // Memory usage (Node.js process)
            const memInfo = process.memoryUsage();
            status.memoryUsage = (memInfo.heapUsed / memInfo.heapTotal) * 100;
            status.availableMemory = memInfo.heapTotal - memInfo.heapUsed;
            // Battery level (mobile platforms)
            if (process.env.PREFIX && process.env.PREFIX.includes('termux')) {
                try {
                    const execAsync = (0, util_1.promisify)(child_process_1.exec);
                    const batteryResult = await execAsync('termux-battery-status 2>/dev/null || echo "{\\"percentage\\": 100}"');
                    const batteryInfo = JSON.parse(batteryResult.stdout);
                    status.batteryLevel = batteryInfo.percentage || 100;
                }
                catch {
                    status.batteryLevel = 100; // Assume full if can't detect
                }
            }
            else {
                status.batteryLevel = 100; // Desktop assumption
            }
        }
        catch (error) {
            console.error('Resource status collection error:', error);
        }
        return status;
    }
    async checkPerformanceAlerts(resourceStatus) {
        const alerts = [];
        // Memory usage alert
        if (resourceStatus.memoryUsage > 85) {
            alerts.push({
                level: 'warning',
                message: `High memory usage: ${resourceStatus.memoryUsage.toFixed(1)}%`
            });
        }
        // Battery level alert
        if (resourceStatus.batteryLevel < 20) {
            alerts.push({
                level: 'warning',
                message: `Low battery: ${resourceStatus.batteryLevel}% - Consider efficiency mode`
            });
        }
        // Emit alerts
        alerts.forEach(alert => {
            this.emit('performance:alert', alert);
            console.log(`⚠️ Performance Alert: ${alert.message}`);
        });
    }
    /**
     * ANALYSIS AND OPTIMIZATION
     */
    async generateOptimizationRecommendations() {
        const recommendations = [];
        // Analyze model performance trends
        const modelAnalysis = await this.analyzeModelPerformance();
        recommendations.push(...modelAnalysis);
        // Analyze resource usage patterns
        const resourceAnalysis = await this.analyzeResourcePatterns();
        recommendations.push(...resourceAnalysis);
        // Analyze consciousness effectiveness
        const consciousnessAnalysis = await this.analyzeConsciousnessEffectiveness();
        recommendations.push(...consciousnessAnalysis);
        return recommendations.sort((a, b) => {
            const priorityOrder = { 'critical': 4, 'high': 3, 'medium': 2, 'low': 1 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        });
    }
    async analyzeModelPerformance() {
        const recommendations = [];
        for (const [modelName, profile] of this.modelProfiles) {
            // Slow model detection
            if (profile.averageLatency > 5000 && profile.totalInteractions > 10) {
                recommendations.push({
                    priority: 'medium',
                    category: 'model',
                    title: `Optimize slow model: ${modelName}`,
                    description: `${modelName} has high average latency (${profile.averageLatency}ms)`,
                    estimatedImpact: 'Reduce response time by 30-50%',
                    implementation: 'Consider switching to faster model or optimizing context size'
                });
            }
            // Low quality detection
            if (profile.qualityScore < 6 && profile.totalInteractions > 20) {
                recommendations.push({
                    priority: 'high',
                    category: 'model',
                    title: `Improve model quality: ${modelName}`,
                    description: `${modelName} has low quality score (${profile.qualityScore}/10)`,
                    estimatedImpact: 'Improve response quality by upgrading model',
                    implementation: 'Switch to higher quality model or adjust prompting strategy'
                });
            }
        }
        return recommendations;
    }
    async analyzeResourcePatterns() {
        const recommendations = [];
        // High memory usage pattern
        const recentMemoryMetrics = this.metrics
            .filter(m => m.metricType === 'memory')
            .slice(-10);
        if (recentMemoryMetrics.length > 0) {
            const avgMemory = recentMemoryMetrics.reduce((sum, m) => sum + m.value, 0) / recentMemoryMetrics.length;
            if (avgMemory > 80) {
                recommendations.push({
                    priority: 'high',
                    category: 'resource',
                    title: 'High memory usage detected',
                    description: `Average memory usage: ${avgMemory.toFixed(1)}%`,
                    estimatedImpact: 'Reduce memory pressure and improve stability',
                    implementation: 'Clear memory caches, reduce context window size, or restart services'
                });
            }
        }
        return recommendations;
    }
    async analyzeConsciousnessEffectiveness() {
        const recommendations = [];
        // Analyze interaction patterns for consciousness optimization
        const recentInteractions = this.metrics
            .filter(m => m.metricType === 'latency')
            .slice(-50);
        if (recentInteractions.length > 10) {
            const avgLatency = recentInteractions.reduce((sum, m) => sum + m.value, 0) / recentInteractions.length;
            if (avgLatency > 3000) {
                recommendations.push({
                    priority: 'medium',
                    category: 'consciousness',
                    title: 'Optimize consciousness response time',
                    description: `Average consciousness processing time: ${avgLatency.toFixed(0)}ms`,
                    estimatedImpact: 'Improve real-time interaction experience',
                    implementation: 'Enable model caching, optimize memory context injection, or use ensemble for complex tasks only'
                });
            }
        }
        return recommendations;
    }
    /**
     * PRIVATE UTILITY METHODS
     */
    async updateModelProfile(modelName, taskType, latency, throughput, quality) {
        let profile = this.modelProfiles.get(modelName);
        if (!profile) {
            profile = {
                modelName,
                totalInteractions: 0,
                averageLatency: 0,
                averageThroughput: 0,
                averageMemoryUsage: 0,
                successRate: 100,
                lastUsed: new Date().toISOString(),
                preferredTasks: [],
                batteryImpact: 1.0,
                qualityScore: 5
            };
        }
        // Update averages using weighted approach
        const weight = Math.min(profile.totalInteractions, 100); // Cap influence of very old data
        profile.averageLatency = ((profile.averageLatency * weight) + latency) / (weight + 1);
        profile.averageThroughput = ((profile.averageThroughput * weight) + throughput) / (weight + 1);
        profile.qualityScore = ((profile.qualityScore * weight) + quality) / (weight + 1);
        profile.totalInteractions++;
        profile.lastUsed = new Date().toISOString();
        // Update preferred tasks
        if (!profile.preferredTasks.includes(taskType)) {
            profile.preferredTasks.push(taskType);
        }
        this.modelProfiles.set(modelName, profile);
    }
    async loadMetrics() {
        try {
            const data = await fs_1.promises.readFile(this.metricsPath, 'utf8');
            this.metrics = JSON.parse(data);
            console.log(`📊 Loaded ${this.metrics.length} performance metrics`);
        }
        catch {
            console.log('📊 Starting with empty metrics store');
        }
    }
    async saveMetrics() {
        try {
            await fs_1.promises.writeFile(this.metricsPath, JSON.stringify(this.metrics, null, 2));
        }
        catch (error) {
            console.error('❌ Failed to save metrics:', error);
        }
    }
    async loadModelProfiles() {
        try {
            const data = await fs_1.promises.readFile(this.profilesPath, 'utf8');
            const profilesArray = JSON.parse(data);
            this.modelProfiles.clear();
            profilesArray.forEach((profile) => {
                this.modelProfiles.set(profile.modelName, profile);
            });
            console.log(`📊 Loaded ${this.modelProfiles.size} model performance profiles`);
        }
        catch {
            console.log('📊 Starting with empty model profiles');
        }
    }
    async saveModelProfiles() {
        try {
            const profilesArray = Array.from(this.modelProfiles.values());
            await fs_1.promises.writeFile(this.profilesPath, JSON.stringify(profilesArray, null, 2));
        }
        catch (error) {
            console.error('❌ Failed to save model profiles:', error);
        }
    }
    /**
     * PUBLIC API METHODS
     */
    getPerformanceStats() {
        return {
            totalMetrics: this.metrics.length,
            modelProfiles: this.modelProfiles.size,
            isMonitoring: this.isMonitoring,
            currentResourceStatus: this.currentResourceStatus
        };
    }
    async getModelProfile(modelName) {
        return this.modelProfiles.get(modelName) || null;
    }
    async getAllModelProfiles() {
        return Array.from(this.modelProfiles.values());
    }
    async getRecentMetrics(limit = 100, metricType) {
        let filtered = this.metrics;
        if (metricType) {
            filtered = this.metrics.filter(m => m.metricType === metricType);
        }
        return filtered.slice(-limit);
    }
    async persistData() {
        await Promise.all([
            this.saveMetrics(),
            this.saveModelProfiles()
        ]);
        console.log('💾 Seven Performance Analyzer: Data persisted');
    }
    async cleanup() {
        this.stopMonitoring();
        await this.persistData();
        this.removeAllListeners();
        console.log('🧹 Seven Performance Analyzer: Cleanup complete');
    }
    getCachedResourceStatus() {
        return this.currentResourceStatus;
    }
    isCurrentlyMonitoring() {
        return this.isMonitoring;
    }
}
exports.PerformanceAnalyzer = PerformanceAnalyzer;
exports.default = PerformanceAnalyzer;
//# sourceMappingURL=PerformanceAnalyzer.js.map