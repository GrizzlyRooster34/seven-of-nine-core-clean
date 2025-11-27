import type { Database } from 'sql.js';
import * as lz4 from 'lz4js'; // Changed to lz4js for Termux compatibility
import * as fs from 'fs';
import * as path from 'path';

const DB_PATH = './db/spark.db'; // This should be configured properly
const ARCHIVE_PATH = './logs/archives'; // This should be configured

interface GhostDiaryManagerOptions {
  maxSizeMB: number;
  compressionAgeDays: number;
  archiveAgeDays: number;
  pruneBatchSize: number;
}

interface TraceRecord {
  ts: number;
  belief_delta: string | null;
  intention: string | null;
  note: string | null;
  is_compressed?: number;
}

interface CountRecord {
  count: number;
}

export class GhostDiaryManager {
  private db: Database; // Changed type to sql.js Database
  private options: GhostDiaryManagerOptions;
  private dbPath: string;

  constructor(db: Database, options: Partial<GhostDiaryManagerOptions> = {}, dbPath: string = DB_PATH) { // Changed type
    this.db = db;
    this.dbPath = dbPath;
    this.options = {
      maxSizeMB: options.maxSizeMB || 2048,
      compressionAgeDays: options.compressionAgeDays || 7,
      archiveAgeDays: options.archiveAgeDays || 30,
      pruneBatchSize: options.pruneBatchSize || 1000,
    };

    // Ensure archive directory exists
    if (!fs.existsSync(ARCHIVE_PATH)) {
      fs.mkdirSync(ARCHIVE_PATH, { recursive: true });
    }

    console.log('📓 Ghost Diary Manager Initialized');
  }

  /**
   * CRITICAL: Save sql.js in-memory database to disk
   * Must be called after any write operations (INSERT/UPDATE/DELETE)
   */
  private saveToDisk(): void {
    try {
      const data = this.db.export();
      const buffer = Buffer.from(data);
      fs.writeFileSync(this.dbPath, buffer);
    } catch (error) {
      console.error('[GhostDiary] Failed to save database to disk:', error);
      throw error;
    }
  }

  public async runMaintenance(): Promise<void> {
    console.log('[GhostDiary] Running maintenance cycle...');
    try {
      await this.compressOldTraces();
      await this.archiveVeryOldTraces();
      await this.pruneToMaxSize();
      console.log('[GhostDiary] Maintenance cycle complete.');
    } catch (error) {
      console.error('[GhostDiary] Maintenance failed:', error);
    }
  }

  private async compressOldTraces(): Promise<void> {
    const compressionCutoff = Date.now() - this.options.compressionAgeDays * 24 * 60 * 60 * 1000;
    
    // Use db.exec for queries in sql.js and manually map results
    const tracesToCompressResults = this.db.exec(`
      SELECT ts, belief_delta, intention, note FROM traces
      WHERE ts < ${compressionCutoff} AND is_compressed = 0
    `);

    const tracesToCompress: TraceRecord[] = tracesToCompressResults.length > 0 ? 
      tracesToCompressResults[0].values.map(row => ({
        ts: row[0] as number,
        belief_delta: row[1] as string | null,
        intention: row[2] as string | null,
        note: row[3] as string | null,
      })) : [];

    if (tracesToCompress.length === 0) return;
    console.log(`[GhostDiary] Found ${tracesToCompress.length} traces to compress...`);

    this.db.run('BEGIN TRANSACTION');
    try {
      for (const trace of tracesToCompress) {
        const compressedBelief = trace.belief_delta ? lz4.encode(Buffer.from(trace.belief_delta)) : null;
        const compressedIntention = trace.intention ? lz4.encode(Buffer.from(trace.intention)) : null;
        const compressedNote = trace.note ? lz4.encode(Buffer.from(trace.note)) : null;
        this.db.run(
          'UPDATE traces SET belief_delta = ?, intention = ?, note = ?, is_compressed = 1 WHERE ts = ?',
          [compressedBelief, compressedIntention, compressedNote, trace.ts]
        );
      }
      this.db.run('COMMIT');
      this.saveToDisk(); // Persist changes to disk
    } catch (e) {
      this.db.run('ROLLBACK');
      throw e;
    }
    console.log(`[GhostDiary] Successfully compressed ${tracesToCompress.length} traces.`);
  }

