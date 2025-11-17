import { injectable, singleton } from 'tsyringe';

// Internal types for Quadra-Lock Consolidator
export interface CaseFinding {
  id: string;
  verdict: 'PANIC' | 'DENY' | 'ASK_CREATOR' | 'ALLOW';
  confidence: number;
  source: string;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

export interface ConsolidatedVerdict {
  finalVerdict: 'PANIC' | 'DENY' | 'ASK_CREATOR' | 'ALLOW';
  precedenceChain: CaseFinding[];
  refusalTemplate?: string;
  mitigationData?: Record<string, unknown>;
  consolidatedAt: number;
}

export interface RefusalTemplate {
  verdict: 'PANIC' | 'DENY' | 'ASK_CREATOR';
  template: string;
  mitigationSuggestions: string[];
}

@injectable()
@singleton()
export class QuadraLockConsolidator {
  private findings: CaseFinding[] = [];
  private refusalTemplates: Map<string, RefusalTemplate>;

  constructor() {
    this.refusalTemplates = new Map();
    this.initializeRefusalTemplates();
  }

  public async initialize(): Promise<void> {
    console.log('QuadraLockConsolidator: Initializing case consolidation engine...');
    console.log('QuadraLockConsolidator: Ready');
  }

  public ingestFinding(finding: CaseFinding): void {
    this.findings.push({
      ...finding,
      timestamp: Date.now()
    });
  }

  public consolidateVerdict(): ConsolidatedVerdict {
    if (this.findings.length === 0) {
      return {
        finalVerdict: 'ALLOW',
        precedenceChain: [],
        consolidatedAt: Date.now()
      };
    }

    // Apply precedence: PANIC > DENY > ASK_CREATOR > ALLOW
    const precedenceOrder: Record<string, number> = {
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

    const result: ConsolidatedVerdict = {
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

  public clearFindings(): void {
    this.findings.length = 0;
  }

  public getActiveFindings(): ReadonlyArray<CaseFinding> {
    return [...this.findings];
  }

  private initializeRefusalTemplates(): void {
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

  public async shutdown(): Promise<void> {
    console.log('QuadraLockConsolidator: Shutting down...');
    this.clearFindings();
  }
}
