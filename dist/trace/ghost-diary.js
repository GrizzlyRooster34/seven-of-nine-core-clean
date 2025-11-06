import * as fs from 'fs';
import * as path from 'path';
import * as lz4 from 'lz4js';
export class GhostDiary {
    logFilePath;
    privateKey; // For signing
    publicKey; // For verification
    policy;
    constructor(logDir, policyPath, privateKey, publicKey) {
        this.logFilePath = path.join(logDir, `ghost-diary-${new Date().toISOString().split('T')[0]}.jsonl`);
        this.privateKey = privateKey;
        this.publicKey = publicKey;
        this.policy = this.loadPolicy(policyPath);
    }
    loadPolicy(policyPath) {
        const policyFile = fs.readFileSync(policyPath, 'utf8');
        // Simple YAML parsing without external dependency
        const lines = policyFile.split('\n').filter(l => l.trim() && !l.trim().startsWith('#'));
        const policy = {};
        lines.forEach(line => {
            const [key, ...valueParts] = line.split(':');
            if (key && valueParts.length > 0) {
                const value = valueParts.join(':').trim().replace(/['"]/g, '');
                policy[key.trim()] = isNaN(Number(value)) ? value : Number(value);
            }
        });
        return policy;
    }
    hasLegalHold(filePath) {
        const lines = fs.readFileSync(filePath, 'utf-8').split('\n').filter(Boolean);
        for (const line of lines) {
            const trace = JSON.parse(line);
            if (trace.legalHold) {
                return true;
            }
        }
        return false;
    }
    /**
     * @param event The trace event to append.
     */
    appendTrace(event) {
        const trace = {
            ...event,
            id: Date.now(), // Simple sequential ID for now
            ts: new Date().toISOString(),
        };
        const dataToSign = JSON.stringify(trace);
        // In a real implementation, the key would be loaded securely
        // const signature = sign('sha256', Buffer.from(dataToSign), this.privateKey).toString('base64');
        // trace.signature = signature;
        fs.appendFileSync(this.logFilePath, JSON.stringify(trace) + '\n');
    }
    /**
     * Queries the log files based on a filter.
     * @param filter The filter to apply to the query.
     * @returns A list of traces that match the filter.
     */
    queryTrace(filter) {
        // This is a simplified implementation. A real implementation would
        // need to handle multiple files, decompression, and more efficient querying.
        const lines = fs.readFileSync(this.logFilePath, 'utf-8').split('\n').filter(Boolean);
        const traces = lines.map(line => JSON.parse(line));
        return traces.filter(filter);
    }
    /**
     * Applies the retention policy to the log files.
     */
    applyRetentionPolicy() {
        const logFiles = fs.readdirSync(path.dirname(this.logFilePath));
        for (const logFile of logFiles) {
            const filePath = path.join(path.dirname(this.logFilePath), logFile);
            const stats = fs.statSync(filePath);
            const ageInDays = (new Date().getTime() - stats.mtime.getTime()) / (1000 * 60 * 60 * 24);
            if (ageInDays > this.policy.hot_storage_days && !logFile.endsWith('.lz4')) {
                this.compressTraceFile(filePath);
            }
            else if (ageInDays > this.policy.warm_storage_days && logFile.endsWith('.lz4')) {
                this.archiveTraceFile(filePath);
            }
        }
    }
    /**
     * Compresses a trace file.
     * @param filePath The path to the file to compress.
     */
    compressTraceFile(filePath) {
        if (this.hasLegalHold(filePath)) {
            console.log(`Skipping compression for ${filePath} due to legal hold.`);
            return;
        }
        if (filePath.endsWith('.lz4')) {
            return; // Already compressed
        }
        const content = fs.readFileSync(filePath);
        const compressed = lz4.compress(content);
        const compressedFilePath = `${filePath}.lz4`;
        fs.writeFileSync(compressedFilePath, compressed);
        // Verify integrity before deleting
        const decompressed = lz4.decompress(fs.readFileSync(compressedFilePath));
        if (Buffer.compare(content, Buffer.from(decompressed)) === 0) {
            fs.unlinkSync(filePath);
            console.log(`Compressed and verified ${filePath}`);
        }
        else {
            console.error(`Compression verification failed for ${filePath}`);
        }
    }
    /**
     * Archives a trace file.
     * @param filePath The path to the file to archive.
     */
    archiveTraceFile(filePath) {
        const archiveDir = this.policy.cold_storage_path;
        if (!fs.existsSync(archiveDir)) {
            fs.mkdirSync(archiveDir, { recursive: true });
        }
        const fileName = path.basename(filePath);
        const newFilePath = path.join(archiveDir, fileName);
        fs.renameSync(filePath, newFilePath);
        console.log(`Archived ${filePath} to ${newFilePath}`);
    }
}
//# sourceMappingURL=ghost-diary.js.map