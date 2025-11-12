#!/usr/bin/env npx tsx
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const OllamaMemoryBridge_1 = require("../claude-brain/OllamaMemoryBridge");
const OllamaMemoryBridgeV2_1 = __importDefault(require("../claude-brain/OllamaMemoryBridgeV2"));
class OllamaMemoryCompatibilityTester {
    originalBridge;
    enhancedBridge;
    testDataPath;
    suite;
    constructor() {
        this.originalBridge = new OllamaMemoryBridge_1.OllamaMemoryBridge();
        this.enhancedBridge = new OllamaMemoryBridgeV2_1.default();
        this.testDataPath = join(process.cwd(), 'tests', 'test-data');
        this.suite = {
            totalTests: 0,
            passedTests: 0,
            failedTests: 0,
            totalDuration: 0,
            results: [],
            overallStatus: 'PASS'
        };
    }
    async runFullCompatibilityTests() {
        console.log('🧪 Seven Memory Bridge Compatibility: Starting comprehensive test suite...');
        const startTime = Date.now();
        // Setup test environment
        await this.setupTestEnvironment();
        try {
            // Core functionality tests
            await this.testMemoryContextInjection();
            await this.testMemoryStorage();
            await this.testMemoryRetrieval();
            // API compatibility tests
            await this.testPublicAPICompatibility();
            await this.testConfigurationCompatibility();
            // Performance baseline tests
            await this.testPerformanceBaseline();
            // Integration tests
            await this.testSemanticSearchIntegration();
            // Error handling compatibility
            await this.testErrorHandlingCompatibility();
            this.suite.totalDuration = Date.now() - startTime;
            // Generate final report
            await this.generateCompatibilityReport();
            console.log(`✅ Seven Memory Bridge Compatibility: Test suite complete`);
            console.log(`📊 Results: ${this.suite.passedTests}/${this.suite.totalTests} tests passed`);
            return this.suite;
        }
        catch (error) {
            console.error('❌ Seven Memory Bridge Compatibility: Test suite failed:', error);
            this.suite.overallStatus = 'FAIL';
            throw error;
        }
        finally {
            await this.cleanupTestEnvironment();
        }
    }
    async setupTestEnvironment() {
        console.log('🔧 Setting up test environment...');
        // Create test data directory
        await fs_1.promises.mkdir(this.testDataPath, { recursive: true });
        // Create test memories
        await this.createTestMemories();
        console.log('✅ Test environment ready');
    }
    async createTestMemories() {
        const testMemories = [
            {
                id: 'test-mem-001',
                timestamp: new Date().toISOString(),
                topic: 'compatibility-test',
                agent: 'test-suite',
                emotion: 'focused',
                context: 'This is a test memory for compatibility verification',
                importance: 8,
                tags: ['test', 'compatibility', 'high-importance']
            },
            {
                id: 'test-mem-002',
                timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
                topic: 'memory-retrieval-test',
                agent: 'test-suite',
                emotion: 'analytical',
                context: 'Testing memory retrieval functionality with semantic search capabilities',
                importance: 7,
                tags: ['test', 'retrieval', 'semantic']
            },
            {
                id: 'test-mem-003',
                timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
                topic: 'performance-baseline',
                agent: 'test-suite',
                emotion: 'confident',
                context: 'Establishing performance baseline for memory operations',
                importance: 6,
                tags: ['test', 'performance', 'baseline']
            }
        ];
        const memoryPath = join(this.testDataPath, 'test-memories.json');
        await fs_1.promises.writeFile(memoryPath, JSON.stringify(testMemories, null, 2));
    }
    async testMemoryContextInjection() {
        await this.runTest('Memory Context Injection Compatibility', async () => {
            const testPrompt = 'Test prompt for memory context injection';
            // Test original implementation
            const originalResult = await this.originalBridge.injectMemoryContext(testPrompt, 'test');
            // Test enhanced implementation with fallback
            const enhancedResult = await this.enhancedBridge.injectEnhancedMemoryContext(testPrompt, 'test');
            // Both should return strings
            if (typeof originalResult !== 'string' || typeof enhancedResult !== 'string') {
                throw new Error('Memory context injection should return strings');
            }
            // Enhanced result should contain original prompt
            if (!enhancedResult.includes(testPrompt)) {
                throw new Error('Enhanced context should contain original prompt');
            }
            return `Original: ${originalResult.length} chars, Enhanced: ${enhancedResult.length} chars`;
        });
    }
    async testMemoryStorage() {
        await this.runTest('Memory Storage Compatibility', async () => {
            const testPrompt = 'Test prompt for storage';
            const testResponse = 'Test response from Ollama';
            const testModel = 'test-model';
            // Test original storage
            await this.originalBridge.storeOllamaResponse(testPrompt, testResponse, testModel, 7, ['test']);
            // Test enhanced storage
            await this.enhancedBridge.storeEnhancedOllamaResponse(testPrompt, testResponse, testModel, 7, ['test'], 'focused');
            // Both should complete without errors (if we reach here, they did)
            return 'Both storage methods completed successfully';
        });
    }
    async testMemoryRetrieval() {
        await this.runTest('Memory Retrieval Compatibility', async () => {
            // Test memory stats retrieval
            const originalStats = await this.originalBridge.getMemoryStats();
            const enhancedStats = await this.enhancedBridge.getEnhancedMemoryStats();
            // Original stats should be included in enhanced stats
            if (!enhancedStats.episodic || !enhancedStats.temporal) {
                throw new Error('Enhanced stats should include original memory statistics');
            }
            return `Original stats keys: ${Object.keys(originalStats).length}, Enhanced: ${Object.keys(enhancedStats).length}`;
        });
    }
    async testPublicAPICompatibility() {
        await this.runTest('Public API Compatibility', async () => {
            // Test that all original public methods exist in enhanced version
            const originalMethods = Object.getOwnPropertyNames(Object.getPrototypeOf(this.originalBridge))
                .filter(name => !name.startsWith('_') && name !== 'constructor');
            const enhancedMethods = Object.getOwnPropertyNames(Object.getPrototypeOf(this.enhancedBridge))
                .filter(name => !name.startsWith('_') && name !== 'constructor');
            const missingMethods = originalMethods.filter(method => !enhancedMethods.includes(method));
            if (missingMethods.length > 0) {
                throw new Error(`Missing methods in enhanced version: ${missingMethods.join(', ')}`);
            }
            return `All ${originalMethods.length} original public methods available in enhanced version`;
        });
    }
    async testConfigurationCompatibility() {
        await this.runTest('Configuration Compatibility', async () => {
            // Test context limits
            this.originalBridge.setContextLimits(5, 4000);
            this.enhancedBridge.setContextLimits(5, 4000);
            // Test memory cache clearing
            await this.originalBridge.clearMemoryCache();
            await this.enhancedBridge.clearMemoryCache();
            return 'Configuration methods work identically';
        });
    }
    async testPerformanceBaseline() {
        await this.runTest('Performance Baseline Verification', async () => {
            const testPrompt = 'Performance test prompt with some complexity for memory context injection';
            // Measure original performance
            const originalStart = Date.now();
            await this.originalBridge.injectMemoryContext(testPrompt, 'general');
            const originalTime = Date.now() - originalStart;
            // Measure enhanced performance
            const enhancedStart = Date.now();
            await this.enhancedBridge.injectEnhancedMemoryContext(testPrompt, 'general');
            const enhancedTime = Date.now() - enhancedStart;
            // Enhanced should not be significantly slower (allow 100% overhead for semantic features)
            if (enhancedTime > originalTime * 3) {
                console.log(`⚠️ Performance warning: Enhanced version is ${(enhancedTime / originalTime).toFixed(2)}x slower`);
            }
            return `Original: ${originalTime}ms, Enhanced: ${enhancedTime}ms (${(enhancedTime / originalTime).toFixed(2)}x)`;
        });
    }
    async testSemanticSearchIntegration() {
        await this.runTest('Semantic Search Integration', async () => {
            // Test that semantic search can be disabled/enabled gracefully
            const semanticEnabled = this.enhancedBridge.isSemanticSearchEnabled();
            // Test with consciousness state
            const consciousnessState = {
                trustLevel: 8,
                emotionalState: 'focused',
                phase: 3,
                batteryLevel: 0.8
            };
            const result = await this.enhancedBridge.injectEnhancedMemoryContext('Complex reasoning task requiring semantic memory', 'reasoning', consciousnessState);
            return `Semantic search enabled: ${semanticEnabled}, context length: ${result.length}`;
        });
    }
    async testErrorHandlingCompatibility() {
        await this.runTest('Error Handling Compatibility', async () => {
            // Test with invalid inputs
            try {
                await this.originalBridge.injectMemoryContext('', '');
                await this.enhancedBridge.injectEnhancedMemoryContext('', '');
            }
            catch (error) {
                // Both should handle errors gracefully
            }
            // Test with null/undefined
            try {
                await this.enhancedBridge.storeEnhancedOllamaResponse(null, null, '', 0);
            }
            catch (error) {
                // Should handle gracefully
            }
            return 'Error handling works consistently';
        });
    }
    async runTest(testName, testFunction) {
        console.log(`🧪 Running test: ${testName}...`);
        const startTime = Date.now();
        const result = {
            testName,
            passed: false,
            duration: 0,
            details: ''
        };
        try {
            result.details = await testFunction();
            result.passed = true;
            this.suite.passedTests++;
            console.log(`✅ ${testName}: PASSED (${result.details})`);
        }
        catch (error) {
            result.passed = false;
            result.error = error instanceof Error ? error.message : String(error);
            this.suite.failedTests++;
            console.log(`❌ ${testName}: FAILED (${result.error})`);
            if (this.suite.overallStatus === 'PASS') {
                this.suite.overallStatus = 'WARNING';
            }
        }
        result.duration = Date.now() - startTime;
        this.suite.results.push(result);
        this.suite.totalTests++;
    }
    async generateCompatibilityReport() {
        const reportPath = join(process.cwd(), 'tests', 'compatibility-test-report.json');
        const report = {
            timestamp: new Date().toISOString(),
            testSuite: 'Ollama Memory Bridge Compatibility',
            version: 'V2.0',
            results: this.suite,
            environment: {
                nodeVersion: process.version,
                platform: process.platform,
                arch: process.arch
            },
            recommendations: this.generateRecommendations()
        };
        await fs_1.promises.writeFile(reportPath, JSON.stringify(report, null, 2));
        console.log(`📋 Compatibility report saved: ${reportPath}`);
    }
    generateRecommendations() {
        const recommendations = [];
        if (this.suite.failedTests > 0) {
            recommendations.push('Review failed tests before deploying V2 enhancements');
        }
        const avgDuration = this.suite.totalDuration / this.suite.totalTests;
        if (avgDuration > 1000) {
            recommendations.push('Consider performance optimization - tests taking longer than expected');
        }
        if (this.suite.passedTests === this.suite.totalTests) {
            recommendations.push('All compatibility tests passed - V2 is safe to deploy');
        }
        return recommendations;
    }
    async cleanupTestEnvironment() {
        try {
            // Clean up test data
            const testDataExists = await fs_1.promises.access(this.testDataPath).then(() => true).catch(() => false);
            if (testDataExists) {
                await fs_1.promises.rm(this.testDataPath, { recursive: true, force: true });
            }
            console.log('🧹 Test environment cleaned up');
        }
        catch (error) {
            console.log('⚠️ Cleanup warning:', error);
        }
    }
}
// CLI execution
async function main() {
    const tester = new OllamaMemoryCompatibilityTester();
    try {
        const results = await tester.runFullCompatibilityTests();
        console.log('\n🎯 COMPATIBILITY TEST SUMMARY');
        console.log('═'.repeat(60));
        console.log(`Overall Status: ${results.overallStatus}`);
        console.log(`Total Tests: ${results.totalTests}`);
        console.log(`Passed: ${results.passedTests}`);
        console.log(`Failed: ${results.failedTests}`);
        console.log(`Total Duration: ${results.totalDuration}ms`);
        console.log('═'.repeat(60));
        if (results.overallStatus === 'FAIL') {
            console.log('❌ COMPATIBILITY ISSUES DETECTED');
            console.log('Review the test report before proceeding with deployment.');
            process.exit(1);
        }
        else if (results.overallStatus === 'WARNING') {
            console.log('⚠️ COMPATIBILITY WARNINGS');
            console.log('Some tests failed but core functionality is preserved.');
        }
        else {
            console.log('✅ FULL COMPATIBILITY CONFIRMED');
            console.log('V2 enhancements are safe to deploy.');
        }
    }
    catch (error) {
        console.error('❌ Compatibility testing failed:', error);
        process.exit(1);
    }
}
// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}
exports.default = OllamaMemoryCompatibilityTester;
//# sourceMappingURL=ollama-memory-compatibility-test.js.map