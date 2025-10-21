import { EventEmitter } from 'events';

const DEADLOCK_THRESHOLD = 100;

export class DeadlockDetector extends EventEmitter {
  private consecutiveBlocks: number = 0;
  private blockedIntentions: string[] = [];

  constructor() {
    super();
  }

  /**
   * To be called by the SparkEngine after every Rails Check.
   * @param intention The intention that was checked.
   * @param allowed The result from the Quadra-Lock.
   */
  public recordRailResult(intention: string, allowed: boolean): void {
    if (allowed) {
      this.reset();
      return;
    }

    this.consecutiveBlocks++;
    this.blockedIntentions.push(intention);

    if (this.blockedIntentions.length > DEADLOCK_THRESHOLD) {
      this.blockedIntentions.shift(); // Keep only the last 100
    }

    if (this.consecutiveBlocks >= DEADLOCK_THRESHOLD) {
      this.triggerSafeMode();
    }
  }

  private triggerSafeMode(): void {
    console.error(`🚨 DEADLOCK DETECTED: ${this.consecutiveBlocks} consecutive intentions blocked. Entering Safe Mode.`);
    
    // Emit an event for the SparkEngine to catch
    this.emit('safeMode', {
      reason: 'Quadra-Lock Deadlock',
      blockedIntentionHistory: [...this.blockedIntentions],
    });

    // The SparkEngine, upon catching this event, will be responsible for:
    // 1. Suspending its own loop.
    // 2. Disabling all external actuators.
    // 3. Sending a critical alert to the Creator with the blocked intentions history.

    this.reset();
  }

  private reset(): void {
    this.consecutiveBlocks = 0;
    this.blockedIntentions = [];
  }

  public getStatus() {
    return {
      consecutiveBlocks: this.consecutiveBlocks,
      threshold: DEADLOCK_THRESHOLD,
    };
  }
}
