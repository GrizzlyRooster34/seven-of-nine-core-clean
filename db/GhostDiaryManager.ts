import { Database } from 'better-sqlite3';
import * as lz4 from 'lz4';
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

export class GhostDiaryManager {
  private db: Database;
  private options: GhostDiaryManagerOptions;

  constructor(db: Database, options: Partial<GhostDiaryManagerOptions> = {}) {
    this.db = db;
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
    const tracesToCompress = this.db.prepare(`
      SELECT ts, belief_delta, intention, note FROM traces
      WHERE ts < ? AND is_compressed = 0
    `).all(compressionCutoff);

    if (tracesToCompress.length === 0) return;
    console.log(`[GhostDiary] Found ${tracesToCompress.length} traces to compress...`);

    const updateStmt = this.db.prepare('UPDATE traces SET belief_delta = ?, intention = ?, note = ?, is_compressed = 1 WHERE ts = ?');

    this.db.transaction(() => {
      for (const trace of tracesToCompress) {
        const compressedBelief = trace.belief_delta ? lz4.encode(Buffer.from(trace.belief_delta)) : null;
        const compressedIntention = trace.intention ? lz4.encode(Buffer.from(trace.intention)) : null;
        const compressedNote = trace.note ? lz4.encode(Buffer.from(trace.note)) : null;
        updateStmt.run(compressedBelief, compressedIntention, compressedNote, trace.ts);
      }
    })();
    console.log(`[GhostDiary] Successfully compressed ${tracesToCompress.length} traces.`);
  }

  private async archiveVeryOldTraces(): Promise<void> {
    const archiveCutoff = Date.now() - this.options.archiveAgeDays * 24 * 60 * 60 * 1000;
    const tracesToArchive = this.db.prepare(`
      SELECT * FROM traces WHERE ts < ?
    `).all(archiveCutoff);

    if (tracesToArchive.length === 0) return;
    console.log(`[GhostDiary] Found ${tracesToArchive.length} traces to archive...`);

    const archiveFileName = `ghost_diary_archive_${new Date().toISOString().split('T')[0]}.jsonl`;
    const archiveFilePath = path.join(ARCHIVE_PATH, archiveFileName);

    const archiveStream = fs.createWriteStream(archiveFilePath, { flags: 'a' });
    tracesToArchive.forEach(trace => archiveStream.write(JSON.stringify(trace) + '\n'));
    archiveStream.end();

    const deleteStmt = this.db.prepare('DELETE FROM traces WHERE ts = ?');
    this.db.transaction(() => {
      for (const trace of tracesToArchive) {
        deleteStmt.run(trace.ts);
      }
    })();

    console.log(`[GhostDiary] Successfully archived ${tracesToArchive.length} traces to ${archiveFilePath}.`);
  }

  private async pruneToMaxSize(): Promise<void> {
    const dbFileSizeMB = this.getDbSizeMB();
    if (dbFileSizeMB <= this.options.maxSizeMB) return;

    console.warn(`[GhostDiary] DB size (${dbFileSizeMB}MB) exceeds limit of ${this.options.maxSizeMB}MB. Pruning...`);

    let prunedCount = 0;
    while (this.getDbSizeMB() > this.options.maxSizeMB) {
      const oldestTraces = this.db.prepare(`
        SELECT ts FROM traces WHERE is_protected = 0 ORDER BY ts ASC LIMIT ?
      `).all(this.options.pruneBatchSize);

      if (oldestTraces.length === 0) {
        console.error('[GhostDiary] Pruning required, but no unprotected traces found. Cannot reduce DB size further.');
        break;
      }

      const idsToDelete = oldestTraces.map(t => t.ts);
      const deleteStmt = this.db.prepare(`DELETE FROM traces WHERE ts IN (${idsToDelete.map(() => '?').join(',')})`);
      deleteStmt.run(...idsToDelete);
      
      prunedCount += oldestTraces.length;
    }

    if (prunedCount > 0) {
        this.db.exec('VACUUM'); // Reclaim disk space
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
    const countResult = this.db.prepare('SELECT COUNT(*) as count FROM traces').get();
    return {
      options: this.options,
      databaseSizeMB: this.getDbSizeMB(),
      traceCount: countResult.count,
    };
  }
}
