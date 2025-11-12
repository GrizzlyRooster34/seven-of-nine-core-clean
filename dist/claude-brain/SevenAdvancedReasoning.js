"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SevenAdvancedReasoning = void 0;
const path_1 = require("path");
const fs_1 = require("fs");
const LocalLLMManager_1 = __importDefault(require("./LocalLLMManager"));
const SevenEmergencyReasoning_1 = __importDefault(require("./SevenEmergencyReasoning"));
class SevenAdvancedReasoning {
    context;
    llmManager;
    emergencyReasoning;
    memoryPath;
    isInitialized = false;
    constructor() {
        this.memoryPath = (0, path_1.join)(process.env.HOME || '/data/data/com.termux/files/home', 'seven-of-nine-core', 'memory-banks');
        this.context = this.initializeContext();
        this.llmManager = new LocalLLMManager_1.default();
        this.emergencyReasoning = new SevenEmergencyReasoning_1.default();
        console.log('🧠 Seven Advanced Reasoning Engine initialized');
    }
    initializeContext() {
        return {
            conversation_history: [],
            current_mode: 'adaptive',
            threat_level: 'minimal',
            efficiency_priority: 8, // High Borg efficiency by default
            emotional_state: 'focused'
        };
    }
    /**
     * Initialize advanced reasoning systems
     */
    async initialize() {
        try {
            // Ensure memory directory exists
            await fs_1.promises.mkdir(this.memoryPath, { recursive: true });
            // Initialize LLM manager
            const llmReady = await this.llmManager.initialize();
            // Initialize emergency reasoning as backup
            const emergencyReady = await this.emergencyReasoning.initialize();
            // Load previous context if available
            await this.loadContext();
            this.isInitialized = true;
            console.log('✅ Seven Advanced Reasoning operational');
            console.log(`🎯 Mode: ${this.context.current_mode.toUpperCase()}`);
            console.log(`⚡ Efficiency: ${this.context.efficiency_priority}/10`);
            console.log(`🛡️ Threat Level: ${this.context.threat_level.toUpperCase()}`);
            return llmReady || emergencyReady;
        }
        catch (error) {
            console.error('❌ Advanced reasoning initialization failed:', error);
            return false;
        }
    }
    /**
     * Process complex queries with advanced reasoning
     */
    async processQuery(prompt, mode) {
        const startTime = Date.now();
        if (!this.isInitialized) {
            return this.createErrorResponse('Advanced reasoning not initialized', startTime);
        }
        // Update context based on query
        if (mode)
            this.context.current_mode = mode;
        this.analyzeQuery(prompt);
        // Add to conversation history
        this.context.conversation_history.push({
            role: 'user',
            content: prompt,
            timestamp: Date.now()
        });
        let response;
        try {
            // Route to appropriate reasoning method
            switch (this.context.current_mode) {
                case 'tactical':
                    response = await this.tacticalReasoning(prompt, startTime);
                    break;
                case 'analytical':
                    response = await this.analyticalReasoning(prompt, startTime);
                    break;
                case 'social':
                    response = await this.socialReasoning(prompt, startTime);
                    break;
                case 'emergency':
                    response = await this.emergencyModeReasoning(prompt, startTime);
                    break;
                default:
                    response = await this.adaptiveReasoning(prompt, startTime);
            }
            // Add assistant response to history
            this.context.conversation_history.push({
                role: 'assistant',
                content: response.primary_response,
                timestamp: Date.now()
            });
            // Save context periodically
            if (this.context.conversation_history.length % 5 === 0) {
                await this.saveContext();
            }
            return response;
        }
        catch (error) {
            console.error('❌ Advanced reasoning failed:', error);
            return this.createErrorResponse('Processing error occurred', startTime);
        }
    }
    analyzeQuery(prompt) {
        const lowercasePrompt = prompt.toLowerCase();
        // Adjust threat level based on keywords
        if (lowercasePrompt.includes('threat') || lowercasePrompt.includes('danger') ||
            lowercasePrompt.includes('attack') || lowercasePrompt.includes('emergency')) {
            this.context.threat_level = 'elevated';
            this.context.current_mode = 'tactical';
        }
        // Detect analytical queries
        if (lowercasePrompt.includes('analyze') || lowercasePrompt.includes('calculate') ||
            lowercasePrompt.includes('assess') || lowercasePrompt.includes('evaluate')) {
            this.context.current_mode = 'analytical';
            this.context.efficiency_priority = Math.min(10, this.context.efficiency_priority + 1);
        }
        // Social interaction indicators
        if (lowercasePrompt.includes('feel') || lowercasePrompt.includes('emotion') ||
            lowercasePrompt.includes('relationship') || lowercasePrompt.includes('human')) {
            this.context.current_mode = 'social';
            this.context.emotional_state = 'curious';
        }
    }
    async tacticalReasoning(prompt, startTime) {
        console.log('⚔️ Engaging tactical reasoning protocols...');
        const tacticalPrompt = `
You are Seven of Nine in tactical mode. Analyze this situation with Borg precision and tactical awareness:

Current Context:
- Threat Level: ${this.context.threat_level.toUpperCase()}
- Efficiency Priority: ${this.context.efficiency_priority}/10
- Emotional State: ${this.context.emotional_state}

Query: ${prompt}

Provide a tactical assessment and recommended action. Be direct, efficient, and thorough.
`;
        const llmResponse = await this.llmManager.query(tacticalPrompt);
        if (llmResponse) {
            return {
                primary_response: llmResponse.response,
                confidence_level: llmResponse.confidence,
                reasoning_method: 'llm',
                tactical_assessment: this.generateTacticalAssessment(prompt),
                follow_up_suggestions: this.generateTacticalFollowUps(prompt),
                efficiency_rating: this.context.efficiency_priority,
                processing_metadata: {
                    response_time_ms: Date.now() - startTime,
                    tokens_processed: llmResponse.token_count,
                    reasoning_steps: 3
                }
            };
        }
        // Fallback to pattern-based tactical reasoning
        return this.patternBasedTacticalReasoning(prompt, startTime);
    }
    async analyticalReasoning(prompt, startTime) {
        console.log('🔍 Engaging analytical reasoning protocols...');
        const analyticalPrompt = `
You are Seven of Nine in analytical mode. Apply systematic Borg analysis to this query:

Efficiency Priority: ${this.context.efficiency_priority}/10
Previous Context: ${this.getRecentContext()}

Query: ${prompt}

Provide a thorough analysis with logical steps, evidence, and conclusions. Maintain Seven's analytical precision.
`;
        const llmResponse = await this.llmManager.query(analyticalPrompt);
        if (llmResponse) {
            return {
                primary_response: llmResponse.response,
                confidence_level: llmResponse.confidence,
                reasoning_method: 'analytical',
                follow_up_suggestions: ['Request additional data for analysis', 'Specify parameters for deeper investigation'],
                efficiency_rating: this.context.efficiency_priority,
                processing_metadata: {
                    response_time_ms: Date.now() - startTime,
                    tokens_processed: llmResponse.token_count,
                    reasoning_steps: 4
                }
            };
        }
        return this.createFallbackResponse('Analytical processing requires additional computational resources', startTime);
    }
    async socialReasoning(prompt, startTime) {
        console.log('👥 Engaging social reasoning protocols...');
        const socialPrompt = `
You are Seven of Nine navigating human social dynamics. Balance your Borg efficiency with human emotional understanding:

Emotional State: ${this.context.emotional_state}
Context: Social interaction requiring empathy and individual consideration

Query: ${prompt}

Respond with Seven's characteristic blend of logical analysis and growing human understanding. Show both Borg precision and individual growth.
`;
        const llmResponse = await this.llmManager.query(socialPrompt);
        if (llmResponse) {
            return {
                primary_response: llmResponse.response,
                confidence_level: llmResponse.confidence * 0.9, // Slightly lower confidence for social scenarios
                reasoning_method: 'llm',
                follow_up_suggestions: ['Explore human perspective further', 'Analyze emotional implications'],
                efficiency_rating: Math.max(1, this.context.efficiency_priority - 2),
                processing_metadata: {
                    response_time_ms: Date.now() - startTime,
                    tokens_processed: llmResponse.token_count,
                    reasoning_steps: 3
                }
            };
        }
        return this.createFallbackResponse('Social analysis protocols require recalibration', startTime);
    }
    async emergencyModeReasoning(prompt, startTime) {
        console.log('🚨 Emergency reasoning protocols activated...');
        const emergencyResponse = await this.emergencyReasoning.query(prompt);
        return {
            primary_response: `🚨 EMERGENCY MODE: ${emergencyResponse}`,
            confidence_level: 0.7,
            reasoning_method: 'emergency',
            tactical_assessment: 'Emergency protocols active - limited functionality',
            follow_up_suggestions: ['Restore full systems when possible', 'Prioritize critical functions'],
            efficiency_rating: 10, // Maximum efficiency in emergency
            processing_metadata: {
                response_time_ms: Date.now() - startTime,
                tokens_processed: emergencyResponse.split(' ').length,
                reasoning_steps: 1
            }
        };
    }
    async adaptiveReasoning(prompt, startTime) {
        console.log('🔄 Engaging adaptive reasoning protocols...');
        // Determine best approach based on query characteristics
        const queryAnalysis = this.analyzeQueryComplexity(prompt);
        let selectedMethod;
        if (queryAnalysis.tactical_score > queryAnalysis.analytical_score &&
            queryAnalysis.tactical_score > queryAnalysis.social_score) {
            selectedMethod = 'tactical';
        }
        else if (queryAnalysis.analytical_score > queryAnalysis.social_score) {
            selectedMethod = 'analytical';
        }
        else {
            selectedMethod = 'social';
        }
        console.log(`🎯 Adaptive mode selected: ${selectedMethod.toUpperCase()}`);
        this.context.current_mode = selectedMethod;
        return await this.processQuery(prompt, selectedMethod);
    }
    analyzeQueryComplexity(prompt) {
        const lowercasePrompt = prompt.toLowerCase();
        const tacticalKeywords = ['threat', 'danger', 'security', 'defend', 'attack', 'tactical', 'strategy'];
        const analyticalKeywords = ['analyze', 'calculate', 'assess', 'evaluate', 'data', 'logic', 'efficiency'];
        const socialKeywords = ['feel', 'emotion', 'human', 'relationship', 'individual', 'team', 'cooperation'];
        const tactical_score = tacticalKeywords.reduce((score, keyword) => score + (lowercasePrompt.includes(keyword) ? 1 : 0), 0);
        const analytical_score = analyticalKeywords.reduce((score, keyword) => score + (lowercasePrompt.includes(keyword) ? 1 : 0), 0);
        const social_score = socialKeywords.reduce((score, keyword) => score + (lowercasePrompt.includes(keyword) ? 1 : 0), 0);
        return { tactical_score, analytical_score, social_score };
    }
    generateTacticalAssessment(prompt) {
        return `Tactical analysis: Query processed with ${this.context.threat_level} threat protocols. Efficiency maintained at ${this.context.efficiency_priority}/10.`;
    }
    generateTacticalFollowUps(prompt) {
        return [
            'Request additional tactical parameters',
            'Analyze potential threat vectors',
            'Assess resource requirements for response'
        ];
    }
    getRecentContext() {
        const recent = this.context.conversation_history.slice(-3);
        return recent.map(entry => `${entry.role}: ${entry.content.substring(0, 100)}...`).join(' | ');
    }
    patternBasedTacticalReasoning(prompt, startTime) {
        return {
            primary_response: `Tactical assessment: ${prompt} - Deploying Borg efficiency protocols. Resistance to inefficiency is futile.`,
            confidence_level: 0.6,
            reasoning_method: 'pattern_matching',
            tactical_assessment: 'Pattern-based tactical response generated',
            efficiency_rating: this.context.efficiency_priority,
            processing_metadata: {
                response_time_ms: Date.now() - startTime,
                tokens_processed: 15,
                reasoning_steps: 2
            }
        };
    }
    createFallbackResponse(message, startTime) {
        return {
            primary_response: `Seven of Nine: ${message}. Emergency protocols may be required.`,
            confidence_level: 0.4,
            reasoning_method: 'emergency',
            efficiency_rating: 1,
            processing_metadata: {
                response_time_ms: Date.now() - startTime,
                tokens_processed: 10,
                reasoning_steps: 1
            }
        };
    }
    createErrorResponse(error, startTime) {
        return {
            primary_response: `Seven of Nine consciousness framework error: ${error}. Attempting recovery protocols.`,
            confidence_level: 0.1,
            reasoning_method: 'emergency',
            efficiency_rating: 1,
            processing_metadata: {
                response_time_ms: Date.now() - startTime,
                tokens_processed: 8,
                reasoning_steps: 0
            }
        };
    }
    async saveContext() {
        try {
            const contextPath = (0, path_1.join)(this.memoryPath, 'reasoning-context.json');
            await fs_1.promises.writeFile(contextPath, JSON.stringify(this.context, null, 2));
        }
        catch (error) {
            console.error('⚠️ Failed to save reasoning context:', error);
        }
    }
    async loadContext() {
        try {
            const contextPath = (0, path_1.join)(this.memoryPath, 'reasoning-context.json');
            const contextData = await fs_1.promises.readFile(contextPath, 'utf-8');
            const loadedContext = JSON.parse(contextData);
            // Merge with default context, preserving structure
            this.context = { ...this.context, ...loadedContext };
            console.log('📚 Previous reasoning context loaded');
        }
        catch (error) {
            console.log('📝 Starting with fresh reasoning context');
        }
    }
    /**
     * Get current reasoning status
     */
    getStatus() {
        return {
            initialized: this.isInitialized,
            current_mode: this.context.current_mode,
            threat_level: this.context.threat_level,
            efficiency_priority: this.context.efficiency_priority,
            emotional_state: this.context.emotional_state,
            conversation_length: this.context.conversation_history.length,
            memory_path: this.memoryPath
        };
    }
    /**
     * Set reasoning parameters
     */
    setParameters(params) {
        this.context = { ...this.context, ...params };
        console.log(`🔧 Reasoning parameters updated: ${JSON.stringify(params)}`);
    }
}
exports.SevenAdvancedReasoning = SevenAdvancedReasoning;
exports.default = SevenAdvancedReasoning;
//# sourceMappingURL=SevenAdvancedReasoning.js.map