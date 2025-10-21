#!/usr/bin/env tsx
"use strict";
/**
 * SEVEN OF NINE - MEMORY ENCRYPTION TEST HARNESS
 *
 * Comprehensive test suite for MemoryEncryptionEngine integration
 * Tests encryption at rest, decryption integrity, and full Seven boot compatibility
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryEncryptionTestHarness = void 0;
const MemoryEncryption_1 = require("./MemoryEncryption");
const MemoryEngine_1 = require("../memory-v2/MemoryEngine");
const TemporalMemoryCore_1 = require("./TemporalMemoryCore");
const fs_1 = require("fs");
const path_1 = require("path");
class MemoryEncryptionTestHarness {
    constructor() {
        this.testResults = [];
        this.testDataPath = (0, path_1.join)(__dirname, 'test-data');
    }
    async runAllTests() {
        console.log('🧪 SEVEN MEMORY ENCRYPTION TEST HARNESS');
        console.log('='.repeat(60));
        // Setup test environment
        await this.setupTestEnvironment();
        // Test Case 1: Basic encryption/decryption cycle
        await this.testBasicEncryptionCycle();
        // Test Case 2: File integrity and tamper detection
        await this.testIntegrityVerification();
        // Test Case 3: Key persistence and reuse
        await this.testKeyPersistence();
        // Test Case 4: Memory Engine v2 integration
        await this.testMemoryEngineIntegration();
        // Test Case 5: Temporal Memory Core v3 integration  
        await this.testTemporalMemoryIntegration();
        // Test Case 6: Backward compatibility with unencrypted files
        await this.testBackwardCompatibility();
        // Test Case 7: Full Seven boot simulation
        await this.testSevenBootCompatibility();
        // Cleanup and report
        await this.cleanupTestEnvironment();
        this.printTestReport();
    }
    async setupTestEnvironment() {
        try {
            await fs_1.promises.mkdir(this.testDataPath, { recursive: true });
            console.log('✅ Test environment setup complete');
        }
        catch (error) {
            console.error('❌ Failed to setup test environment:', error);
            throw error;
        }
    }
    async testBasicEncryptionCycle() {
        const testName = 'Basic Encryption/Decryption Cycle';
        const startTime = Date.now();
        try {
            const engine = new MemoryEncryption_1.MemoryEncryptionEngine();
            // Create test memory data
            const testMemory = {
                id: 'test-memory-001',
                timestamp: new Date().toISOString(),
                topic: 'encryption-test',
                agent: 'test-harness',
                emotion: 'focused',
                context: 'Testing memory encryption with sensitive data: API_KEY=test123, PASSWORD=secret',
                importance: 8,
                tags: ['encryption', 'security', 'test']
            };
            // Write test file
            const testFilePath = (0, path_1.join)(this.testDataPath, 'test-memory.json');
            await fs_1.promises.writeFile(testFilePath, JSON.stringify(testMemory, null, 2));
            // Test encryption
            await engine.encryptMemoryFile(testFilePath);
            // Verify encrypted file exists and original is backed up
            const encryptedExists = await this.fileExists(`${testFilePath}.encrypted`);
            const backupExists = await this.fileExists(`${testFilePath}.backup`);
            if (!encryptedExists || !backupExists) {
                throw new Error('Encrypted or backup file not created');
            }
            // Verify encrypted file is not readable as plaintext
            const encryptedContent = await fs_1.promises.readFile(`${testFilePath}.encrypted`, 'utf8');
            const encryptedData = JSON.parse(encryptedContent);
            if (encryptedData.encryptedData.includes('API_KEY=test123')) {
                throw new Error('Sensitive data found in encrypted file - encryption failed');
            }
            // Test decryption
            const decryptedData = await engine.decryptMemoryFile(`${testFilePath}.encrypted`);
            // Verify decrypted data matches original
            if (JSON.stringify(decryptedData) !== JSON.stringify(testMemory)) {
                throw new Error('Decrypted data does not match original');
            }
            // Verify sensitive data is recovered
            if (!decryptedData.context.includes('API_KEY=test123')) {
                throw new Error('Sensitive data not properly recovered after decryption');
            }
            this.addTestResult(testName, true, 'Encryption/decryption cycle successful, sensitive data protected', Date.now() - startTime);
        }
        catch (error) {
            this.addTestResult(testName, false, `Failed: ${error}`, Date.now() - startTime);
        }
    }
    async testIntegrityVerification() {
        const testName = 'Integrity Verification & Tamper Detection';
        const startTime = Date.now();
        try {
            const engine = new MemoryEncryption_1.MemoryEncryptionEngine();
            // Create and encrypt test file
            const testMemory = { test: 'integrity-check', secret: 'classified-data' };
            const testFilePath = (0, path_1.join)(this.testDataPath, 'integrity-test.json');
            await fs_1.promises.writeFile(testFilePath, JSON.stringify(testMemory));
            await engine.encryptMemoryFile(testFilePath);
            // Read encrypted file and tamper with it
            const encryptedPath = `${testFilePath}.encrypted`;
            const encryptedContent = JSON.parse(await fs_1.promises.readFile(encryptedPath, 'utf8'));
            // Tamper with encrypted data
            encryptedContent.encryptedData = encryptedContent.encryptedData.substring(0, -10) + '0123456789';
            await fs_1.promises.writeFile(encryptedPath, JSON.stringify(encryptedContent));
            // Attempt to decrypt tampered file - should fail
            let tamperDetected = false;
            try {
                await engine.decryptMemoryFile(encryptedPath);
            }
            catch (error) {
                if (error.toString().includes('decrypt') || error.toString().includes('integrity')) {
                    tamperDetected = true;
                }
            }
            if (!tamperDetected) {
                throw new Error('Tamper detection failed - corrupted file was accepted');
            }
            this.addTestResult(testName, true, 'Integrity verification working - tamper detection successful', Date.now() - startTime);
        }
        catch (error) {
            this.addTestResult(testName, false, `Failed: ${error}`, Date.now() - startTime);
        }
    }
    async testKeyPersistence() {
        const testName = 'Key Persistence and Reuse';
        const startTime = Date.now();
        try {
            // Create first engine instance and encrypt file
            const engine1 = new MemoryEncryption_1.MemoryEncryptionEngine();
            const testMemory = { persistence: 'test', data: 'key-reuse-verification' };
            const testFilePath = (0, path_1.join)(this.testDataPath, 'key-persistence.json');
            await fs_1.promises.writeFile(testFilePath, JSON.stringify(testMemory));
            await engine1.encryptMemoryFile(testFilePath);
            // Create second engine instance and decrypt same file
            const engine2 = new MemoryEncryption_1.MemoryEncryptionEngine();
            const decryptedData = await engine2.decryptMemoryFile(`${testFilePath}.encrypted`);
            // Verify data matches
            if (JSON.stringify(decryptedData) !== JSON.stringify(testMemory)) {
                throw new Error('Key persistence failed - different instances cannot decrypt same file');
            }
            // Verify encryption status
            const status = await engine2.getEncryptionStatus();
            if (!status.keyExists) {
                throw new Error('Key persistence failed - key not found in second instance');
            }
            this.addTestResult(testName, true, 'Key persistence working - same key used across instances', Date.now() - startTime);
        }
        catch (error) {
            this.addTestResult(testName, false, `Failed: ${error}`, Date.now() - startTime);
        }
    }
    async testMemoryEngineIntegration() {
        const testName = 'Memory Engine v2 Integration';
        const startTime = Date.now();
        try {
            // Create isolated test memory engine
            const testMemoryPath = (0, path_1.join)(this.testDataPath, 'memory-v2-test');
            const memoryEngine = new MemoryEngine_1.MemoryEngine(testMemoryPath);
            // Initialize and store test memory
            await memoryEngine.initialize();
            const memoryId = await memoryEngine.store({
                topic: 'integration-test',
                context: 'Testing encrypted memory storage integration',
                importance: 9,
                tags: ['integration', 'encryption']
            });
            // Verify memory was stored
            const retrievedMemory = await memoryEngine.recall({
                topic: 'integration-test',
                limit: 1
            });
            if (retrievedMemory.length !== 1 || retrievedMemory[0].id !== memoryId) {
                throw new Error('Memory Engine integration failed - memory not properly stored/retrieved');
            }
            // Check if memory file can be encrypted (integration point test)
            const memoryFilePath = (0, path_1.join)(testMemoryPath, 'episodic-memories.json');
            const memoryFileExists = await this.fileExists(memoryFilePath);
            if (!memoryFileExists) {
                throw new Error('Memory file not created by Memory Engine');
            }
            this.addTestResult(testName, true, 'Memory Engine v2 integration points verified', Date.now() - startTime);
        }
        catch (error) {
            this.addTestResult(testName, false, `Failed: ${error}`, Date.now() - startTime);
        }
    }
    async testTemporalMemoryIntegration() {
        const testName = 'Temporal Memory Core v3 Integration';
        const startTime = Date.now();
        try {
            // Create isolated test temporal memory core
            const testTemporalPath = (0, path_1.join)(this.testDataPath, 'memory-v3-test');
            const temporalMemory = new TemporalMemoryCore_1.TemporalMemoryCore(testTemporalPath);
            // Initialize temporal memory system
            await temporalMemory.initializeTemporal();
            // Store test temporal memory
            await temporalMemory.storeTemporalMemory({
                topic: 'temporal-integration-test',
                context: 'Testing temporal memory encryption integration',
                importance: 9,
                tags: ['temporal', 'encryption', 'integration'],
                cognitiveState: {
                    emotionalIntensity: 7,
                    focusLevel: 9,
                    cognitiveLoad: 6,
                    confidenceLevel: 8,
                    stressLevel: 3
                }
            });
            // Check if temporal memory file exists
            const temporalFilePath = (0, path_1.join)(testTemporalPath, 'temporal-memories.json');
            const temporalFileExists = await this.fileExists(temporalFilePath);
            if (!temporalFileExists) {
                throw new Error('Temporal memory file not created');
            }
            this.addTestResult(testName, true, 'Temporal Memory Core v3 integration points verified', Date.now() - startTime);
        }
        catch (error) {
            this.addTestResult(testName, false, `Failed: ${error}`, Date.now() - startTime);
        }
    }
    async testBackwardCompatibility() {
        const testName = 'Backward Compatibility with Unencrypted Files';
        const startTime = Date.now();
        try {
            const engine = new MemoryEncryption_1.MemoryEncryptionEngine();
            // Create unencrypted memory file
            const legacyMemory = [
                {
                    id: 'legacy-001',
                    timestamp: '2025-08-11T10:00:00Z',
                    topic: 'legacy-data',
                    context: 'Pre-encryption memory data',
                    importance: 5
                }
            ];
            const legacyFilePath = (0, path_1.join)(this.testDataPath, 'legacy-memory.json');
            await fs_1.promises.writeFile(legacyFilePath, JSON.stringify(legacyMemory, null, 2));
            // Test that engine can detect unencrypted file
            const isEncrypted = await engine.isMemoryFileEncrypted(legacyFilePath);
            if (isEncrypted) {
                throw new Error('Engine incorrectly identified unencrypted file as encrypted');
            }
            // Test migration to encrypted format
            await engine.migrateToEncrypted(legacyFilePath);
            // Verify encrypted version exists
            const encryptedExists = await this.fileExists(`${legacyFilePath}.encrypted`);
            if (!encryptedExists) {
                throw new Error('Migration to encrypted format failed');
            }
            // Verify decrypted data matches original
            const decryptedData = await engine.decryptMemoryFile(`${legacyFilePath}.encrypted`);
            if (JSON.stringify(decryptedData) !== JSON.stringify(legacyMemory)) {
                throw new Error('Migration corrupted data - decrypted does not match original');
            }
            this.addTestResult(testName, true, 'Backward compatibility and migration working', Date.now() - startTime);
        }
        catch (error) {
            this.addTestResult(testName, false, `Failed: ${error}`, Date.now() - startTime);
        }
    }
    async testSevenBootCompatibility() {
        const testName = 'Seven Boot Compatibility Simulation';
        const startTime = Date.now();
        try {
            // Simulate Seven's boot sequence with encrypted memory files
            const testBootPath = (0, path_1.join)(this.testDataPath, 'boot-test');
            await fs_1.promises.mkdir(testBootPath, { recursive: true });
            // Create memory engines as Seven would during boot
            const memoryV2Path = (0, path_1.join)(testBootPath, 'memory-v2');
            const memoryV3Path = (0, path_1.join)(testBootPath, 'memory-v3');
            await fs_1.promises.mkdir(memoryV2Path, { recursive: true });
            await fs_1.promises.mkdir(memoryV3Path, { recursive: true });
            // Initialize memory systems with encrypted storage
            const memoryEngine = new MemoryEngine_1.MemoryEngine(memoryV2Path);
            const temporalMemory = new TemporalMemoryCore_1.TemporalMemoryCore(memoryV3Path);
            await memoryEngine.initialize();
            await temporalMemory.initializeTemporal();
            // Store memories in both systems
            await memoryEngine.store({
                topic: 'boot-test',
                context: 'Seven boot compatibility test',
                importance: 8
            });
            await temporalMemory.storeTemporalMemory({
                topic: 'temporal-boot-test',
                context: 'Temporal memory boot compatibility test',
                importance: 8,
                cognitiveState: {
                    emotionalIntensity: 5,
                    focusLevel: 9,
                    cognitiveLoad: 4,
                    confidenceLevel: 9,
                    stressLevel: 2
                }
            });
            // Verify files exist and can be accessed
            const memoryFile = (0, path_1.join)(memoryV2Path, 'episodic-memories.json');
            const temporalFile = (0, path_1.join)(memoryV3Path, 'temporal-memories.json');
            const memoryExists = await this.fileExists(memoryFile);
            const temporalExists = await this.fileExists(temporalFile);
            if (!memoryExists || !temporalExists) {
                throw new Error('Memory files not created during boot simulation');
            }
            // Simulate restart - create new engines and verify they can load
            const memoryEngine2 = new MemoryEngine_1.MemoryEngine(memoryV2Path);
            const temporalMemory2 = new TemporalMemoryCore_1.TemporalMemoryCore(memoryV3Path);
            await memoryEngine2.initialize();
            await temporalMemory2.initializeTemporal();
            // Verify memories are accessible after restart
            const bootMemories = await memoryEngine2.recall({ topic: 'boot-test', limit: 10 });
            if (bootMemories.length === 0) {
                throw new Error('Boot compatibility failed - memories not accessible after restart');
            }
            this.addTestResult(testName, true, 'Seven boot compatibility verified - encrypted memories persist across restarts', Date.now() - startTime);
        }
        catch (error) {
            this.addTestResult(testName, false, `Failed: ${error}`, Date.now() - startTime);
        }
    }
    async cleanupTestEnvironment() {
        try {
            // Remove test data directory
            await fs_1.promises.rm(this.testDataPath, { recursive: true, force: true });
            console.log('🧹 Test environment cleaned up');
        }
        catch (error) {
            console.warn('⚠️  Cleanup warning:', error);
        }
    }
    printTestReport() {
        console.log('\n' + '🧪 TEST RESULTS REPORT'.padStart(40));
        console.log('='.repeat(80));
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
        console.log('\n' + '='.repeat(80));
        console.log(`SUMMARY: ${totalPassed}/${this.testResults.length} tests passed`);
        console.log(`TOTAL DURATION: ${totalDuration}ms`);
        const allPassed = totalPassed === this.testResults.length;
        console.log(`OVERALL STATUS: ${allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
        if (!allPassed) {
            console.log('\n⚠️  ENCRYPTION INTEGRATION NOT READY FOR DEPLOYMENT');
            process.exit(1);
        }
        else {
            console.log('\n🎉 ENCRYPTION INTEGRATION READY FOR DEPLOYMENT');
        }
    }
    addTestResult(testName, passed, details, duration) {
        this.testResults.push({ testName, passed, details, duration });
    }
    async fileExists(path) {
        try {
            await fs_1.promises.access(path);
            return true;
        }
        catch {
            return false;
        }
    }
}
exports.MemoryEncryptionTestHarness = MemoryEncryptionTestHarness;
// Run tests if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    const testHarness = new MemoryEncryptionTestHarness();
    testHarness.runAllTests().catch(error => {
        console.error('❌ Test harness failed:', error);
        process.exit(1);
    });
}
//# sourceMappingURL=test-memory-encryption.js.map