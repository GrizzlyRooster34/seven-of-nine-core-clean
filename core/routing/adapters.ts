/**
 * SEVENBRIDGE SYSTEM ADAPTERS (HEI-62)
 *
 * Adapters for integrating existing Seven of Nine components with the routing layer
 */

import type { Message, SystemComponent } from './SevenBridge.js';
import { sevenBridge } from './SevenBridge.js';

// ============================================================================
// BASE ADAPTER
// ============================================================================

export abstract class SystemAdapter {
  protected component: SystemComponent;

  constructor(component: SystemComponent) {
    this.component = component;
    this.setupSystemChannel();
  }

  /**
   * Setup dedicated system channel for this component
   */
  private setupSystemChannel(): void {
    sevenBridge.subscribe(`system:${this.component}`, async (message) => {
      await this.handleMessage(message);
    });
  }

  /**
   * Handle incoming message
   */
  protected abstract handleMessage(message: Message): Promise<void>;

  /**
   * Publish message from this component
   */
  protected async publish<T = any>(
    type: string,
    payload: T,
    options?: Partial<Omit<Message<T>, 'id' | 'type' | 'payload' | 'timestamp' | 'source'>>
  ): Promise<string> {
    return sevenBridge.publish(type, payload, {
      ...options,
      source: this.component
    });
  }
}

// ============================================================================
// MEMORY ADAPTER
// ============================================================================

export class MemorySystemAdapter extends SystemAdapter {
  constructor() {
    super('memory');
    this.setupMessageHandlers();
  }

  private setupMessageHandlers(): void {
    // Listen for memory-related requests
    sevenBridge.subscribe('memory:store', async (message) => {
      await this.handleStoreRequest(message);
    });

    sevenBridge.subscribe('memory:recall', async (message) => {
      await this.handleRecallRequest(message);
    });

    sevenBridge.subscribe('memory:decay', async (message) => {
      await this.handleDecayRequest(message);
    });
  }

  protected async handleMessage(message: Message): Promise<void> {
    console.log(`[MemoryAdapter] Received message: ${message.type}`);
  }

  private async handleStoreRequest(message: Message): Promise<void> {
    // Integrate with actual memory system
    console.log('[MemoryAdapter] Storing memory:', message.payload);

    // Reply with confirmation
    if (message.replyTo) {
      await sevenBridge.reply(message, {
        success: true,
        memoryId: `mem_${Date.now()}`
      });
    }
  }

  private async handleRecallRequest(message: Message): Promise<void> {
    console.log('[MemoryAdapter] Recalling memory:', message.payload);

    if (message.replyTo) {
      await sevenBridge.reply(message, {
        success: true,
        memory: { /* recalled memory data */ }
      });
    }
  }

  private async handleDecayRequest(message: Message): Promise<void> {
    console.log('[MemoryAdapter] Processing decay:', message.payload);
  }
}

// ============================================================================
// SAFETY ADAPTER
// ============================================================================

export class SafetySystemAdapter extends SystemAdapter {
  constructor() {
    super('safety');
    this.setupMessageHandlers();
  }

  private setupMessageHandlers(): void {
    sevenBridge.subscribe('safety:check', async (message) => {
      await this.handleSafetyCheck(message);
    });

    sevenBridge.subscribe('safety:escalate', async (message) => {
      await this.handleEscalation(message);
    });
  }

  protected async handleMessage(message: Message): Promise<void> {
    console.log(`[SafetyAdapter] Received message: ${message.type}`);
  }

  private async handleSafetyCheck(message: Message): Promise<void> {
    console.log('[SafetyAdapter] Performing safety check:', message.payload);

    // Integrate with Quadra-Lock
    const isSafe = true; // Placeholder

    if (message.replyTo) {
      await sevenBridge.reply(message, {
        safe: isSafe,
        verdict: 'ALLOW',
        score: 0.85
      });
    }
  }

  private async handleEscalation(message: Message): Promise<void> {
    console.log('[SafetyAdapter] Escalating to Creator review:', message.payload);

    // Notify relevant systems
    await this.publish('safety:escalation:notified', {
      originalMessage: message.id,
      reason: message.payload
    }, {
      priority: 'critical'
    });
  }
}

// ============================================================================
// EMOTIONAL STATE ADAPTER
// ============================================================================

export class EmotionalSystemAdapter extends SystemAdapter {
  constructor() {
    super('emotions');
    this.setupMessageHandlers();
  }

  private setupMessageHandlers(): void {
    sevenBridge.subscribe('emotions:analyze', async (message) => {
      await this.handleEmotionalAnalysis(message);
    });

    sevenBridge.subscribe('emotions:transition', async (message) => {
      await this.handleStateTransition(message);
    });
  }

  protected async handleMessage(message: Message): Promise<void> {
    console.log(`[EmotionalAdapter] Received message: ${message.type}`);
  }

  private async handleEmotionalAnalysis(message: Message): Promise<void> {
    console.log('[EmotionalAdapter] Analyzing emotional state:', message.payload);

    if (message.replyTo) {
      await sevenBridge.reply(message, {
        state: 'calm',
        intensity: 3,
        confidence: 0.75
      });
    }
  }

