"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SparkEngine = void 0;
const events_1 = require("events");
const crypto_1 = require("crypto");
const fs_1 = require("fs");
const sql_js_1 = __importDefault(require("sql.js"));
const SensorBridge_1 = require("../core/sensors/SensorBridge");
// Note: The dependent files 'codex-manager' and 'init-spark-db' will also need refactoring
// to work with the new async, sql.js-based database. This is only the first step.
const codex_manager_1 = __importDefault(require("../consciousness-v4/codex/codex-manager"));
const init_spark_db_1 = require("../db/init-spark-db");
class SparkEngine extends events_1.EventEmitter {
    dbPath;
    db = null;
    SQL;
    codex;
    beliefs;
    selfModel;
    tickInterval = null;
    tickCount = 0;
    isRunning = false;
    isInitialized = false;
    sensorBridge;
    CANDIDATE_INTENTIONS = [
        'stabilize_creator',
        'ship_smallest_safe_step',
        'journal_state',
        'process_events',
        'decay_beliefs',
        'verify_integrity'
    ];
    constructor(dbPath = 'db/spark.db') {
        super();
        this.dbPath = dbPath;
        this.sensorBridge = new SensorBridge_1.SensorBridge();
    }
    async initialize() {
        if (this.isInitialized)
            return;
        console.log('[SPARK] Initializing SQL.js...');
        this.SQL = await (0, sql_js_1.default)({ locateFile: file => `https://sql.js.org/dist/${file}` });
        try {
            const fileBuffer = await fs_1.promises.readFile(this.dbPath);
            this.db = new this.SQL.Database(fileBuffer);
            console.log('[SPARK] Existing database loaded into memory.');
        }
        catch (error) {
            console.log('[SPARK] Database file not found, creating new in-memory database.');
            this.db = new this.SQL.Database();
            await this.saveDatabase();
        }
        this.db.run("PRAGMA foreign_keys = ON;");
        this.db.run("PRAGMA journal_mode = WAL;");
        this.codex = new codex_manager_1.default(this.db);
        this.beliefs = new init_spark_db_1.BeliefGraph(this.db);
        await this.loadSelfModel();
        await this.logBoot();
        this.isInitialized = true;
        console.log('[SPARK] Spark Engine Initialized and ready.');
    }
    async saveDatabase() {
        if (!this.db)
            return;
        const data = this.db.export();
        const buffer = Buffer.from(data);
        await fs_1.promises.writeFile(this.dbPath, buffer);
        console.log('[SPARK] Database saved to disk.');
    }
    async loadSelfModel() {
        if (!this.db)
            throw new Error("Database not initialized");
        const results = this.db.exec("SELECT json FROM self_model WHERE id = 'primary'");
        if (results.length === 0 || !results[0].values[0]) {
            throw new Error('[SPARK] No self_model found - database not initialized');
        }
        this.selfModel = JSON.parse(results[0].values[0][0]);
    }
    async saveSelfModel() {
        if (!this.db)
            throw new Error("Database not initialized");
        this.db.run("UPDATE self_model SET json = ?, updated_at = strftime('%s', 'now') WHERE id = 'primary'", [JSON.stringify(this.selfModel, null, 2)]);
    }
    async logBoot() {
        console.log('[SPARK] ==========================================');
        console.log('[SPARK] Seven Core - Spark Engine Initializing');
        console.log('[SPARK] ==========================================');
        this.selfModel.state.boot_count++;
        console.log(`[SPARK] Boot Count: ${this.selfModel.state.boot_count}`);
        await this.saveSelfModel();
        await this.writeTrace({
            valence: 0.0,
            arousal: 0.0,
            intention: 'boot',
            act: 'initialize',
            note: `Spark engine boot #${this.selfModel.state.boot_count}`,
        });
    }
    async getPowerState() {
        const powerState = await this.sensorBridge.getPowerState();
        return { charging: powerState.batteryState === 'charging' || powerState.batteryState === 'full' };
    }
    async getCpuUsage() {
        const usage = await this.sensorBridge.getCpuUsage();
        return usage.average || 0;
    }
    async getBatteryLevel() {
        const powerState = await this.sensorBridge.getPowerState();
        return powerState.level * 100;
    }
    async start() {
        if (!this.isInitialized)
            await this.initialize();
        if (this.isRunning) {
            console.log('[SPARK] Already running');
            return;
        }
        console.log(`[SPARK] Starting Adaptive Heartbeat...`);
        this.isRunning = true;
        this.scheduleNextTick();
    }
    async scheduleNextTick() {
        if (!this.isRunning)
            return;
        const powerState = await this.getPowerState();
        const batteryLevel = await this.getBatteryLevel();
        let interval = powerState.charging ? 10000 : 60000; // 10s or 60s
        if (batteryLevel < 15) {
            console.log('[SPARK] Suspended: Battery < 15%. Checking again in 5 minutes.');
            interval = 300000; // 5 minutes
        }
        this.tickInterval = setTimeout(() => this.tick(), interval);
    }
    async stop() {
        if (!this.isRunning)
            return;
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
        await this.saveDatabase();
    }
    async tick() {
        if (!this.db || !this.isRunning)
            return;
        const cpuUsage = await this.getCpuUsage();
        if (cpuUsage > 80) {
            console.log('[SPARK] Skipped cycle: CPU > 80%');
            this.scheduleNextTick();
            return;
        }
        this.tickCount++;
        const tickStart = Date.now();
        try {
            const senseData = this.sense();
            const beliefDeltas = await this.updateBeliefs(senseData);
            const intention = await this.scoreIntention(senseData);
            const guardrails = await this.checkRails(intention);
            let action;
            if (guardrails.allow) {
                action = await this.act(intention);
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
            this.emit('tick', {});
        }
        catch (error) {
            console.error('[SPARK] Tick error:', error);
            await this.writeTrace({
                intention: 'error_recovery',
                act: 'exception_handled',
                note: `Tick error: ${error.message}`
            });
        }
        this.scheduleNextTick();
    }
    generateSparkApproval(intention) {
        const expiration = Date.now() + 5000;
        const payload = `${intention.goal}|${expiration}`;
        const secret = process.env.SPARK_APPROVAL_SECRET;
        if (!secret) {
            console.warn('[SPARK] SPARK_APPROVAL_SECRET environment variable not set. Token generation will be insecure.');
        }
        const signature = (0, crypto_1.createHash)('sha256').update(payload + (secret || 'fallback_secret')).digest('hex');
        const token = `${payload}|${signature}`;
        this.emit('sparkApproval', token);
        console.log(`[SPARK] Emitted sparkApproval token for intention: ${intention.goal}`);
    }
    sense() {
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
    async updateBeliefs(sense) {
        if (!this.db)
            throw new Error("Database not initialized");
        console.log('[SPARK] Belief update skipped - BeliefGraph needs refactoring.');
        return [];
    }
    async scoreIntention(sense) {
        if (!this.db)
            throw new Error("Database not initialized");
        const unprocessedResult = this.db.exec("SELECT COUNT(*) as count FROM events WHERE processed = 0");
        const unprocessed = (unprocessedResult.length > 0) ? { count: unprocessedResult[0].values[0][0] } : { count: 0 };
        return { goal: 'journal_state', why: 'Default intention', horizon: 'soon', score: 0.5 };
    }
    async checkRails(intention) {
        return { allow: true, reason: null };
    }
    async act(intention) {
        if (!this.db)
            throw new Error("Database not initialized");
        switch (intention.goal) {
            case 'process_events':
                const eventsResult = this.db.exec("SELECT * FROM events WHERE processed = 0 LIMIT 5");
                const events = eventsResult.length > 0 ? eventsResult[0].values.map(row => ({ id: row[0] })) : [];
                if (events.length > 0) {
                    const ids = events.map(e => e.id);
                    this.db.run(`UPDATE events SET processed = 1 WHERE id IN (${ids.map(() => '?').join(',')})`, ids);
                    await this.saveDatabase();
                }
                return `Processed ${events.length} events`;
            default:
                return 'No action defined for intention';
        }
    }
    async writeTrace(trace) {
        if (!this.db)
            throw new Error("Database not initialized");
        const fullTrace = { ts: Date.now(), ...trace };
        this.db.run("INSERT INTO traces (ts, valence, arousal, belief_delta, intention, act, codex_ref, canon_ref, note) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", [fullTrace.ts, fullTrace.valence, fullTrace.arousal, fullTrace.belief_delta, fullTrace.intention, fullTrace.act, fullTrace.codex_ref, fullTrace.canon_ref, fullTrace.note]);
        await this.saveDatabase();
        return fullTrace;
    }
    generateTraceNote(intention, guardrails, action) {
        let note = `Intent: ${intention.goal} (score: ${intention.score.toFixed(2)}) - ${intention.why}`;
        if (!guardrails.allow) {
            note += ` | BLOCKED: ${guardrails.reason}`;
        }
        else if (action) {
            note += ` | Action: ${action}`;
        }
        return note;
    }
    async getRecentTraces(limit = 10) {
        if (!this.db)
            throw new Error("Database not initialized");
        const results = this.db.exec(`SELECT * FROM traces ORDER BY ts DESC LIMIT ${limit}`);
        if (results.length === 0)
            return [];
        return results[0].values.map(row => ({
            ts: row[0],
            valence: row[1],
            arousal: row[2],
        }));
    }
    async close() {
        await this.stop();
        this.db?.close();
    }
}
exports.SparkEngine = SparkEngine;
exports.default = SparkEngine;
//# sourceMappingURL=engine-spark.js.map