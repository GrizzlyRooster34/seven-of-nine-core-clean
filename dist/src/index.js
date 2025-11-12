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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SevenOfNineCore = void 0;
const tsyringe_1 = require("tsyringe");
require("reflect-metadata");
// Core unifiers
const quadran_lock_orchestrator_1 = require("./systems/core/quadran-lock-orchestrator");
const quadra_lock_consolidator_1 = require("./systems/core/quadra-lock-consolidator");
const restraint_gate_1 = require("./systems/core/restraint-gate");
const spark_heartbeat_1 = require("./systems/core/spark-heartbeat");
const skill_loader_1 = require("../skills/skill-loader");
const ultron_1 = require("../sandbox/ultron");
class SevenOfNineCore {
    orchestrator;
    consolidator;
    restraintGate;
    heartbeat;
    skillLoader;
    sandbox;
    constructor() {
        // Register services in DI container
        tsyringe_1.container.registerSingleton('QuadranLockOrchestrator', quadran_lock_orchestrator_1.QuadranLockOrchestrator);
        tsyringe_1.container.registerSingleton('QuadraLockConsolidator', quadra_lock_consolidator_1.QuadraLockConsolidator);
        tsyringe_1.container.registerSingleton('RestraintGate', restraint_gate_1.RestraintGate);
        tsyringe_1.container.registerSingleton('SparkHeartbeat', spark_heartbeat_1.SparkHeartbeat);
        // Resolve services
        this.orchestrator = tsyringe_1.container.resolve(quadran_lock_orchestrator_1.QuadranLockOrchestrator);
        this.consolidator = tsyringe_1.container.resolve(quadra_lock_consolidator_1.QuadraLockConsolidator);
        this.restraintGate = tsyringe_1.container.resolve(restraint_gate_1.RestraintGate);
        this.heartbeat = tsyringe_1.container.resolve(spark_heartbeat_1.SparkHeartbeat);
        this.skillLoader = new skill_loader_1.SkillLoader('./skills/core');
        this.sandbox = new ultron_1.UltronSandbox();
    }
    async initialize() {
        console.log('Initializing Seven of Nine Core...');
        await this.orchestrator.initialize();
        await this.consolidator.initialize();
        await this.restraintGate.initialize();
        await this.heartbeat.initialize();
        await this.skillLoader.loadSkills();
        console.log('Seven of Nine Core initialized successfully');
    }
    async shutdown() {
        console.log('Shutting down Seven of Nine Core...');
        await this.heartbeat.shutdown();
        await this.restraintGate.shutdown();
        await this.consolidator.shutdown();
        await this.orchestrator.shutdown();
        console.log('Seven of Nine Core shut down complete');
    }
}
exports.SevenOfNineCore = SevenOfNineCore;
__exportStar(require("./systems/core/quadran-lock-orchestrator"), exports);
__exportStar(require("./systems/core/quadra-lock-consolidator"), exports);
__exportStar(require("./systems/core/restraint-gate"), exports);
__exportStar(require("./systems/core/spark-heartbeat"), exports);
//# sourceMappingURL=index.js.map