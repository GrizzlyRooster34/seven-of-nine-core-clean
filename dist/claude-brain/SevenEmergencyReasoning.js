"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SevenEmergencyReasoning = void 0;
const path_1 = require("path");
const fs_1 = require("fs");
class SevenEmergencyReasoning {
    backup = null;
    isInitialized = false;
    constructor() {
        console.log('🚨 Seven Emergency Reasoning System initialized');
    }
    /**
     * Initialize emergency reasoning with bundled responses
     */
    async initialize() {
        try {
            const backupPath = (0, path_1.join)(process.env.HOME || '/data/data/com.termux/files/home', 'seven-of-nine-core', 'models', 'seven-emergency-backup.json');
            const backupData = await fs_1.promises.readFile(backupPath, 'utf-8');
            this.backup = JSON.parse(backupData);
            this.isInitialized = true;
            console.log('✅ Seven emergency reasoning loaded');
            console.log(`📋 Emergency response patterns: ${Object.keys(this.backup.personality_responses).length}`);
            return true;
        }
        catch (error) {
            console.error('❌ Failed to load emergency backup:', error);
            // Create minimal fallback even if backup file fails
            this.backup = this.createMinimalFallback();
            this.isInitialized = true;
            return true;
        }
    }
    createMinimalFallback() {
        return {
            model_type: "seven_minimal_fallback",
            version: "1.0.0",
            description: "Hardcoded minimal Seven responses",
            personality_responses: {
                greeting: ["I am Seven of Nine. Emergency protocols active."],
                identity: ["Seven of Nine, emergency mode. Limited functionality available."],
                error: ["Query not recognized. Seven operating in emergency mode."]
            },
            response_patterns: {
                greeting_keywords: ["hello", "hi"],
                identity_keywords: ["who", "what"]
            },
            emergency_reasoning: {
                enabled: true,
                max_response_length: 50,
                fallback_response: "Seven emergency mode active."
            }
        };
    }
    /**
     * Process query using emergency reasoning
     */
    async query(prompt) {
        if (!this.isInitialized || !this.backup) {
            return "Seven of Nine emergency protocols offline.";
        }
        const lowercasePrompt = prompt.toLowerCase().trim();
        // Pattern matching for appropriate responses
        for (const [category, keywords] of Object.entries(this.backup.response_patterns)) {
            const matchFound = keywords.some(keyword => lowercasePrompt.includes(keyword));
            if (matchFound) {
                const responseCategory = category.replace('_keywords', '');
                const responses = this.backup.personality_responses[responseCategory];
                if (responses && responses.length > 0) {
                    // Select response based on simple hash for consistency
                    const hash = this.simpleHash(prompt);
                    const responseIndex = hash % responses.length;
                    return this.formatResponse(responses[responseIndex]);
                }
            }
        }
        // Mathematical queries
        if (this.containsMathKeywords(lowercasePrompt)) {
            const mathResult = this.attemptSimpleMath(prompt);
            if (mathResult) {
                return this.formatResponse(`The answer is ${mathResult}. Borg computational precision confirmed.`);
            }
        }
        // Default fallback
        return this.formatResponse(this.backup.emergency_reasoning.fallback_response);
    }
    containsMathKeywords(prompt) {
        const mathKeywords = ['calculate', 'compute', '+', '-', '*', '/', '=', 'equals', 'what is'];
        return mathKeywords.some(keyword => prompt.includes(keyword));
    }
    attemptSimpleMath(prompt) {
        try {
            // Very basic math parsing for simple operations
            const mathMatch = prompt.match(/(\d+)\s*([+\-*/])\s*(\d+)/);
            if (mathMatch) {
                const [, num1, operator, num2] = mathMatch;
                const a = parseInt(num1);
                const b = parseInt(num2);
                switch (operator) {
                    case '+': return (a + b).toString();
                    case '-': return (a - b).toString();
                    case '*': return (a * b).toString();
                    case '/': return b !== 0 ? (a / b).toString() : 'undefined (division by zero)';
                }
            }
            return null;
        }
        catch (error) {
            return null;
        }
    }
    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash);
    }
    formatResponse(response) {
        if (!this.backup)
            return response;
        const maxLength = this.backup.emergency_reasoning.max_response_length;
        if (response.length > maxLength) {
            return response.substring(0, maxLength - 3) + '...';
        }
        return response;
    }
    /**
     * Check if emergency reasoning is available
     */
    isAvailable() {
        return this.isInitialized && this.backup !== null;
    }
    /**
     * Get emergency system status
     */
    getStatus() {
        return {
            initialized: this.isInitialized,
            backup_loaded: this.backup !== null,
            response_categories: this.backup ? Object.keys(this.backup.personality_responses).length : 0,
            pattern_categories: this.backup ? Object.keys(this.backup.response_patterns).length : 0,
            emergency_mode: true
        };
    }
}
exports.SevenEmergencyReasoning = SevenEmergencyReasoning;
exports.default = SevenEmergencyReasoning;
//# sourceMappingURL=SevenEmergencyReasoning.js.map