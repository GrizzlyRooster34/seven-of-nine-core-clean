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
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const ghost_diary_1 = require("./ghost-diary");
const testLogDir = './test-logs';
const testPolicyPath = './test-policy.yaml';
describe('GhostDiary', () => {
    beforeEach(() => {
        // Create a clean test directory and policy file for each test
        if (fs.existsSync(testLogDir)) {
            fs.rmSync(testLogDir, { recursive: true, force: true });
        }
        fs.mkdirSync(testLogDir, { recursive: true });
        const policyContent = `
      hot_storage_days: 1
      warm_storage_days: 2
      cold_storage_path: "${testLogDir}/archive/"
      compression_algorithm: "lz4"
    `;
        fs.writeFileSync(testPolicyPath, policyContent);
    });
    afterEach(() => {
        // Clean up the test directory and policy file after each test
        if (fs.existsSync(testLogDir)) {
            fs.rmSync(testLogDir, { recursive: true, force: true });
        }
        if (fs.existsSync(testPolicyPath)) {
            fs.unlinkSync(testPolicyPath);
        }
    });
    it('should compress a log file older than the hot storage period', () => {
        const diary = new ghost_diary_1.GhostDiary(testLogDir, testPolicyPath, 'privateKey', 'publicKey');
        const logFilePath = path.join(testLogDir, 'ghost-diary-2023-10-20.jsonl');
        // Create a dummy log file with a past date
        fs.writeFileSync(logFilePath, '{"action":"test"}\n');
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
        fs.utimesSync(logFilePath, twoDaysAgo, twoDaysAgo);
        console.log('Running compression test...');
        console.log(`Log file path: ${logFilePath}`);
        console.log(`File exists before policy: ${fs.existsSync(logFilePath)}`);
        diary.applyRetentionPolicy();
        console.log(`Compressed file path: ${logFilePath}.lz4`);
        console.log(`Compressed file exists after policy: ${fs.existsSync(`${logFilePath}.lz4`)}`);
        console.log(`Original file exists after policy: ${fs.existsSync(logFilePath)}`);
        expect(fs.existsSync(`${logFilePath}.lz4`)).toBe(true);
        expect(fs.existsSync(logFilePath)).toBe(false);
    });
    it('should archive a log file older than the warm storage period', () => {
        const diary = new ghost_diary_1.GhostDiary(testLogDir, testPolicyPath, 'privateKey', 'publicKey');
        const logFilePath = path.join(testLogDir, 'ghost-diary-2023-10-18.jsonl.lz4');
        // Create a dummy compressed log file with a past date
        fs.writeFileSync(logFilePath, 'compressed data');
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
        fs.utimesSync(logFilePath, threeDaysAgo, threeDaysAgo);
        diary.applyRetentionPolicy();
        const archivedFilePath = path.join(testLogDir, 'archive', 'ghost-diary-2023-10-18.jsonl.lz4');
        expect(fs.existsSync(archivedFilePath)).toBe(true);
        expect(fs.existsSync(logFilePath)).toBe(false);
    });
    it('should not compress or archive a log file with a legal hold', () => {
        const diary = new ghost_diary_1.GhostDiary(testLogDir, testPolicyPath, 'privateKey', 'publicKey');
        const logFilePath = path.join(testLogDir, 'ghost-diary-2023-10-20.jsonl');
        // Create a dummy log file with a legal hold and a past date
        fs.writeFileSync(logFilePath, '{"action":"test", "legalHold":true}\n');
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
        fs.utimesSync(logFilePath, twoDaysAgo, twoDaysAgo);
        diary.applyRetentionPolicy();
        expect(fs.existsSync(logFilePath)).toBe(true);
        expect(fs.existsSync(`${logFilePath}.lz4`)).toBe(false);
    });
});
//# sourceMappingURL=ghost-diary.test.js.map