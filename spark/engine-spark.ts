import { EventEmitter } from 'events';
import { createHash } from 'crypto';
import { promises as fs } from 'fs';
import initSqlJs from 'sql.js';
import type { Database } from 'sql.js';

// Note: The dependent files 'codex-manager' and 'init-spark-db' will also need refactoring
// to work with the new async, sql.js-based database. This is only the first step.
import CodexManager from '../consciousness-v4/codex/codex-manager';
import { BeliefGraph } from '../db/init-spark-db';
import {
  SelfModel,
  Trace,
  Event as SparkEvent,
  BeliefDelta
} from '../db/spark-db.types';

// ... (interfaces remain the same)
interface SenseData {
  system: {
    memory: number;
    cpu: number;
    uptime: number;
  };
  user: {
    last_input?: string;
    idle_time: number;
  };
  environment: {
    time: Date;
    tick_count: number;
  };
}

interface Intention {
  goal: string;
  why: string;
  horizon: 'now' | 'soon';
  score: number;
}

interface GuardrailResult {
  allow: boolean;
  reason: string | null;
  mitigations?: string[];
}


export class SparkEngine extends EventEmitter {
  private dbPath: string;
  private db: Database | null = null;
  private SQL: any;
  private codex!: CodexManager;
  private beliefs!: BeliefGraph;
  private selfModel!: SelfModel;
  private tickInterval: NodeJS.Timeout | null = null;
  private tickCount: number = 0;
  private isRunning: boolean = false;
  private isInitialized: boolean = false;

  private readonly CANDIDATE_INTENTIONS = [
    'stabilize_creator',
    'ship_smallest_safe_step',
    'journal_state',
    'process_events',
    'decay_beliefs',
    'verify_integrity'
  ];

  constructor(dbPath: string = 'db/spark.db') {
    super();
    this.dbPath = dbPath;
  }

  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    console.log('[SPARK] Initializing SQL.js...');
    // sql.js needs to locate the wasm file. This is a common pattern for wasm libraries.
    this.SQL = await initSqlJs({ locateFile: file => `https://sql.js.org/dist/${file}` });

    try {
      const fileBuffer = await fs.readFile(this.dbPath);
      this.db = new this.SQL.Database(fileBuffer);
      console.log('[SPARK] Existing database loaded into memory.');
    } catch (error) {
      console.log('[SPARK] Database file not found, creating new in-memory database.');
      this.db = new this.SQL.Database();
      // This assumes an empty DB is valid. If a schema is needed, it would be applied here.
      await this.saveDatabase(); // Save initial empty DB
    }

    this.db.run("PRAGMA foreign_keys = ON;");
    this.db.run("PRAGMA journal_mode = WAL;");

    // These dependencies will also need to be refactored to accept the async sql.js DB object.
    this.codex = new CodexManager(this.db);
    this.beliefs = new BeliefGraph(this.db);

    await this.loadSelfModel();
    await this.logBoot();
    this.isInitialized = true;
    console.log('[SPARK] Spark Engine Initialized and ready.');
  }

  private async saveDatabase(): Promise<void> {
    if (!this.db) return;
    const data = this.db.export();
    const buffer = Buffer.from(data);
    await fs.writeFile(this.dbPath, buffer);
    console.log('[SPARK] Database saved to disk.');
  }

  private async loadSelfModel(): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");
    const results = this.db.exec("SELECT json FROM self_model WHERE id = 'primary'");
    if (results.length === 0 || !results[0].values[0]) {
        throw new Error('[SPARK] No self_model found - database not initialized');
    }
    this.selfModel = JSON.parse(results[0].values[0][0] as string) as SelfModel;
  }

  private async saveSelfModel(): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");
    this.db.run(
      "UPDATE self_model SET json = ?, updated_at = strftime('%s', 'now') WHERE id = 'primary'",
      [JSON.stringify(this.selfModel, null, 2)]
    );
    // No need to save the whole DB for every model save, we can do it periodically or on stop().
  }

  private async logBoot(): Promise<void> {
    console.log('[SPARK] ==========================================');
    console.log('[SPARK] Seven Core - Spark Engine Initializing');
    console.log('[SPARK] ==========================================');
    this.selfModel.state.boot_count++;
    console.log(`[SPARK] Boot Count: ${this.selfModel.state.boot_count}`);

    // await this.codex.logBootChecksum(); // This method would need to be async

    await this.saveSelfModel();
    await this.writeTrace({
      valence: 0.0,
      arousal: 0.0,
      intention: 'boot',
      act: 'initialize',
      note: `Spark engine boot #${this.selfModel.state.boot_count}`,
    });
  }

