import { EventEmitter } from 'events';

const MAX_CACHE_SIZE_MB = 256;
const RECOVERY_INTERVAL_MS = 60000; // 60 seconds

// This would be a generic memory entry type
type MemoryEntry = any;

export class MemoryFaultHandler extends EventEmitter {
  private inMemoryCache: Map<string, MemoryEntry> = new Map();
  private cacheSize: number = 0;
  private isDegraded: boolean = false;
  private recoveryInterval: NodeJS.Timeout | null = null;

  constructor(private dbWriter: (entry: MemoryEntry) => Promise<void>) {
    super();
  }

  /**
   * This method should be called by the MemoryEngine whenever a write to the primary DB fails.
   * @param entry The memory entry that failed to be written.
   */
  public async handleWriteFailure(entry: MemoryEntry, error: Error): Promise<void> {
    console.error(`🔥 MEMORY WRITE FAILURE: ${error.message}. Entering Degraded Mode.`);
    
    if (!this.isDegraded) {
      this.isDegraded = true;
      this.emit('degradedMode', { status: 'activated' });
      this.startRecoveryLoop();
    }

    // Add to in-memory cache if there is space
    const entrySize = this.getEntrySize(entry);
    if (this.cacheSize + entrySize > MAX_CACHE_SIZE_MB * 1024 * 1024) {
      console.error(`🚨 MEMORY CRITICAL: In-memory cache full. Data loss imminent.`);
      this.emit('critical', { reason: 'Cache full', cacheSize: this.cacheSize });
      return; // Discarding new entry
    }

    this.inMemoryCache.set(entry.id, entry);
    this.cacheSize += entrySize;
    console.warn(`[MemoryFaultHandler] Entry ${entry.id} saved to in-memory cache. Cache size: ${Math.round(this.cacheSize / 1024)} KB`);
  }

  private startRecoveryLoop(): void {
    if (this.recoveryInterval) return;

    console.log(`[MemoryFaultHandler] Starting recovery loop. Will attempt to flush cache every ${RECOVERY_INTERVAL_MS / 1000}s.`);
    this.recoveryInterval = setInterval(async () => {
      if (this.inMemoryCache.size === 0) {
        // If cache is empty, we might have recovered
        try {
          await this.dbWriter({ id: '__test_write__', content: 'recovery_test' });
          // If test write succeeds, we can exit degraded mode
          this.exitDegradedMode();
        } catch (e) {
          // Still failing
          console.warn('[MemoryFaultHandler] Recovery test write failed. Remaining in degraded mode.');
        }
        return;
      }

      console.log(`[MemoryFaultHandler] Attempting to flush ${this.inMemoryCache.size} cached entries to disk...`);
      const successfullyFlushed: string[] = [];
      for (const [id, entry] of this.inMemoryCache.entries()) {
        try {
          await this.dbWriter(entry);
          successfullyFlushed.push(id);
        } catch (e) {
          console.error(`[MemoryFaultHandler] Still failing to write entry ${id}. It will remain in cache.`);
          // Stop trying on the first failure to avoid hammering the DB
          return;
        }
      }

      // Remove successfully flushed entries from cache
      successfullyFlushed.forEach(id => {
        const flushedEntry = this.inMemoryCache.get(id);
        if (flushedEntry) {
          this.cacheSize -= this.getEntrySize(flushedEntry);
          this.inMemoryCache.delete(id);
        }
      });

      console.log(`[MemoryFaultHandler] Flushed ${successfullyFlushed.length} entries to disk.`);

    }, RECOVERY_INTERVAL_MS);
  }

  private exitDegradedMode(): void {
    console.log('✅ MEMORY RECOVERED: Primary database is writable again. Exiting Degraded Mode.');
    this.isDegraded = false;
    if (this.recoveryInterval) {
      clearInterval(this.recoveryInterval);
      this.recoveryInterval = null;
    }
    this.emit('degradedMode', { status: 'deactivated' });
  }

  private getEntrySize(entry: MemoryEntry): number {
    return JSON.stringify(entry).length;
  }

  public getStatus() {
    return {
      isDegraded: this.isDegraded,
      cacheSize: this.cacheSize,
      cachedEntries: this.inMemoryCache.size,
      maxCacheSize: MAX_CACHE_SIZE_MB * 1024 * 1024,
    };
  }
}
