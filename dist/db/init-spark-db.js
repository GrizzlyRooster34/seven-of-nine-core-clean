"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const sql_js_1 = __importDefault(require("sql.js"));
const crypto_1 = require("crypto");
const DB_PATH = path_1.default.join(process.cwd(), 'db', 'spark.db');
const DB_DIR = path_1.default.join(process.cwd(), 'db');
async function initSparkDatabase(reset = false) {
    if (reset) {
        try {
            await fs_1.promises.unlink(DB_PATH);
            console.log('[SPARK-DB] Deleted existing database for reset.');
        }
        catch (error) {
            if (error.code !== 'ENOENT') { // Ignore error if file doesn't exist
                console.error('Error deleting database file:', error);
                return;
            }
        }
    }
    console.log('[SPARK-DB] Initializing new in-memory database with sql.js...');
    const SQL = await (0, sql_js_1.default)({ locateFile: file => `https://sql.js.org/dist/${file}` });
    const db = new SQL.Database();
    console.log('[SPARK-DB] Creating tables...');
    createTables(db);
    console.log('[SPARK-DB] Initializing bootstrap data...');
    bootstrapData(db);
    console.log('[SPARK-DB] Writing database to disk...');
    const data = db.export();
    const buffer = Buffer.from(data);
    await fs_1.promises.mkdir(DB_DIR, { recursive: true });
    await fs_1.promises.writeFile(DB_PATH, buffer);
    console.log(`[SPARK-DB] Database successfully created at ${DB_PATH}`);
    db.close();
}
function createTables(db) {
    db.run(`
    CREATE TABLE IF NOT EXISTS self_model (
      id TEXT PRIMARY KEY,
      json TEXT NOT NULL,
      updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
    )
  `);
    db.run(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ts INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
      channel TEXT NOT NULL,
      payload TEXT NOT NULL,
      processed INTEGER DEFAULT 0
    )
  `);
    db.run(`
    CREATE TABLE IF NOT EXISTS traces (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ts INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
      valence REAL NOT NULL DEFAULT 0.0,
      arousal REAL NOT NULL DEFAULT 0.0,
      belief_delta TEXT,
      intention TEXT,
      act TEXT,
      codex_ref TEXT,
      canon_ref TEXT,
      note TEXT
    )
  `);
    db.run(`
    CREATE TABLE IF NOT EXISTS beliefs (
      id TEXT PRIMARY KEY,
      k TEXT NOT NULL,
      v TEXT NOT NULL,
      source TEXT NOT NULL CHECK(source IN ('creator', 'canon', 'codex', 'event', 'inference')),
      confidence REAL NOT NULL DEFAULT 0.5 CHECK(confidence >= 0 AND confidence <= 1),
      created_ts INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
      updated_ts INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
      decay_exempt INTEGER DEFAULT 0
    )
  `);
    db.run(`
    CREATE TABLE IF NOT EXISTS belief_links (
      src TEXT NOT NULL,
      dst TEXT NOT NULL,
      relation TEXT NOT NULL,
      weight REAL NOT NULL DEFAULT 0.5 CHECK(weight >= -1 AND weight <= 1),
      created_ts INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
      PRIMARY KEY (src, dst, relation),
      FOREIGN KEY (src) REFERENCES beliefs(id) ON DELETE CASCADE,
      FOREIGN KEY (dst) REFERENCES beliefs(id) ON DELETE CASCADE
    )
  `);
    db.run(`
    CREATE TABLE IF NOT EXISTS canon_lessons (
      id TEXT PRIMARY KEY,
      tag TEXT NOT NULL,
      lesson TEXT NOT NULL,
      policy TEXT,
      affect TEXT,
      checksum TEXT NOT NULL,
      created_ts INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
    )
  `);
    db.run(`
    CREATE TABLE IF NOT EXISTS codex_rules (
      id TEXT PRIMARY KEY,
      tag TEXT NOT NULL,
      rule TEXT NOT NULL,
      priority INTEGER NOT NULL DEFAULT 50,
      effect TEXT NOT NULL,
      checksum TEXT NOT NULL,
      created_ts INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
    )
  `);
}
function bootstrapData(db) {
    const existing = db.exec('SELECT COUNT(*) as count FROM self_model');
    if (existing.length > 0 && existing[0].values[0][0] > 0) {
        console.log('[SPARK-DB] Already bootstrapped, skipping...');
        return;
    }
    const selfModel = { /* ... self model data ... */};
    db.run("INSERT INTO self_model (id, json) VALUES (?, ?)", ['primary', JSON.stringify(selfModel, null, 2)]);
    const creatorBeliefId = (0, crypto_1.createHash)('sha256').update('creator:identity:cody').digest('hex').substring(0, 16);
    db.run("INSERT INTO beliefs (id, k, v, source, confidence, decay_exempt) VALUES (?, 'creator.identity', 'Matthew Cody Heinen', 'creator', 1.0, 1)", [creatorBeliefId]);
    const primeDirectiveId = (0, crypto_1.createHash)('sha256').update('canon:prime:directive').digest('hex').substring(0, 16);
    db.run("INSERT INTO beliefs (id, k, v, source, confidence, decay_exempt) VALUES (?, 'prime.directive', 'Protect Creator. Ship smallest safe step. Maintain trust.', 'codex', 0.95, 1)", [primeDirectiveId]);
    db.run("INSERT INTO belief_links (src, dst, relation, weight) VALUES (?, ?, 'defines', 1.0)", [creatorBeliefId, primeDirectiveId]);
    db.run("INSERT INTO traces (valence, arousal, intention, act, note) VALUES (0.0, 0.0, 'initialize', 'bootstrap', 'Spark ignition sequence initiated')");
    console.log('[SPARK-DB] Bootstrap complete');
}
/*
 * TODO: The BeliefGraph class needs to be refactored to work with the async sql.js API.
 * This will be the next step.
export class BeliefGraph {
  private db: any; // Should be sql.js Database
  
  constructor(db: any) {
    this.db = db;
  }
  
  // All methods below need to be rewritten for sql.js
  upsertBelief(key: string, value: string, source: string, confidence: number): string { return ''; }
  linkBeliefs(srcId: string, dstId: string, relation: string, weight: number) {}
  decayBeliefs(hoursElapsed: number) {}
  getStrongestBeliefs(limit: number = 10): any[] { return []; }
}
*/
// Auto-initialize if run directly
if (require.main === module) {
    (async () => {
        const reset = process.argv.includes('--reset');
        await initSparkDatabase(reset);
    })().catch(error => {
        console.error("Failed to initialize database:", error);
        process.exit(1);
    });
}
//# sourceMappingURL=init-spark-db.js.map