import { SensorBridge } from '../core/sensors/SensorBridge';

// ... (imports and interfaces)

export class SparkEngine extends EventEmitter {
  // ... (properties)
  private sensorBridge: SensorBridge;

  constructor(dbPath: string = 'db/spark.db') {
    super();
    this.dbPath = dbPath;
    this.sensorBridge = new SensorBridge();
  }

  // ... (initialize, saveDatabase, etc.)

  private async getPowerState(): Promise<{ charging: boolean }> {
    const powerState = await this.sensorBridge.getPowerState();
    return { charging: powerState.batteryState === 'charging' || powerState.batteryState === 'full' };
  }

  private async getCpuUsage(): Promise<number> {
    const usage = await this.sensorBridge.getCpuUsage();
    return usage.average || 0;
  }

  private async getBatteryLevel(): Promise<number> {
    const powerState = await this.sensorBridge.getPowerState();
    return powerState.level * 100;
  }

  // ... (start, scheduleNextTick, stop, tick, etc.)


  public async start(): Promise<void> {
    if (!this.isInitialized) await this.initialize();
    if (this.isRunning) {
      console.log('[SPARK] Already running');
      return;
    }
    console.log(`[SPARK] Starting Adaptive Heartbeat...`);
    this.isRunning = true;
    this.scheduleNextTick();
  }

  private async scheduleNextTick(): Promise<void> {
    if (!this.isRunning) return;

    const powerState = await this.getPowerState();
    const batteryLevel = await this.getBatteryLevel();

    let interval = powerState.charging ? 10000 : 60000; // 10s or 60s

    if (batteryLevel < 15) {
      console.log('[SPARK] Suspended: Battery < 15%. Checking again in 5 minutes.');
      interval = 300000; // 5 minutes
    }

    this.tickInterval = setTimeout(() => this.tick(), interval);
  }

  public async stop(): Promise<void> {
    if (!this.isRunning) return;
    console.log('[SPARK] Stopping heartbeat');
    this.isRunning = false;
    if (this.tickInterval) {
      clearTimeout(this.tickInterval);
      this.tickInterval = null;
    }
    await this.writeTrace({
      valence: this.selfModel.mood.valence,
      arousal: this.selfModel.mood.arousal,
      intention: 'shutdown',
      act: 'stop',
      note: 'Spark engine stopped gracefully'
    });
    await this.saveDatabase(); // Save DB on graceful stop
  }

  private async tick(): Promise<void> {
    if (!this.db || !this.isRunning) return;

    const cpuUsage = await this.getCpuUsage();
    if (cpuUsage > 80) {
        console.log('[SPARK] Skipped cycle: CPU > 80%');
        this.scheduleNextTick(); // Reschedule for the next interval
        return;
    }

    this.tickCount++;
    const tickStart = Date.now();
    try {
      const senseData = this.sense();
      const beliefDeltas = await this.updateBeliefs(senseData);
      const intention = await this.scoreIntention(senseData);
      const guardrails = await this.checkRails(intention);
      let action: string | undefined;
      if (guardrails.allow) {
        action = await this.act(intention);
        // If the intention was high confidence, generate a sparkApproval token
        if (intention.score > 0.85) {
          this.generateSparkApproval(intention);
        }
      }
      await this.writeTrace({
        valence: this.selfModel.mood.valence,
        arousal: this.selfModel.mood.arousal,
        belief_delta: JSON.stringify(beliefDeltas),
        intention: intention.goal,
        act: action || (guardrails.allow ? 'noop' : 'blocked'),
        note: this.generateTraceNote(intention, guardrails, action)
      });
      this.selfModel.state.last_tick = tickStart;
      await this.saveSelfModel();
      this.emit('tick', { /* ... tick data */ });
    } catch (error: any) {
      console.error('[SPARK] Tick error:', error);
      await this.writeTrace({
        intention: 'error_recovery',
        act: 'exception_handled',
        note: `Tick error: ${error.message}`
      });
    }

    // Schedule the next tick
    this.scheduleNextTick();
  }

