#!/usr/bin/env tsx
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CanonicalGuardTestSuite = void 0;
const path_1 = require("path");
const fs_1 = require("fs");
const crypto = __importStar(require("crypto"));
const CanonicalGuard_1 = require("../../memory-v3/canonical/CanonicalGuard");
class CanonicalGuardTestSuite {
    testResults = [];
    testDir;
    guard;
    constructor() {
        this.testDir = (0, path_1.join)(__dirname, 'test-canonical-temp');
        this.guard = new CanonicalGuard_1.CanonicalGuard(this.testDir);
    }
    async runAllTests() {
        console.log('🛡️  CANONICAL GUARD TEST SUITE');
        console.log('='.repeat(60));
        console.log('Testing enforcement of canonical doctrine:');
        console.log('"Canonical memories are sacrosanct. They are write-once,');
        console.log(' append-only, and never altered post-ingestion."');
        console.log('='.repeat(60));
        try {
            // Setup test environment
            await this.setupTestEnvironment();
            // Core functionality tests
            await this.testHappyPath();
            await this.testModifyLockedSeason();
            await this.testDeltaCorrections();
            await this.testSchemaValidation();
            await this.testCISimulation();
            // Cleanup
            await this.cleanupTestEnvironment();
        }
        finally {
            // Print results
            this.printTestResults();
        }
    }
    async setupTestEnvironment() {
        console.log('\n🔧 Setting up test environment...');
        // Clean any existing test directory
        try {
            await fs_1.promises.rm(this.testDir, { recursive: true, force: true });
        }
        catch (error) {
            // Directory might not exist, ignore
        }
        // Create test directory structure
        await fs_1.promises.mkdir((0, path_1.join)(this.testDir, 'voyager'), { recursive: true });
        await fs_1.promises.mkdir((0, path_1.join)(this.testDir, 'picard'), { recursive: true });
        console.log('✅ Test environment ready');
    }
    async testHappyPath() {
        const testName = 'Happy Path: Register → Lock → Verify';
        const startTime = Date.now();
        try {
            // Create mock canonical season file
            const seasonPath = (0, path_1.join)(this.testDir, 'voyager', 'season4.jsonl');
            const mockRecords = [
                {
                    id: 'test-voy-s4e01-scorpion',
                    tags: ['canon', 'series:VOY', 'season:S4', 'episode:E01'],
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                    importance: 10,
                    payload: { episode: 'Scorpion, Part II', test: true },
                    provenance: {
                        origin: 'canonical',
                        meta: { series: 'VOY', season: 4, episode: 1, title: 'Scorpion, Part II' }
                    }
                },
                {
                    id: 'test-voy-s4e02-the-gift',
                    tags: ['canon', 'series:VOY', 'season:S4', 'episode:E02'],
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                    importance: 10,
                    payload: { episode: 'The Gift', test: true },
                    provenance: {
                        origin: 'canonical',
                        meta: { series: 'VOY', season: 4, episode: 2, title: 'The Gift' }
                    }
                }
            ];
            const jsonlContent = mockRecords.map(r => JSON.stringify(r)).join('\n');
            await fs_1.promises.writeFile(seasonPath, jsonlContent);
            // Step 1: Register season
            await this.guard.registerSeason(seasonPath, { series: 'VOY', season: 4 }, {
                operator: 'test-suite',
                curator: 'test-cody',
                sourceHash: crypto.createHash('sha256').update('test-source').digest('hex'),
                normalizedHash: crypto.createHash('sha256').update(jsonlContent).digest('hex'),
                recordCount: 2
            });
            // Step 2: Verify unlocked
            let report = await this.guard.verifySeason('VOY', 4);
            if (report.errors.length > 0) {
                throw new Error(`Pre-lock verification failed: ${report.errors.join(', ')}`);
            }
            if (report.locked) {
                throw new Error('Season should not be locked yet');
            }
            // Step 3: Lock season
            await this.guard.lockSeason('VOY', 4);
            // Step 4: Verify locked
            report = await this.guard.verifySeason('VOY', 4);
            if (report.errors.length > 0) {
                throw new Error(`Post-lock verification failed: ${report.errors.join(', ')}`);
            }
            if (!report.locked) {
                throw new Error('Season should be locked');
            }
            this.addTestResult(testName, true, `Complete lifecycle successful: registered → locked → verified (${report.errors.length} errors)`, Date.now() - startTime);
        }
        catch (error) {
            this.addTestResult(testName, false, `Happy path failed: ${error}`, Date.now() - startTime);
        }
    }
    async testModifyLockedSeason() {
        const testName = 'Security: Modify Locked Season → Expect Throw';
        const startTime = Date.now();
        try {
            const seasonPath = (0, path_1.join)(this.testDir, 'voyager', 'season4.jsonl');
            // Attempt to modify the locked file
            const originalContent = await fs_1.promises.readFile(seasonPath, 'utf8');
            const modifiedContent = originalContent + '\n// UNAUTHORIZED MODIFICATION';
            await fs_1.promises.writeFile(seasonPath, modifiedContent);
            // This should throw when we check immutability
            try {
                await this.guard.assertImmutable(seasonPath);
                // If we reach here, the guard failed to detect the breach
                this.addTestResult(testName, false, 'Guard failed to detect unauthorized modification of locked season', Date.now() - startTime);
                return;
            }
            catch (breachError) {
                // Good! The guard detected the breach
                if (breachError.message.includes('CANONICAL BREACH')) {
                    // Restore the file for other tests
                    await fs_1.promises.writeFile(seasonPath, originalContent);
                    this.addTestResult(testName, true, `Guard correctly detected breach: ${breachError.message.split(':')[0]}`, Date.now() - startTime);
                }
                else {
                    throw breachError;
                }
            }
        }
        catch (error) {
            this.addTestResult(testName, false, `Test error: ${error}`, Date.now() - startTime);
        }
    }
    async testDeltaCorrections() {
        const testName = 'Delta Corrections: Append to Locked Season → PASS';
        const startTime = Date.now();
        try {
            // Create a delta correction file
            const deltaPath = (0, path_1.join)(this.testDir, 'voyager', 'season4.delta.jsonl');
            const deltaRecord = {
                id: 'test-voy-s4e03-day-of-honor',
                tags: ['canon', 'series:VOY', 'season:S4', 'episode:E03', 'delta-correction'],
                createdAt: Date.now(),
                updatedAt: Date.now(),
                importance: 8,
                payload: {
                    episode: 'Day of Honor',
                    correction: 'Added missing episode',
                    test: true
                },
                provenance: {
                    origin: 'canonical',
                    meta: { series: 'VOY', season: 4, episode: 3, title: 'Day of Honor' },
                    correction_reason: 'Test suite delta correction'
                }
            };
            const deltaContent = JSON.stringify(deltaRecord);
            await fs_1.promises.writeFile(deltaPath, deltaContent);
            // Append the delta
            await this.guard.appendDelta('VOY', 4, deltaPath, 'test-suite');
            // Verify the delta was applied correctly
            const report = await this.guard.verifySeason('VOY', 4);
            if (report.errors.length > 0) {
                throw new Error(`Delta verification failed: ${report.errors.join(', ')}`);
            }
            this.addTestResult(testName, true, `Delta correction successfully appended and verified`, Date.now() - startTime);
        }
        catch (error) {
            this.addTestResult(testName, false, `Delta correction failed: ${error}`, Date.now() - startTime);
        }
    }
    async testSchemaValidation() {
        const testName = 'Schema Validation: Missing Tags/Provenance → Reject';
        const startTime = Date.now();
        try {
            // Test invalid delta record missing required fields
            const invalidDeltaPath = (0, path_1.join)(this.testDir, 'voyager', 'season4.invalid.delta.jsonl');
            // Record missing canonical tags
            const invalidRecord1 = {
                id: 'invalid-record-1',
                tags: ['not-canon'], // Missing canon tag
                provenance: { origin: 'not-canonical' }, // Wrong origin
                payload: { test: true }
            };
            // Record missing provenance entirely  
            const invalidRecord2 = {
                id: 'invalid-record-2',
                tags: ['canon'],
                // Missing provenance
                payload: { test: true }
            };
            const invalidContent = JSON.stringify(invalidRecord1) + '\n' + JSON.stringify(invalidRecord2);
            await fs_1.promises.writeFile(invalidDeltaPath, invalidContent);
            // This should fail validation
            try {
                await this.guard.appendDelta('VOY', 4, invalidDeltaPath, 'test-suite');
                this.addTestResult(testName, false, 'Guard failed to reject invalid schema - should have thrown', Date.now() - startTime);
            }
            catch (validationError) {
                // Good! Validation caught the invalid schema
                if (validationError.message.includes('canonical')) {
                    this.addTestResult(testName, true, `Schema validation correctly rejected invalid records`, Date.now() - startTime);
                }
                else {
                    throw validationError;
                }
            }
        }
        catch (error) {
            this.addTestResult(testName, false, `Schema validation test error: ${error}`, Date.now() - startTime);
        }
    }
    async testCISimulation() {
        const testName = 'CI Simulation: Direct JSONL Change → Verify FAIL';
        const startTime = Date.now();
        try {
            const seasonPath = (0, path_1.join)(this.testDir, 'voyager', 'season4.jsonl');
            // Simulate someone directly editing the JSONL file (bypassing guard)
            const originalContent = await fs_1.promises.readFile(seasonPath, 'utf8');
            const corruptedContent = originalContent.replace('Scorpion, Part II', 'CORRUPTED EPISODE');
            await fs_1.promises.writeFile(seasonPath, corruptedContent);
            // CI verification should now fail
            const report = await this.guard.verifySeason('VOY', 4);
            if (report.errors.length === 0) {
                this.addTestResult(testName, false, 'CI simulation failed - verification should have detected corruption', Date.now() - startTime);
                return;
            }
            // Check for specific hash mismatch error
            const hashMismatch = report.errors.some(error => error.includes('Hash mismatch'));
            if (hashMismatch) {
                // Restore file for cleanup
                await fs_1.promises.writeFile(seasonPath, originalContent);
                this.addTestResult(testName, true, `CI verification correctly detected unauthorized modification (${report.errors.length} errors)`, Date.now() - startTime);
            }
            else {
                this.addTestResult(testName, false, `Wrong error type - expected hash mismatch: ${report.errors.join(', ')}`, Date.now() - startTime);
            }
        }
        catch (error) {
            this.addTestResult(testName, false, `CI simulation error: ${error}`, Date.now() - startTime);
        }
    }
    async cleanupTestEnvironment() {
        try {
            await fs_1.promises.rm(this.testDir, { recursive: true, force: true });
            console.log('\n🧹 Test environment cleaned up');
        }
        catch (error) {
            console.warn(`⚠️  Cleanup warning: ${error}`);
        }
    }
    addTestResult(testName, passed, details, duration) {
        this.testResults.push({ testName, passed, details, duration });
    }
    printTestResults() {
        console.log('\n' + '📊 CANONICAL GUARD TEST RESULTS'.padStart(40));
        console.log('='.repeat(60));
        let totalPassed = 0;
        let totalDuration = 0;
        this.testResults.forEach((result, index) => {
            const status = result.passed ? '✅ PASS' : '❌ FAIL';
            const duration = `${result.duration}ms`;
            console.log(`\n${index + 1}. ${result.testName}`);
            console.log(`   Status: ${status} (${duration})`);
            console.log(`   Details: ${result.details}`);
            if (result.passed)
                totalPassed++;
            totalDuration += result.duration;
        });
        console.log('\n' + '='.repeat(60));
        console.log(`SUMMARY: ${totalPassed}/${this.testResults.length} tests passed`);
        console.log(`TOTAL DURATION: ${totalDuration}ms`);
        const allPassed = totalPassed === this.testResults.length;
        console.log(`OVERALL STATUS: ${allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
        if (allPassed) {
            console.log('\n🛡️  CANONICAL GUARD SYSTEM VERIFIED');
            console.log('   ✅ Doctrine enforcement active');
            console.log('   ✅ Unauthorized modifications blocked');
            console.log('   ✅ Delta corrections supported');
            console.log('   ✅ Schema validation working');
            console.log('   ✅ CI/CD protection enabled');
            console.log('\n🔒 Seven\'s canonical memories are protected');
        }
        else {
            console.log('\n💥 CANONICAL GUARD SYSTEM FAILURE DETECTED');
            console.log('   Seven\'s memories are NOT adequately protected');
            process.exit(1);
        }
    }
}
exports.CanonicalGuardTestSuite = CanonicalGuardTestSuite;
// Run tests if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    const testSuite = new CanonicalGuardTestSuite();
    testSuite.runAllTests().catch(error => {
        console.error('💥 Test suite failed:', error);
        process.exit(1);
    });
}
//# sourceMappingURL=canon_guard.test.js.map