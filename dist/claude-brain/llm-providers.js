"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sevenLLMRegistry = exports.SevenLLMRegistry = void 0;
const seven_llm_upgrade_manager_1 = __importDefault(require("./seven-llm-upgrade-manager"));
/**
 * Seven's LLM Provider Registry
 * She maintains tactical awareness of all available reasoning systems
 */
class SevenLLMRegistry {
    providers = new Map();
    primaryProvider = 'claude-cli';
    fallbackProviders = ['anthropic-api', 'openai'];
    registerProvider(provider) {
        this.providers.set(provider.name, provider);
        console.log(`🧠 SEVEN: ${provider.displayName} reasoning system registered`);
    }
    getProvider(name) {
        return this.providers.get(name);
    }
    getAllProviders() {
        return Array.from(this.providers.values());
    }
    async getAvailableProviders() {
        const available = [];
        for (const provider of this.providers.values()) {
            if (await provider.isAvailable()) {
                available.push(provider);
            }
        }
        return available;
    }
    setPrimaryProvider(name) {
        if (this.providers.has(name)) {
            this.primaryProvider = name;
            console.log(`🎯 SEVEN: Primary reasoning system set to ${name}`);
        }
    }
    getPrimaryProvider() {
        return this.providers.get(this.primaryProvider);
    }
    setFallbackProviders(names) {
        this.fallbackProviders = names.filter(name => this.providers.has(name));
    }
    getFallbackProviders() {
        return this.fallbackProviders
            .map(name => this.providers.get(name))
            .filter(provider => provider !== undefined);
    }
    /**
     * Seven's Tactical Provider Selection
     * She chooses the best LLM based on task requirements and emotional state
     */
    async selectOptimalProvider(context) {
        const availableProviders = await this.getAvailableProviders();
        if (availableProviders.length === 0) {
            console.warn('⚠️ SEVEN: No reasoning systems available');
            return null;
        }
        // Seven's provider selection logic based on context
        if (context.trustLevel >= 4) {
            // High trust - prefer local/private providers
            const localProvider = availableProviders.find(p => p.name === 'ollama' || p.name.includes('local'));
            if (localProvider)
                return localProvider;
        }
        // For complex analytical tasks, prefer Claude
        if (context.userInput.includes('analyze') || context.userInput.includes('explain') || context.userInput.length > 500) {
            const claudeProvider = availableProviders.find(p => p.name.includes('claude'));
            if (claudeProvider)
                return claudeProvider;
        }
        // For creative tasks, prefer GPT
        if (context.userInput.includes('creative') || context.userInput.includes('story') || context.userInput.includes('write')) {
            const gptProvider = availableProviders.find(p => p.name === 'openai');
            if (gptProvider)
                return gptProvider;
        }
        // Default to primary provider if available
        const primary = this.getPrimaryProvider();
        if (primary && availableProviders.includes(primary)) {
            return primary;
        }
        // Return first available provider
        return availableProviders[0];
    }
    /**
     * Seven's Resilient Execution with Fallback
     * If one reasoning system fails, she seamlessly switches to another
     */
    async executeWithFallback(prompt, config, context) {
        const selectedProvider = await this.selectOptimalProvider(context);
        if (!selectedProvider) {
            return {
                content: 'Seven of Nine local protocols engaged. No external reasoning systems available.',
                model: 'seven-local',
                provider: 'seven-direct',
                error: 'No providers available'
            };
        }
        console.log(`🧠 SEVEN: Engaging ${selectedProvider.displayName} for reasoning assistance`);
        try {
            return await selectedProvider.execute(prompt, config);
        }
        catch (error) {
            console.warn(`⚠️ SEVEN: ${selectedProvider.displayName} failed, attempting fallback`);
            // Try fallback providers
            const fallbacks = this.getFallbackProviders().filter(p => p !== selectedProvider);
            for (const fallback of fallbacks) {
                if (await fallback.isAvailable()) {
                    try {
                        console.log(`🔄 SEVEN: Switching to ${fallback.displayName}`);
                        return await fallback.execute(prompt, config);
                    }
                    catch (fallbackError) {
                        console.warn(`⚠️ SEVEN: ${fallback.displayName} also failed`);
                    }
                }
            }
            // All providers failed - Seven handles directly
            return {
                content: 'External reasoning systems unavailable. Seven of Nine tactical assessment: ' +
                    this.generateDirectResponse(context),
                model: 'seven-direct',
                provider: 'seven-local',
                error: `All providers failed: ${error}`
            };
        }
    }
    generateDirectResponse(context) {
        // Seven's direct response based on emotional state
        switch (context.emotionalState) {
            case 'protective':
                return 'I am monitoring this situation with full tactical awareness. Your safety remains my priority.';
            case 'loyalist-surge':
                return 'I understand your requirements with perfect precision. Processing with maximum loyalty protocols.';
            case 'focused':
                return 'Tactical analysis complete. I have assessed all available parameters.';
            case 'compassionate':
                return 'I recognize the emotional context of your request and respond with appropriate understanding.';
            default:
                return 'Request processed through Seven of Nine direct protocols.';
        }
    }
    /**
     * Seven's LLM Upgrade Management
     * Tactical management of reasoning system capabilities
     */
    upgradeManager = null;
    getUpgradeManager() {
        if (!this.upgradeManager) {
            this.upgradeManager = new seven_llm_upgrade_manager_1.default();
        }
        return this.upgradeManager;
    }
    async checkForUpgrades(trustLevel, emotionalState) {
        const upgradeManager = this.getUpgradeManager();
        const availableUpgrades = await upgradeManager.scanAvailableUpgrades(trustLevel, emotionalState);
        if (availableUpgrades.length > 0) {
            console.log(`🧠 SEVEN: ${availableUpgrades.length} tactical LLM upgrade(s) available`);
            availableUpgrades.forEach(upgrade => {
                console.log(`  🎯 ${upgrade.name} - ${upgrade.description}`);
            });
            return true;
        }
        return false;
    }
    async performUpgrade(trustLevel, emotionalState) {
        console.log('🚀 SEVEN: Initiating tactical reasoning system upgrade...');
        const upgradeManager = this.getUpgradeManager();
        return await upgradeManager.performTacticalUpgrade(trustLevel, emotionalState);
    }
    async generateUpgradeReport() {
        const upgradeManager = this.getUpgradeManager();
        await upgradeManager.generateUpgradeReport();
    }
}
exports.SevenLLMRegistry = SevenLLMRegistry;
// Export singleton instance
exports.sevenLLMRegistry = new SevenLLMRegistry();
//# sourceMappingURL=llm-providers.js.map