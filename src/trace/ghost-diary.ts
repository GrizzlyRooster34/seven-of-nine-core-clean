
import * as fs from 'fs';
import * as path from 'path';
import { sign, verify } from 'crypto';

import { load } from 'js-yaml';
import * as lz4 from 'lz4js';

// Define the structure of a Trace event based on the blueprint
interface Trace {
  id: number;
  ts: string;
  actor: 'SparkEngine' | 'SevenRuntime' | 'Creator';
  action: string;
  inputs: any;
  outputs: any;
  stateHash: string;
  legalHold?: boolean;
  signature?: string;
}

// Define the structure of the retention policy
interface RetentionPolicy {
  hot_storage_days: number;
  warm_storage_days: number;
  cold_storage_path: string;
  compression_algorithm: 'lz4';
}

export class GhostDiary {
  private logFilePath: string;
  private privateKey: string; // For signing
  private publicKey: string; // For verification
  private policy: RetentionPolicy;

  constructor(logDir: string, policyPath: string, privateKey: string, publicKey: string) {
    this.logFilePath = path.join(logDir, `ghost-diary-${new Date().toISOString().split('T')[0]}.jsonl`);
    this.privateKey = privateKey;
    this.publicKey = publicKey;
    this.policy = this.loadPolicy(policyPath);
  }

  private loadPolicy(policyPath: string): RetentionPolicy {
    const policyFile = fs.readFileSync(policyPath, 'utf8');
    return load(policyFile) as RetentionPolicy;
  }

  private hasLegalHold(filePath: string): boolean {
    const lines = fs.readFileSync(filePath, 'utf-8').split('\n').filter(Boolean);
    for (const line of lines) {
      const trace: Partial<Trace> = JSON.parse(line);
      if (trace.legalHold) {
        return true;
      }
    }
    return false;
  }

  /**
   * @param event The trace event to append.
   */
  public appendTrace(event: Omit<Trace, 'id' | 'ts' | 'signature'>): void {
    const trace: Trace = {
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
  public queryTrace(filter: (trace: Trace) => boolean): Trace[] {
    // This is a simplified implementation. A real implementation would
    // need to handle multiple files, decompression, and more efficient querying.
    const lines = fs.readFileSync(this.logFilePath, 'utf-8').split('\n').filter(Boolean);
    const traces: Trace[] = lines.map(line => JSON.parse(line));

    return traces.filter(filter);
  }

  /**
   * Applies the retention policy to the log files.
   */
  public applyRetentionPolicy(): void {
    const logFiles = fs.readdirSync(path.dirname(this.logFilePath));

    for (const logFile of logFiles) {
      const filePath = path.join(path.dirname(this.logFilePath), logFile);
      const stats = fs.statSync(filePath);
      const ageInDays = (new Date().getTime() - stats.mtime.getTime()) / (1000 * 60 * 60 * 24);

      if (ageInDays > this.policy.hot_storage_days && !logFile.endsWith('.lz4')) {
        this.compressTraceFile(filePath);
      } else if (ageInDays > this.policy.warm_storage_days && logFile.endsWith('.lz4')) {
        this.archiveTraceFile(filePath);
      }
    }
  }

  /**
   * Compresses a trace file.
   * @param filePath The path to the file to compress.
   */
  private compressTraceFile(filePath: string): void {
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
    } else {
      console.error(`Compression verification failed for ${filePath}`);
    }
  }

  /**
   * Archives a trace file.
   * @param filePath The path to the file to archive.
   */
  private archiveTraceFile(filePath: string): void {
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