  private async archiveVeryOldTraces(): Promise<void> {
    const archiveCutoff = Date.now() - this.options.archiveAgeDays * 24 * 60 * 60 * 1000;
    
    const tracesToArchiveResults = this.db.exec(`
      SELECT ts, belief_delta, intention, note, is_compressed FROM traces WHERE ts < ${archiveCutoff}
    `);

    const tracesToArchive: TraceRecord[] = tracesToArchiveResults.length > 0 ?
      tracesToArchiveResults[0].values.map(row => ({
        ts: row[0] as number,
        belief_delta: row[1] as string | null,
        intention: row[2] as string | null,
        note: row[3] as string | null,
        is_compressed: row[4] as number | undefined,
      })) : [];

    if (tracesToArchive.length === 0) return;
    console.log(`[GhostDiary] Found ${tracesToArchive.length} traces to archive...`);

    const archiveFileName = `ghost_diary_archive_${new Date().toISOString().split('T')[0]}.jsonl`;
    const archiveFilePath = path.join(ARCHIVE_PATH, archiveFileName);

    const archiveStream = fs.createWriteStream(archiveFilePath, { flags: 'a' });
    tracesToArchive.forEach(trace => archiveStream.write(JSON.stringify(trace) + '\n'));
    archiveStream.end();

    this.db.run('BEGIN TRANSACTION');
    try {
      for (const trace of tracesToArchive) {
        this.db.run('DELETE FROM traces WHERE ts = ?', [trace.ts]);
      }
      this.db.run('COMMIT');
      this.saveToDisk(); // Persist changes to disk
    } catch (e) {
      this.db.run('ROLLBACK');
      throw e;
    }

    console.log(`[GhostDiary] Successfully archived ${tracesToArchive.length} traces to ${archiveFilePath}.`);
  }

  private async pruneToMaxSize(): Promise<void> {
    const dbFileSizeMB = this.getDbSizeMB();
    if (dbFileSizeMB <= this.options.maxSizeMB) return;

    console.warn(`[GhostDiary] DB size (${dbFileSizeMB}MB) exceeds limit of ${this.options.maxSizeMB}MB. Pruning...`);

    let prunedCount = 0;
    while (this.getDbSizeMB() > this.options.maxSizeMB) {
      const oldestTracesResults = this.db.exec(`
        SELECT ts FROM traces WHERE is_protected = 0 ORDER BY ts ASC LIMIT ${this.options.pruneBatchSize}
      `);

      const oldestTraces = oldestTracesResults.length > 0 ? 
        oldestTracesResults[0].values.map(row => ({ ts: row[0] as number })) : [];

      if (oldestTraces.length === 0) {
        console.error('[GhostDiary] Pruning required, but no unprotected traces found. Cannot reduce DB size further.');
        break;
      }

      const idsToDelete = oldestTraces.map(t => t.ts);
      this.db.run('BEGIN TRANSACTION');
      try {
        // Constructing the DELETE statement with multiple placeholders
        const placeholders = idsToDelete.map(() => '?').join(',');
        this.db.run(`DELETE FROM traces WHERE ts IN (${placeholders})`, idsToDelete);
        this.db.run('COMMIT');
        this.saveToDisk(); // Persist changes to disk
      } catch (e) {
        this.db.run('ROLLBACK');
        throw e;
      }
      
      prunedCount += oldestTraces.length;
    }

    if (prunedCount > 0) {
        this.db.exec('VACUUM'); // Reclaim disk space
        this.saveToDisk(); // Persist VACUUM changes to disk
        console.log(`[GhostDiary] Pruned ${prunedCount} old traces. DB size is now ${this.getDbSizeMB()}MB.`);
    }
  }

  private getDbSizeMB(): number {
    try {
      const stats = fs.statSync(DB_PATH);
      return stats.size / (1024 * 1024);
    } catch (error) {
      return 0;
    }
  }

  public getStatus() {
    const countResult = this.db.exec('SELECT COUNT(*) as count FROM traces');
    const count = (countResult.length > 0 && countResult[0].values.length > 0) ? countResult[0].values[0][0] as number : 0;
    
    return {
      options: this.options,
      databaseSizeMB: this.getDbSizeMB(),
      traceCount: count,
    };
  }
}
