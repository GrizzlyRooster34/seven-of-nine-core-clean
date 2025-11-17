var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { injectable, singleton } from 'tsyringe';
let RestraintGate = class RestraintGate {
    state;
    arousalHistory = [];
    riskHistory = [];
    constructor() {
        this.state = {
            arousalLevel: 0,
            riskLevel: 'LOW',
            activeCaps: new Map(),
            lastUpdate: Date.now()
        };
    }
    async initialize() {
        console.log('RestraintGate: Initializing capability restraint system...');
        // Initialize default capability caps
        this.applyCapabilityCap('file_access', 'MONITORED', {}, 'Default security policy');
        this.applyCapabilityCap('network_access', 'LIMITED', { maxConnections: 10 }, 'Rate limiting');
        console.log('RestraintGate: Ready');
    }
    processArousalSignal(signal) {
        this.arousalHistory.push({
            ...signal,
            timestamp: Date.now()
        });
        // Update current arousal level (simple moving average of last 5 signals)
        const recentSignals = this.arousalHistory.slice(-5);
        this.state.arousalLevel = Math.round(recentSignals.reduce((sum, s) => sum + s.level, 0) / recentSignals.length);
        this.updateRestraints();
    }
    processRiskSignal(signal) {
        this.riskHistory.push({
            ...signal,
            timestamp: Date.now()
        });
        // Update current risk level (take highest of recent signals)
        const recentRisks = this.riskHistory.slice(-5);
        const riskLevels = { 'LOW': 1, 'MEDIUM': 2, 'HIGH': 3, 'CRITICAL': 4 };
        const maxRiskValue = Math.max(...recentRisks.map(r => riskLevels[r.severity]));
        this.state.riskLevel = Object.keys(riskLevels).find(key => riskLevels[key] === maxRiskValue);
        this.updateRestraints();
    }
    updateRestraints() {
        this.state.lastUpdate = Date.now();
        // Apply dynamic capability caps based on arousal and risk levels
        if (this.state.riskLevel === 'CRITICAL' || this.state.arousalLevel > 80) {
            this.applyCapabilityCap('code_execution', 'BLOCKED', {}, 'High risk/arousal detected');
            this.applyCapabilityCap('external_api', 'BLOCKED', {}, 'High risk/arousal detected');
        }
        else if (this.state.riskLevel === 'HIGH' || this.state.arousalLevel > 60) {
            this.applyCapabilityCap('code_execution', 'LIMITED', { timeout: 5000 }, 'Elevated risk/arousal');
            this.applyCapabilityCap('external_api', 'MONITORED', {}, 'Elevated risk/arousal');
        }
        else if (this.state.riskLevel === 'MEDIUM' || this.state.arousalLevel > 40) {
            this.applyCapabilityCap('code_execution', 'MONITORED', {}, 'Moderate risk/arousal');
            this.applyCapabilityCap('external_api', 'LIMITED', { maxRequests: 5 }, 'Moderate risk/arousal');
        }
        console.log(`RestraintGate: Updated restraints - Risk: ${this.state.riskLevel}, Arousal: ${this.state.arousalLevel}`);
    }
    applyCapabilityCap(capability, restriction, parameters, reason) {
        const cap = {
            capability,
            restriction,
            parameters,
            appliedAt: Date.now(),
            reason
        };
        this.state.activeCaps.set(capability, cap);
    }
    getCapabilityCaps() {
        return new Map(this.state.activeCaps);
    }
    getRestraintState() {
        return {
            ...this.state,
            activeCaps: new Map(this.state.activeCaps)
        };
    }
    clearCapabilityCap(capability) {
        return this.state.activeCaps.delete(capability);
    }
    async shutdown() {
        console.log('RestraintGate: Shutting down...');
        this.state.activeCaps.clear();
        this.arousalHistory.length = 0;
        this.riskHistory.length = 0;
    }
};
RestraintGate = __decorate([
    injectable(),
    singleton(),
    __metadata("design:paramtypes", [])
], RestraintGate);
export { RestraintGate };
//# sourceMappingURL=restraint-gate.js.map