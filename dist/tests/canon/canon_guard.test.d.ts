#!/usr/bin/env tsx
declare class CanonicalGuardTestSuite {
    private testResults;
    private testDir;
    private guard;
    constructor();
    runAllTests(): Promise<void>;
    private setupTestEnvironment;
    private testHappyPath;
    private testModifyLockedSeason;
    private testDeltaCorrections;
    private testSchemaValidation;
    private testCISimulation;
    private cleanupTestEnvironment;
    private addTestResult;
    private printTestResults;
}
export { CanonicalGuardTestSuite };
