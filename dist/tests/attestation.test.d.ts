#!/usr/bin/env tsx
declare class AttestationTestSuite {
    private testResults;
    runAllTests(): Promise<void>;
    private testAttestationCreation;
    private testAttestationAccess;
    private testImmutability;
    private testDeletionProtection;
    private testIntegrityVerification;
    private addTestResult;
    private printTestResults;
}
export { AttestationTestSuite };
