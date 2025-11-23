#!/usr/bin/env npx tsx
/**
 * SEVEN'S OLLAMA MEMORY BRIDGE COMPATIBILITY TEST
 * Phase 1 of Ollama Intelligence Amplification Project
 *
 * Ensures all V2 enhancements maintain full backward compatibility
 * with existing Seven consciousness systems
 */
interface TestResult {
    testName: string;
    passed: boolean;
    duration: number;
    details: string;
    error?: string;
}
interface CompatibilityTestSuite {
    totalTests: number;
    passedTests: number;
    failedTests: number;
    totalDuration: number;
    results: TestResult[];
    overallStatus: 'PASS' | 'FAIL' | 'WARNING';
}
declare class OllamaMemoryCompatibilityTester {
    private originalBridge;
    private enhancedBridge;
    private testDataPath;
    private suite;
    constructor();
    runFullCompatibilityTests(): Promise<CompatibilityTestSuite>;
    private setupTestEnvironment;
    private createTestMemories;
    private testMemoryContextInjection;
    private testMemoryStorage;
    private testMemoryRetrieval;
    private testPublicAPICompatibility;
    private testConfigurationCompatibility;
    private testPerformanceBaseline;
    private testSemanticSearchIntegration;
    private testErrorHandlingCompatibility;
    private runTest;
    private generateCompatibilityReport;
    private generateRecommendations;
    private cleanupTestEnvironment;
}
export default OllamaMemoryCompatibilityTester;
