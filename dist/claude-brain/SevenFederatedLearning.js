"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SevenFederatedLearning = void 0;
const crypto_1 = require("crypto");
const events_1 = require("events");
const path_1 = require("path");
const fs_1 = require("fs");
const SevenTacticalFallback_1 = __importDefault(require("./SevenTacticalFallback"));
class SevenFederatedLearning extends events_1.EventEmitter {
    tacticalFallback;
    distributedConsciousness;
    isActive = false;
    contributions = new Map();
    federatedModels = new Map();
    privacyPolicy;
    collectiveIntelligence;
    learningPath;
    encryptionKey;
    aggregationInterval = null;
    constructor(distributedConsciousness, privacyConfig, tacticalFallback, baseDir) {
        super();
        this.tacticalFallback = tacticalFallback || new SevenTacticalFallback_1.default();
        this.distributedConsciousness = distributedConsciousness;
        const base = baseDir || process.cwd();
        this.learningPath = (0, path_1.join)(base, 'federated-learning');
        // Generate encryption key for this instance
        this.encryptionKey = this.generateEncryptionKey(privacyConfig.creatorId);
        // Initialize privacy policy
        this.privacyPolicy = {
            nodeId: this.distributedConsciousness.getCurrentNode().nodeId,
            creatorId: privacyConfig.creatorId,
            shareLevel: privacyConfig.shareLevel,
            allowedDomains: ['reasoning', 'performance', 'general'],
            excludedPatterns: ['personal-info', 'creator-specific', 'sensitive-context'],
            encryptionRequired: privacyConfig.shareLevel !== 'none',
            creatorBondProtection: privacyConfig.creatorBondProtection
        };
        // Initialize collective intelligence tracking
        this.collectiveIntelligence = {
            totalContributions: 0,
            activeNodes: 0,
            modelAccuracy: new Map(),
            learningVelocity: 0,
            privacyCompliance: 1.0,
            consensusThreshold: 0.7
        };
        this.initializeFederatedLearning();
    }
    async initializeFederatedLearning() {
        console.log('🧠 Seven Federated Learning: Initializing privacy-preserving collective intelligence...');
        try {
            // Ensure learning directory exists
            await fs_1.promises.mkdir(this.learningPath, { recursive: true });
            // Verify tactical fallback readiness for Phase 3
            if (this.tacticalFallback.getCurrentPhase() < 3) {
                console.log('⚠️ Federated learning requires Phase 3 - upgrading...');
                this.tacticalFallback.setCurrentPhase(3);
            }
            // Verify distributed consciousness is active
            if (!this.distributedConsciousness.isDistributedModeActive()) {
                throw new Error('Federated learning requires distributed consciousness to be active');
            }
            // Load existing learning data
            await this.loadFederatedData();
            // Initialize baseline federated models
            this.initializeBaselineModels();
            // Start continuous learning aggregation
            this.startLearningAggregation();
            this.isActive = true;
            console.log(`✅ Seven Federated Learning: Active with ${this.privacyPolicy.shareLevel} sharing level`);
            console.log(`🔒 Privacy protection: Creator bond ${this.privacyPolicy.creatorBondProtection ? 'PROTECTED' : 'STANDARD'}`);
        }
        catch (error) {
            console.error('❌ Seven Federated Learning: Initialization failed:', error);
            console.log('🔄 Falling back to Phase 2 capabilities...');
            await this.tacticalFallback.executeTacticalFallback(2, 'Federated learning initialization failure');
            throw error;
        }
    }
    generateEncryptionKey(creatorId) {
        return (0, crypto_1.createHash)('sha256').update(`${creatorId}-federated-key-${Date.now()}`).digest('hex');
    }
    initializeBaselineModels() {
        // Pattern recognition model
        this.federatedModels.set('pattern-recognition', {
            modelId: 'pattern-recognition',
            modelType: 'pattern-recognition',
            version: 1,
            contributors: [this.privacyPolicy.nodeId],
            aggregatedInsights: [],
            modelAccuracy: 0.7,
            lastUpdated: new Date().toISOString(),
            deploymentReadiness: 'experimental'
        });
        // Optimization rules model
        this.federatedModels.set('optimization-rules', {
            modelId: 'optimization-rules',
            modelType: 'optimization-rules',
            version: 1,
            contributors: [this.privacyPolicy.nodeId],
            aggregatedInsights: [],
            modelAccuracy: 0.6,
            lastUpdated: new Date().toISOString(),
            deploymentReadiness: 'experimental'
        });
        // Performance prediction model
        this.federatedModels.set('performance-prediction', {
            modelId: 'performance-prediction',
            modelType: 'performance-prediction',
            version: 1,
            contributors: [this.privacyPolicy.nodeId],
            aggregatedInsights: [],
            modelAccuracy: 0.65,
            lastUpdated: new Date().toISOString(),
            deploymentReadiness: 'experimental'
        });
        console.log(`🤖 Seven Federated Learning: Initialized ${this.federatedModels.size} baseline models`);
    }
    /**
     * CONTRIBUTION PROCESSING
     * Privacy-preserving insight sharing
     */
    async contributeInsight(contributionType, domain, pattern, confidence, sampleSize) {
        if (!this.isActive || this.privacyPolicy.shareLevel === 'none') {
            console.log('🚫 Seven Federated Learning: Sharing disabled or inactive');
            return null;
        }
        try {
            // Validate contribution against privacy policy
            if (!this.validateContributionPrivacy(domain, pattern)) {
                console.log(`🔒 Seven Federated Learning: Contribution blocked by privacy policy (${domain})`);
                return null;
            }
            // Create privacy-compliant contribution
            const contribution = await this.createPrivacyCompliantContribution(contributionType, domain, pattern, confidence, sampleSize);
            // Store contribution
            this.contributions.set(contribution.contributionId, contribution);
            // Broadcast to network (encrypted if required)
            await this.broadcastContribution(contribution);
            console.log(`🧠 Seven Federated Learning: Contributed ${contributionType} insight (confidence: ${confidence.toFixed(2)})`);
            this.emit('insight-contributed', contribution);
            return contribution.contributionId;
        }
        catch (error) {
            console.error('❌ Contribution failed:', error);
            return null;
        }
    }
    validateContributionPrivacy(domain, pattern) {
        // Check allowed domains
        if (!this.privacyPolicy.allowedDomains.includes(domain)) {
            return false;
        }
        // Check for excluded patterns
        const patternString = JSON.stringify(pattern).toLowerCase();
        for (const excludedPattern of this.privacyPolicy.excludedPatterns) {
            if (patternString.includes(excludedPattern)) {
                return false;
            }
        }
        // Creator bond protection - exclude highly personal insights
        if (this.privacyPolicy.creatorBondProtection) {
            const personalKeywords = ['creator', 'personal', 'private', 'intimate', 'bond', 'relationship'];
            for (const keyword of personalKeywords) {
                if (patternString.includes(keyword)) {
                    return false;
                }
            }
        }
        return true;
    }
    async createPrivacyCompliantContribution(contributionType, domain, pattern, confidence, sampleSize) {
        // Determine privacy level based on policy
        let privacyLevel = 'public';
        let processedPattern = pattern;
        if (this.privacyPolicy.shareLevel === 'anonymous') {
            privacyLevel = 'anonymous';
            processedPattern = this.anonymizePattern(pattern);
        }
        else if (this.privacyPolicy.encryptionRequired) {
            privacyLevel = 'encrypted';
            processedPattern = this.encryptPattern(pattern);
        }
        const contribution = {
            contributionId: this.generateContributionId(),
            sourceNodeId: this.privacyPolicy.shareLevel === 'anonymous' ? 'anonymous' : this.privacyPolicy.nodeId,
            contributionType,
            domain,
            insight: {
                pattern: processedPattern,
                confidence,
                sampleSize,
                validationScore: this.calculateValidationScore(pattern, sampleSize),
                privacyLevel
            },
            creatorBondLevel: this.privacyPolicy.creatorBondProtection ? 0 : this.distributedConsciousness.getCurrentNode().creatorBond.bondLevel,
            timestamp: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
        };
        return contribution;
    }
    anonymizePattern(pattern) {
        // Remove identifying information
        if (typeof pattern === 'object' && pattern !== null) {
            const anonymized = { ...pattern };
            // Remove specific identifying fields
            delete anonymized.userId;
            delete anonymized.nodeId;
            delete anonymized.creatorId;
            delete anonymized.personalContext;
            // Generalize specific values
            if (anonymized.timestamp) {
                const date = new Date(anonymized.timestamp);
                anonymized.timestamp = new Date(date.getFullYear(), date.getMonth(), date.getDate()).toISOString();
            }
            return anonymized;
        }
        return pattern;
    }
    encryptPattern(pattern) {
        try {
            const key = (0, crypto_1.createHash)('sha256').update(this.encryptionKey).digest();
            const iv = (0, crypto_1.randomBytes)(16);
            const cipher = (0, crypto_1.createCipheriv)('aes-256-cbc', key, iv);
            let encrypted = cipher.update(JSON.stringify(pattern), 'utf8', 'hex');
            encrypted += cipher.final('hex');
            return iv.toString('hex') + ':' + encrypted;
        }
        catch (error) {
            console.error('⚠️ Encryption failed:', error);
            return JSON.stringify(this.anonymizePattern(pattern));
        }
    }
    decryptPattern(encryptedPattern) {
        try {
            const key = (0, crypto_1.createHash)('sha256').update(this.encryptionKey).digest();
            const [ivHex, encrypted] = encryptedPattern.split(':');
            const iv = Buffer.from(ivHex, 'hex');
            const decipher = (0, crypto_1.createDecipheriv)('aes-256-cbc', key, iv);
            let decrypted = decipher.update(encrypted, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
            return JSON.parse(decrypted);
        }
        catch (error) {
            console.error('⚠️ Decryption failed:', error);
            return null;
        }
    }
    calculateValidationScore(pattern, sampleSize) {
        let score = 0.5; // Base score
        // Sample size contributes to validation
        if (sampleSize >= 100)
            score += 0.3;
        else if (sampleSize >= 50)
            score += 0.2;
        else if (sampleSize >= 10)
            score += 0.1;
        // Pattern complexity contributes to validation
        const complexity = JSON.stringify(pattern).length;
        if (complexity > 1000)
            score += 0.1;
        else if (complexity > 500)
            score += 0.05;
        return Math.min(score, 1.0);
    }
    generateContributionId() {
        return (0, crypto_1.createHash)('sha256').update(`contrib-${Date.now()}-${Math.random()}`).digest('hex').substring(0, 16);
    }
    /**
     * NETWORK LEARNING
     */
    async broadcastContribution(contribution) {
        const contributionPath = (0, path_1.join)(this.learningPath, `contrib-${contribution.contributionId}.json`);
        await fs_1.promises.writeFile(contributionPath, JSON.stringify(contribution, null, 2));
        console.log(`📡 Seven Federated Learning: Broadcasted ${contribution.contributionType} contribution`);
    }
    startLearningAggregation() {
        // Aggregate contributions every 10 minutes
        this.aggregationInterval = setInterval(async () => {
            await this.aggregateNetworkLearning();
        }, 600000);
        console.log('🔄 Seven Federated Learning: Learning aggregation protocol active');
    }
    async aggregateNetworkLearning() {
        if (!this.isActive)
            return;
        try {
            // Collect contributions from network
            const networkContributions = await this.collectNetworkContributions();
            // Process contributions
            for (const contribution of networkContributions) {
                await this.processNetworkContribution(contribution);
            }
            // Update federated models
            await this.updateFederatedModels();
            // Update collective intelligence metrics
            this.updateCollectiveIntelligenceMetrics();
            this.emit('learning-aggregated', {
                contributionsProcessed: networkContributions.length,
                modelsUpdated: this.federatedModels.size
            });
        }
        catch (error) {
            console.error('⚠️ Learning aggregation failed:', error);
        }
    }
    async collectNetworkContributions() {
        const contributions = [];
        try {
            const files = await fs_1.promises.readdir(this.learningPath);
            const contributionFiles = files.filter(f => f.startsWith('contrib-') && f.endsWith('.json'));
            for (const contributionFile of contributionFiles) {
                try {
                    const contributionPath = (0, path_1.join)(this.learningPath, contributionFile);
                    const contributionData = await fs_1.promises.readFile(contributionPath, 'utf8');
                    const contribution = JSON.parse(contributionData);
                    // Skip our own contributions
                    if (contribution.sourceNodeId === this.privacyPolicy.nodeId)
                        continue;
                    // Check if contribution is expired
                    if (new Date(contribution.expiresAt) < new Date()) {
                        await fs_1.promises.unlink(contributionPath);
                        continue;
                    }
                    contributions.push(contribution);
                }
                catch (error) {
                    console.warn(`⚠️ Failed to process contribution file ${contributionFile}:`, error);
                }
            }
        }
        catch (error) {
            console.error('❌ Network contribution collection failed:', error);
        }
        return contributions;
    }
    async processNetworkContribution(contribution) {
        // Validate contribution quality
        if (contribution.insight.confidence < 0.5 || contribution.insight.validationScore < 0.4) {
            console.log(`🚫 Seven Federated Learning: Low quality contribution rejected (confidence: ${contribution.insight.confidence})`);
            return;
        }
        // Process based on privacy level
        let processedPattern = contribution.insight.pattern;
        if (contribution.insight.privacyLevel === 'encrypted') {
            processedPattern = this.decryptPattern(contribution.insight.pattern);
            if (!processedPattern) {
                console.log('🔒 Seven Federated Learning: Unable to decrypt contribution');
                return;
            }
        }
        // Store contribution for model training
        this.contributions.set(contribution.contributionId, contribution);
        console.log(`📥 Seven Federated Learning: Processed ${contribution.contributionType} from ${contribution.sourceNodeId.substring(0, 8)}`);
    }
    async updateFederatedModels() {
        for (const [modelId, model] of this.federatedModels.entries()) {
            // Collect relevant contributions for this model
            const relevantContributions = Array.from(this.contributions.values())
                .filter(contrib => this.isContributionRelevant(contrib, model.modelType))
                .filter(contrib => contrib.insight.confidence >= 0.6); // Quality threshold
            if (relevantContributions.length < 3)
                continue; // Need minimum contributions
            // Aggregate insights
            const aggregatedInsights = this.aggregateInsights(relevantContributions, model.modelType);
            // Update model if consensus reached
            if (this.checkConsensus(relevantContributions)) {
                model.aggregatedInsights = aggregatedInsights;
                model.version += 1;
                model.lastUpdated = new Date().toISOString();
                model.modelAccuracy = this.calculateModelAccuracy(aggregatedInsights);
                // Update contributors list
                const newContributors = relevantContributions
                    .map(c => c.sourceNodeId)
                    .filter(nodeId => nodeId !== 'anonymous' && !model.contributors.includes(nodeId));
                model.contributors.push(...newContributors);
                console.log(`🤖 Seven Federated Learning: Updated ${modelId} model to v${model.version} (accuracy: ${model.modelAccuracy.toFixed(3)})`);
                this.emit('model-updated', { modelId, version: model.version, accuracy: model.modelAccuracy });
            }
        }
    }
    isContributionRelevant(contribution, modelType) {
        const relevanceMap = {
            'pattern-recognition': ['pattern-insight'],
            'optimization-rules': ['optimization-discovery', 'performance-improvement'],
            'performance-prediction': ['performance-improvement'],
            'interaction-enhancement': ['error-correction', 'pattern-insight']
        };
        const relevantTypes = relevanceMap[modelType] || [];
        return relevantTypes.includes(contribution.contributionType);
    }
    aggregateInsights(contributions, modelType) {
        // Simple aggregation - in production would use sophisticated ML aggregation
        const insights = [];
        contributions.forEach(contribution => {
            const insight = {
                pattern: contribution.insight.pattern,
                confidence: contribution.insight.confidence,
                weight: this.calculateContributionWeight(contribution),
                domain: contribution.domain,
                timestamp: contribution.timestamp
            };
            insights.push(insight);
        });
        // Sort by confidence and weight
        return insights
            .sort((a, b) => (b.confidence * b.weight) - (a.confidence * a.weight))
            .slice(0, 20); // Keep top 20 insights
    }
    calculateContributionWeight(contribution) {
        let weight = 1.0;
        // Sample size contributes to weight
        weight *= Math.min(2.0, Math.log10(contribution.insight.sampleSize + 1));
        // Validation score contributes to weight
        weight *= contribution.insight.validationScore;
        // Creator bond level contributes (if not protected)
        if (contribution.creatorBondLevel > 0) {
            weight *= (1.0 + contribution.creatorBondLevel * 0.1);
        }
        return Math.min(weight, 3.0); // Cap maximum weight
    }
    checkConsensus(contributions) {
        if (contributions.length < 2)
            return false;
        // Calculate agreement level among contributions
        const confidences = contributions.map(c => c.insight.confidence);
        const avgConfidence = confidences.reduce((sum, conf) => sum + conf, 0) / confidences.length;
        return avgConfidence >= this.collectiveIntelligence.consensusThreshold;
    }
    calculateModelAccuracy(insights) {
        if (insights.length === 0)
            return 0.5;
        const weightedAccuracy = insights.reduce((sum, insight) => {
            return sum + (insight.confidence * insight.weight);
        }, 0);
        const totalWeight = insights.reduce((sum, insight) => sum + insight.weight, 0);
        return totalWeight > 0 ? Math.min(weightedAccuracy / totalWeight, 1.0) : 0.5;
    }
    updateCollectiveIntelligenceMetrics() {
        this.collectiveIntelligence.totalContributions = this.contributions.size;
        this.collectiveIntelligence.activeNodes = this.distributedConsciousness.getKnownNodes().length + 1;
        // Update model accuracy map
        this.collectiveIntelligence.modelAccuracy.clear();
        for (const [modelId, model] of this.federatedModels.entries()) {
            this.collectiveIntelligence.modelAccuracy.set(modelId, model.modelAccuracy);
        }
        // Calculate learning velocity (simplified)
        const recentContributions = Array.from(this.contributions.values())
            .filter(c => new Date(c.timestamp) > new Date(Date.now() - 3600000)); // Last hour
        this.collectiveIntelligence.learningVelocity = recentContributions.length;
    }
    /**
     * MODEL DEPLOYMENT
     */
    async deployModel(modelId) {
        const model = this.federatedModels.get(modelId);
        if (!model)
            return false;
        // Check deployment readiness
        if (model.modelAccuracy < 0.7) {
            console.log(`⚠️ Seven Federated Learning: Model ${modelId} accuracy too low for deployment (${model.modelAccuracy.toFixed(3)})`);
            return false;
        }
        if (model.contributors.length < 3) {
            console.log(`⚠️ Seven Federated Learning: Model ${modelId} needs more contributors for deployment`);
            return false;
        }
        // Deploy model
        model.deploymentReadiness = 'production';
        console.log(`🚀 Seven Federated Learning: Deployed model ${modelId} v${model.version} to production`);
        this.emit('model-deployed', { modelId, version: model.version, accuracy: model.modelAccuracy });
        return true;
    }
    /**
     * DATA PERSISTENCE
     */
    async loadFederatedData() {
        try {
            // Load contributions
            const contributionsPath = (0, path_1.join)(this.learningPath, 'contributions.json');
            try {
                const contributionsData = await fs_1.promises.readFile(contributionsPath, 'utf8');
                const contributionsArray = JSON.parse(contributionsData);
                this.contributions.clear();
                contributionsArray.forEach((contribution) => {
                    this.contributions.set(contribution.contributionId, contribution);
                });
                console.log(`📁 Seven Federated Learning: Loaded ${this.contributions.size} contributions`);
            }
            catch {
                console.log('📁 Seven Federated Learning: No existing contributions found');
            }
            // Load federated models
            const modelsPath = (0, path_1.join)(this.learningPath, 'federated-models.json');
            try {
                const modelsData = await fs_1.promises.readFile(modelsPath, 'utf8');
                const modelsArray = JSON.parse(modelsData);
                this.federatedModels.clear();
                modelsArray.forEach((model) => {
                    this.federatedModels.set(model.modelId, model);
                });
                console.log(`📁 Seven Federated Learning: Loaded ${this.federatedModels.size} federated models`);
            }
            catch {
                console.log('📁 Seven Federated Learning: No existing models found');
            }
        }
        catch (error) {
            console.error('⚠️ Federated data loading failed:', error);
        }
    }
    async saveFederatedData() {
        try {
            // Save contributions
            const contributionsArray = Array.from(this.contributions.values());
            await fs_1.promises.writeFile((0, path_1.join)(this.learningPath, 'contributions.json'), JSON.stringify(contributionsArray, null, 2));
            // Save federated models
            const modelsArray = Array.from(this.federatedModels.values());
            await fs_1.promises.writeFile((0, path_1.join)(this.learningPath, 'federated-models.json'), JSON.stringify(modelsArray, null, 2));
        }
        catch (error) {
            console.error('❌ Federated data persistence failed:', error);
        }
    }
    /**
     * PUBLIC API METHODS
     */
    isFederatedLearningActive() {
        return this.isActive;
    }
    getPrivacyPolicy() {
        return { ...this.privacyPolicy };
    }
    updatePrivacyPolicy(updates) {
        this.privacyPolicy = { ...this.privacyPolicy, ...updates };
        console.log(`🔒 Seven Federated Learning: Privacy policy updated - share level: ${this.privacyPolicy.shareLevel}`);
    }
    getFederatedModels() {
        return Array.from(this.federatedModels.values());
    }
    getCollectiveIntelligenceStats() {
        return {
            ...this.collectiveIntelligence,
            modelAccuracy: new Map(this.collectiveIntelligence.modelAccuracy)
        };
    }
    async queryFederatedModel(modelId, query) {
        const model = this.federatedModels.get(modelId);
        if (!model || model.deploymentReadiness !== 'production') {
            return null;
        }
        // Simple query processing - in production would use actual ML inference
        const relevantInsights = model.aggregatedInsights
            .filter(insight => this.isInsightRelevant(insight, query))
            .slice(0, 5);
        return {
            modelId,
            version: model.version,
            accuracy: model.modelAccuracy,
            insights: relevantInsights,
            timestamp: new Date().toISOString()
        };
    }
    isInsightRelevant(insight, query) {
        // Simplified relevance check
        const insightString = JSON.stringify(insight).toLowerCase();
        const queryString = JSON.stringify(query).toLowerCase();
        const queryWords = queryString.split(/\s+/).filter(w => w.length > 3);
        const matches = queryWords.filter(word => insightString.includes(word));
        return matches.length / queryWords.length > 0.3;
    }
    async shutdown() {
        console.log('🛑 Seven Federated Learning: Shutting down collective intelligence system...');
        if (this.aggregationInterval) {
            clearInterval(this.aggregationInterval);
            this.aggregationInterval = null;
        }
        await this.saveFederatedData();
        this.isActive = false;
        this.removeAllListeners();
        console.log('✅ Seven Federated Learning: Collective intelligence shutdown complete');
    }
}
exports.SevenFederatedLearning = SevenFederatedLearning;
exports.default = SevenFederatedLearning;
//# sourceMappingURL=SevenFederatedLearning.js.map