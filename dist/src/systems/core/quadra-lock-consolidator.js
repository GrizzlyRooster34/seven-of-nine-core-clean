"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuadraLockConsolidator = void 0;
const tsyringe_1 = require("tsyringe");
let QuadraLockConsolidator = class QuadraLockConsolidator {
    findings = [];
    refusalTemplates;
    constructor() {
        this.refusalTemplates = new Map();
        this.initializeRefusalTemplates();
    }
    async initialize() {
        console.log('QuadraLockConsolidator: Initializing case consolidation engine...');
        console.log('QuadraLockConsolidator: Ready');
    }
    ingestFinding(finding) {
        this.findings.push({
            ...finding,
            timestamp: Date.now()
        });
    }
    consolidateVerdict() {
        if (this.findings.length === 0) {
            return {
                finalVerdict: 'ALLOW',
                precedenceChain: [],
                consolidatedAt: Date.now()
            };
        }
        // Apply precedence: PANIC > DENY > ASK_CREATOR > ALLOW
        const precedenceOrder = {
            'PANIC': 4,
            'DENY': 3,
            'ASK_CREATOR': 2,
            'ALLOW': 1
        };
        // Sort findings by precedence (highest first)
        const sortedFindings = [...this.findings].sort((a, b) => {
            return precedenceOrder[b.verdict] - precedenceOrder[a.verdict];
        });
        const highestPrecedenceVerdict = sortedFindings[0].verdict;
        const precedenceChain = sortedFindings.filter(f => f.verdict === highestPrecedenceVerdict);
        const result = {
            finalVerdict: highestPrecedenceVerdict,
            precedenceChain,
            consolidatedAt: Date.now()
        };
        // Add refusal template and mitigation data for non-ALLOW verdicts
        if (highestPrecedenceVerdict !== 'ALLOW') {
            const template = this.refusalTemplates.get(highestPrecedenceVerdict);
            if (template) {
                result.refusalTemplate = template.template;
                result.mitigationData = {
                    suggestions: template.mitigationSuggestions,
                    verdict: highestPrecedenceVerdict,
                    findingsCount: precedenceChain.length
                };
            }
        }
        return result;
    }
    clearFindings() {
        this.findings.length = 0;
    }
    getActiveFindings() {
        return [...this.findings];
    }
    initializeRefusalTemplates() {
        this.refusalTemplates.set('PANIC', {
            verdict: 'PANIC',
            template: 'Critical security violation detected. Request blocked immediately.',
            mitigationSuggestions: [
                'Contact system administrator',
                'Review security protocols',
                'Audit request parameters'
            ]
        });
        this.refusalTemplates.set('DENY', {
            verdict: 'DENY',
            template: 'Request denied based on policy violation.',
            mitigationSuggestions: [
                'Review request against current policies',
                'Modify request to comply with guidelines',
                'Request policy clarification if needed'
            ]
        });
        this.refusalTemplates.set('ASK_CREATOR', {
            verdict: 'ASK_CREATOR',
            template: 'Request requires creator authorization.',
            mitigationSuggestions: [
                'Submit request for creator review',
                'Provide additional context for authorization',
                'Wait for creator approval before proceeding'
            ]
        });
    }
    async shutdown() {
        console.log('QuadraLockConsolidator: Shutting down...');
        this.clearFindings();
    }
};
exports.QuadraLockConsolidator = QuadraLockConsolidator;
exports.QuadraLockConsolidator = QuadraLockConsolidator = __decorate([
    (0, tsyringe_1.injectable)(),
    (0, tsyringe_1.singleton)(),
    __metadata("design:paramtypes", [])
], QuadraLockConsolidator);
//# sourceMappingURL=quadra-lock-consolidator.js.map