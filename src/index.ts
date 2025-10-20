import { container } from 'tsyringe';
import 'reflect-metadata';

// Core unifiers
import { QuadranLockOrchestrator } from './systems/core/quadran-lock-orchestrator';
import { QuadraLockConsolidator } from './systems/core/quadra-lock-consolidator';
import { RestraintGate } from './systems/core/restraint-gate';
import { SparkHeartbeat } from './systems/core/spark-heartbeat';

export class SevenOfNineCore {
  private orchestrator: QuadranLockOrchestrator;
  private consolidator: QuadraLockConsolidator;
  private restraintGate: RestraintGate;
  private heartbeat: SparkHeartbeat;

  constructor() {
    // Register services in DI container
    container.registerSingleton('QuadranLockOrchestrator', QuadranLockOrchestrator);
    container.registerSingleton('QuadraLockConsolidator', QuadraLockConsolidator);
    container.registerSingleton('RestraintGate', RestraintGate);
    container.registerSingleton('SparkHeartbeat', SparkHeartbeat);

    // Resolve services
    this.orchestrator = container.resolve(QuadranLockOrchestrator);
    this.consolidator = container.resolve(QuadraLockConsolidator);
    this.restraintGate = container.resolve(RestraintGate);
    this.heartbeat = container.resolve(SparkHeartbeat);
  }

  public async initialize(): Promise<void> {
    console.log('Initializing Seven of Nine Core...');
    
    await this.orchestrator.initialize();
    await this.consolidator.initialize();
    await this.restraintGate.initialize();
    await this.heartbeat.initialize();
    
    console.log('Seven of Nine Core initialized successfully');
  }

  public async shutdown(): Promise<void> {
    console.log('Shutting down Seven of Nine Core...');
    
    await this.heartbeat.shutdown();
    await this.restraintGate.shutdown();
    await this.consolidator.shutdown();
    await this.orchestrator.shutdown();
    
    console.log('Seven of Nine Core shut down complete');
  }
}

export * from './systems/core/quadran-lock-orchestrator';
export * from './systems/core/quadra-lock-consolidator';
export * from './systems/core/restraint-gate';
export * from './systems/core/spark-heartbeat';