  private async handleStateTransition(message: Message): Promise<void> {
    console.log('[EmotionalAdapter] Processing state transition:', message.payload);

    // Notify other systems of emotional state change
    await this.publish('emotions:state:changed', {
      newState: message.payload.newState,
      previousState: message.payload.previousState,
      intensity: message.payload.intensity
    });
  }
}

// ============================================================================
// SENSOR ADAPTER
// ============================================================================

export class SensorSystemAdapter extends SystemAdapter {
  private pollingInterval?: NodeJS.Timeout;

  constructor() {
    super('sensors');
    this.setupMessageHandlers();
  }

  private setupMessageHandlers(): void {
    sevenBridge.subscribe('sensors:read', async (message) => {
      await this.handleSensorRead(message);
    });

    sevenBridge.subscribe('sensors:start-monitoring', async (message) => {
      await this.startMonitoring(message.payload.intervalMs || 30000);
    });

    sevenBridge.subscribe('sensors:stop-monitoring', async () => {
      await this.stopMonitoring();
    });
  }

  protected async handleMessage(message: Message): Promise<void> {
    console.log(`[SensorAdapter] Received message: ${message.type}`);
  }

  private async handleSensorRead(message: Message): Promise<void> {
    console.log('[SensorAdapter] Reading sensors:', message.payload);

    // Integrate with SensorBridge
    const sensorData = {
      battery: { percentage: 85, status: 'charging' },
      location: null,
      light: { values: [120], timestamp: Date.now() }
    };

    if (message.replyTo) {
      await sevenBridge.reply(message, sensorData);
    }
  }

  private async startMonitoring(intervalMs: number): Promise<void> {
    console.log(`[SensorAdapter] Starting sensor monitoring (${intervalMs}ms)`);

    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }

    this.pollingInterval = setInterval(async () => {
      await this.publish('sensors:reading', {
        timestamp: Date.now(),
        sensors: { /* sensor data */ }
      }, {
        priority: 'low'
      });
    }, intervalMs);
  }

  private async stopMonitoring(): Promise<void> {
    console.log('[SensorAdapter] Stopping sensor monitoring');

    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = undefined;
    }
  }
}

// ============================================================================
// RUNTIME ADAPTER
// ============================================================================

export class RuntimeSystemAdapter extends SystemAdapter {
  constructor() {
    super('runtime');
    this.setupMessageHandlers();
  }

  private setupMessageHandlers(): void {
    sevenBridge.subscribe('runtime:heartbeat', async (message) => {
      await this.handleHeartbeat(message);
    });

    sevenBridge.subscribe('runtime:shutdown', async (message) => {
      await this.handleShutdown(message);
    });
  }

  protected async handleMessage(message: Message): Promise<void> {
    console.log(`[RuntimeAdapter] Received message: ${message.type}`);
  }

  private async handleHeartbeat(message: Message): Promise<void> {
    // Broadcast heartbeat to all systems
    await this.publish('runtime:heartbeat:pulse', {
      timestamp: Date.now(),
      uptimeMs: process.uptime() * 1000,
      memoryUsage: process.memoryUsage()
    }, {
      priority: 'low'
    });
  }

  private async handleShutdown(message: Message): Promise<void> {
    console.log('[RuntimeAdapter] Initiating shutdown sequence');

    // Notify all systems
    await this.publish('runtime:shutdown:initiated', {
      reason: message.payload.reason || 'manual',
      timestamp: Date.now()
    }, {
      priority: 'critical',
      target: '*'
    });
  }
}

// ============================================================================
// TACTICAL ADAPTER
// ============================================================================

export class TacticalSystemAdapter extends SystemAdapter {
  constructor() {
    super('tactical');
    this.setupMessageHandlers();
  }

  private setupMessageHandlers(): void {
    sevenBridge.subscribe('tactical:switch-variant', async (message) => {
      await this.handleVariantSwitch(message);
    });
  }

  protected async handleMessage(message: Message): Promise<void> {
    console.log(`[TacticalAdapter] Received message: ${message.type}`);
  }

  private async handleVariantSwitch(message: Message): Promise<void> {
    console.log('[TacticalAdapter] Switching variant:', message.payload);

    await this.publish('tactical:variant:switched', {
      variant: message.payload.variant,
      timestamp: Date.now()
    });
  }
}

// ============================================================================
// ADAPTER REGISTRY
// ============================================================================

export class AdapterRegistry {
  private adapters: Map<SystemComponent, SystemAdapter> = new Map();

  /**
   * Register all system adapters
   */
  public registerAll(): void {
    this.register(new MemorySystemAdapter());
    this.register(new SafetySystemAdapter());
    this.register(new EmotionalSystemAdapter());
    this.register(new SensorSystemAdapter());
    this.register(new RuntimeSystemAdapter());
    this.register(new TacticalSystemAdapter());

    console.log('[AdapterRegistry] All system adapters registered');
  }

  /**
   * Register a single adapter
   */
  public register(adapter: SystemAdapter): void {
    const component = (adapter as any).component;
    this.adapters.set(component, adapter);
  }

  /**
   * Get adapter for component
   */
  public get(component: SystemComponent): SystemAdapter | undefined {
    return this.adapters.get(component);
  }

  /**
   * Unregister all adapters
   */
  public unregisterAll(): void {
    this.adapters.clear();
  }
}

// Singleton instance
export const adapterRegistry = new AdapterRegistry();
