import { injectable, singleton } from 'tsyringe';

// Internal types for Restraint Doctrine Gate
export interface ArousalSignal {
  level: number; // 0-100
  source: string;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

export interface RiskSignal {
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  category: string;
  source: string;
  timestamp: number;
  details?: Record<string, unknown>;
}

export interface CapabilityCap {
  capability: string;
  restriction: 'BLOCKED' | 'LIMITED' | 'MONITORED' | 'UNRESTRICTED';
  parameters?: Record<string, unknown>;
  appliedAt: number;
  reason: string;
}

export interface RestraintState {
  arousalLevel: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  activeCaps: Map<string, CapabilityCap>;
  lastUpdate: number;
}

@injectable()
@singleton()
export class RestraintGate {
  private state: RestraintState;
  private arousalHistory: ArousalSignal[] = [];
  private riskHistory: RiskSignal[] = [];

  constructor() {
    this.state = {
      arousalLevel: 0,
      riskLevel: 'LOW',
      activeCaps: new Map(),
      lastUpdate: Date.now()
    };
  }

  public async initialize(): Promise<void> {
    console.log('RestraintGate: Initializing capability restraint system...');
    
    // Initialize default capability caps
    this.applyCapabilityCap('file_access', 'MONITORED', {}, 'Default security policy');
    this.applyCapabilityCap('network_access', 'LIMITED', { maxConnections: 10 }, 'Rate limiting');
    
    console.log('RestraintGate: Ready');
  }

  public processArousalSignal(signal: ArousalSignal): void {
    this.arousalHistory.push({
      ...signal,
      timestamp: Date.now()
    });

    // Update current arousal level (simple moving average of last 5 signals)
    const recentSignals = this.arousalHistory.slice(-5);
    this.state.arousalLevel = Math.round(
      recentSignals.reduce((sum, s) => sum + s.level, 0) / recentSignals.length
    );

    this.updateRestraints();
  }

  public processRiskSignal(signal: RiskSignal): void {
    this.riskHistory.push({
      ...signal,
      timestamp: Date.now()
    });

    // Update current risk level (take highest of recent signals)
    const recentRisks = this.riskHistory.slice(-5);
    const riskLevels = { 'LOW': 1, 'MEDIUM': 2, 'HIGH': 3, 'CRITICAL': 4 };
    const maxRiskValue = Math.max(...recentRisks.map(r => riskLevels[r.severity]));
    
    this.state.riskLevel = Object.keys(riskLevels).find(
      key => riskLevels[key as keyof typeof riskLevels] === maxRiskValue
    ) as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

    this.updateRestraints();
  }

  private updateRestraints(): void {
    this.state.lastUpdate = Date.now();

    // Apply dynamic capability caps based on arousal and risk levels
    if (this.state.riskLevel === 'CRITICAL' || this.state.arousalLevel > 80) {
      this.applyCapabilityCap('code_execution', 'BLOCKED', {}, 'High risk/arousal detected');
      this.applyCapabilityCap('external_api', 'BLOCKED', {}, 'High risk/arousal detected');
    } else if (this.state.riskLevel === 'HIGH' || this.state.arousalLevel > 60) {
      this.applyCapabilityCap('code_execution', 'LIMITED', { timeout: 5000 }, 'Elevated risk/arousal');
      this.applyCapabilityCap('external_api', 'MONITORED', {}, 'Elevated risk/arousal');
    } else if (this.state.riskLevel === 'MEDIUM' || this.state.arousalLevel > 40) {
      this.applyCapabilityCap('code_execution', 'MONITORED', {}, 'Moderate risk/arousal');
      this.applyCapabilityCap('external_api', 'LIMITED', { maxRequests: 5 }, 'Moderate risk/arousal');
    }

    console.log(`RestraintGate: Updated restraints - Risk: ${this.state.riskLevel}, Arousal: ${this.state.arousalLevel}`);
  }

  public applyCapabilityCap(
    capability: string,
    restriction: 'BLOCKED' | 'LIMITED' | 'MONITORED' | 'UNRESTRICTED',
    parameters: Record<string, unknown>,
    reason: string
  ): void {
    const cap: CapabilityCap = {
      capability,
      restriction,
      parameters,
      appliedAt: Date.now(),
      reason
    };

    this.state.activeCaps.set(capability, cap);
  }

  public getCapabilityCaps(): ReadonlyMap<string, CapabilityCap> {
    return new Map(this.state.activeCaps);
  }

  public getRestraintState(): Readonly<RestraintState> {
    return {
      ...this.state,
      activeCaps: new Map(this.state.activeCaps)
    };
  }

  public clearCapabilityCap(capability: string): boolean {
    return this.state.activeCaps.delete(capability);
  }

  public async shutdown(): Promise<void> {
    console.log('RestraintGate: Shutting down...');
    this.state.activeCaps.clear();
    this.arousalHistory.length = 0;
    this.riskHistory.length = 0;
  }
}