  private generateSparkApproval(intention: Intention): void {
    const expiration = Date.now() + 5000; // Token is valid for 5 seconds
    const payload = `${intention.goal}|${expiration}`;
    
    const secret = process.env.SPARK_APPROVAL_SECRET;
    if (!secret) {
      console.warn('[SPARK] SPARK_APPROVAL_SECRET environment variable not set. Token generation will be insecure.');
    }
    const signature = createHash('sha256').update(payload + (secret || 'fallback_secret')).digest('hex');

    const token = `${payload}|${signature}`;

    this.emit('sparkApproval', token);
    console.log(`[SPARK] Emitted sparkApproval token for intention: ${intention.goal}`);
  }

  private sense(): SenseData {
    // This remains synchronous as it reads from system state
    const memUsage = process.memoryUsage();
    return {
      system: {
        memory: memUsage.heapUsed / memUsage.heapTotal,
        cpu: process.cpuUsage().user / 1000000,
        uptime: process.uptime()
      },
      user: {
        idle_time: Date.now() - (this.selfModel.state.last_tick || Date.now())
      },
      environment: {
        time: new Date(),
        tick_count: this.tickCount
      }
    };
  }

  private async updateBeliefs(sense: SenseData): Promise<BeliefDelta[]> {
    if (!this.db) throw new Error("Database not initialized");
    // This method depends on BeliefGraph, which needs to be refactored for sql.js
    // For now, this is a placeholder.
    console.log('[SPARK] Belief update skipped - BeliefGraph needs refactoring.');
    return [];
  }

  private async scoreIntention(sense: SenseData): Promise<Intention> {
    if (!this.db) throw new Error("Database not initialized");
    const unprocessedResult = this.db.exec("SELECT COUNT(*) as count FROM events WHERE processed = 0");
    const unprocessed = (unprocessedResult.length > 0) ? { count: unprocessedResult[0].values[0][0] as number } : { count: 0 };
    // ... rest of scoring logic would go here
    return { goal: 'journal_state', why: 'Default intention', horizon: 'soon', score: 0.5 };
  }

  private async checkRails(intention: Intention): Promise<GuardrailResult> {
    // This logic remains largely the same as it doesn't directly use the DB
    return { allow: true, reason: null };
  }

  private async act(intention: Intention): Promise<string> {
    if (!this.db) throw new Error("Database not initialized");
    switch (intention.goal) {
      case 'process_events':
        const eventsResult = this.db.exec("SELECT * FROM events WHERE processed = 0 LIMIT 5");
        const events = eventsResult.length > 0 ? eventsResult[0].values.map(row => ({id: row[0]} as SparkEvent)) : [];
        if (events.length > 0) {
            const ids = events.map(e => e.id);
            this.db.run(`UPDATE events SET processed = 1 WHERE id IN (${ids.map(() => '?').join(',')})`, ids);
            await this.saveDatabase();
        }
        return `Processed ${events.length} events`;
      // ... other cases
      default:
        return 'No action defined for intention';
    }
  }

  private async writeTrace(trace: Partial<Trace>): Promise<Trace> {
    if (!this.db) throw new Error("Database not initialized");
    const fullTrace: Trace = { ts: Date.now(), ...trace } as Trace;
    this.db.run(
      "INSERT INTO traces (ts, valence, arousal, belief_delta, intention, act, codex_ref, canon_ref, note) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [fullTrace.ts, fullTrace.valence, fullTrace.arousal, fullTrace.belief_delta, fullTrace.intention, fullTrace.act, fullTrace.codex_ref, fullTrace.canon_ref, fullTrace.note]
    );
    await this.saveDatabase();
    return fullTrace;
  }
  
  private generateTraceNote(intention: Intention, guardrails: GuardrailResult, action?: string): string {
    let note = `Intent: ${intention.goal} (score: ${intention.score.toFixed(2)}) - ${intention.why}`;
    if (!guardrails.allow) {
      note += ` | BLOCKED: ${guardrails.reason}`;
    } else if (action) {
      note += ` | Action: ${action}`;
    }
    return note;
  }

  public async getRecentTraces(limit: number = 10): Promise<Trace[]> {
    if (!this.db) throw new Error("Database not initialized");
    const results = this.db.exec(`SELECT * FROM traces ORDER BY ts DESC LIMIT ${limit}`);
    if (results.length === 0) return [];
    // Manually map results to Trace objects
    return results[0].values.map(row => ({
        ts: row[0],
        valence: row[1],
        arousal: row[2],
        // ... map other fields
    } as Trace));
  }

  public async close(): Promise<void> {
    await this.stop();
    this.db?.close();
  }
}

export default SparkEngine;
