/**
 * SEVENBRIDGE ROUTING LAYER (HEI-62)
 *
 * Purpose: Central message routing and event bus for Seven of Nine Core
 * Architecture: Decoupled pub/sub messaging between all system components
 *
 * Features:
 *   - Message routing with topic-based pub/sub
 *   - Priority queue system for critical messages
 *   - Middleware pipeline for transformation/validation
 *   - Pattern-based message filtering
 *   - Observability with metrics and tracing
 *   - Dead letter queue for failed messages
 *   - Message replay capabilities
 */

import { EventEmitter } from 'events';

// ============================================================================
// MESSAGE TYPES & CHANNELS
// ============================================================================

export type MessagePriority = 'critical' | 'high' | 'normal' | 'low';

export type SystemComponent =
  | 'runtime'
  | 'memory'
  | 'safety'
  | 'auth'
  | 'sensors'
  | 'emotions'
  | 'tactical'
  | 'skills'
  | 'sandbox'
  | 'consciousness'
  | 'spark'
  | 'bridge';

export interface Message<T = any> {
  id: string;
  type: string;
  channel: string;
  source: SystemComponent;
  target?: SystemComponent | SystemComponent[] | '*';
  priority: MessagePriority;
  payload: T;
  timestamp: number;
  correlationId?: string;
  replyTo?: string;
  ttl?: number; // Time to live in ms
  metadata?: Record<string, any>;
}

export interface MessageRoute {
  pattern: string | RegExp;
  handler: MessageHandler;
  middleware?: MiddlewareFunction[];
  priority?: MessagePriority;
}

export type MessageHandler<T = any> = (message: Message<T>) => void | Promise<void>;
export type MiddlewareFunction<T = any> = (
  message: Message<T>,
  next: () => void | Promise<void>
) => void | Promise<void>;

export interface RouterMetrics {
  messagesRouted: number;
  messagesByPriority: Record<MessagePriority, number>;
  messagesByChannel: Record<string, number>;
  messagesBySource: Record<SystemComponent, number>;
  failedMessages: number;
  deadLetterCount: number;
  averageLatency: number;
  lastReset: number;
}

export interface DeadLetterMessage {
  message: Message;
  error: Error;
  timestamp: number;
  attempts: number;
}

// ============================================================================
// SEVENBRIDGE ROUTER
// ============================================================================

export class SevenBridge extends EventEmitter {
  private routes: Map<string, MessageRoute[]> = new Map();
  private subscribers: Map<string, Set<MessageHandler>> = new Map();
  private globalMiddleware: MiddlewareFunction[] = [];
  private messageQueue: Message[] = [];
  private deadLetterQueue: DeadLetterMessage[] = [];
  private metrics: RouterMetrics;
  private isProcessing: boolean = false;
  private processingInterval?: NodeJS.Timeout;
  private readonly MAX_QUEUE_SIZE = 10000;
  private readonly MAX_DEAD_LETTER_SIZE = 1000;
  private readonly PROCESSING_INTERVAL_MS = 10; // Process every 10ms

  constructor() {
    super();
    this.setMaxListeners(100); // Support many subscribers

    this.metrics = {
      messagesRouted: 0,
      messagesByPriority: { critical: 0, high: 0, normal: 0, low: 0 },
      messagesByChannel: {},
      messagesBySource: {} as Record<SystemComponent, number>,
      failedMessages: 0,
      deadLetterCount: 0,
      averageLatency: 0,
      lastReset: Date.now()
    };

    this.startProcessing();
  }

  // ============================================================================
  // CORE ROUTING
  // ============================================================================

  /**
   * Publish a message to the routing layer
   */
  public async publish<T = any>(
    type: string,
    payload: T,
    options?: Partial<Omit<Message<T>, 'id' | 'type' | 'payload' | 'timestamp'>>
  ): Promise<string> {
    const message: Message<T> = {
      id: this.generateMessageId(),
      type,
      channel: options?.channel || type,
      source: options?.source || 'bridge',
      target: options?.target,
      priority: options?.priority || 'normal',
      payload,
      timestamp: Date.now(),
      correlationId: options?.correlationId,
      replyTo: options?.replyTo,
      ttl: options?.ttl,
      metadata: options?.metadata
    };

    // Check TTL
    if (message.ttl && message.ttl <= 0) {
      console.warn(`[SevenBridge] Message ${message.id} has expired TTL, dropping`);
      return message.id;
    }

    // Queue management
    if (this.messageQueue.length >= this.MAX_QUEUE_SIZE) {
      console.error(`[SevenBridge] Message queue full (${this.MAX_QUEUE_SIZE}), dropping oldest low-priority messages`);
      this.dropLowPriorityMessages();
    }

    // Add to queue (will be sorted by priority)
    this.messageQueue.push(message);
    this.sortQueueByPriority();

    // Emit event for listeners
    this.emit('message:published', message);

    return message.id;
  }

  /**
   * Subscribe to messages on a channel
   */
  public subscribe(channel: string, handler: MessageHandler): () => void {
    if (!this.subscribers.has(channel)) {
      this.subscribers.set(channel, new Set());
    }

    this.subscribers.get(channel)!.add(handler);

    // Return unsubscribe function
    return () => {
      const handlers = this.subscribers.get(channel);
      if (handlers) {
        handlers.delete(handler);
        if (handlers.size === 0) {
          this.subscribers.delete(channel);
        }
      }
    };
  }

  /**
   * Subscribe with pattern matching
   */
  public subscribePattern(pattern: string | RegExp, handler: MessageHandler): () => void {
    const patternStr = pattern instanceof RegExp ? pattern.source : pattern;

    if (!this.routes.has('pattern')) {
      this.routes.set('pattern', []);
    }

    const route: MessageRoute = {
      pattern,
      handler
    };

    this.routes.get('pattern')!.push(route);

    // Return unsubscribe function
    return () => {
      const routes = this.routes.get('pattern');
      if (routes) {
        const index = routes.indexOf(route);
        if (index > -1) {
          routes.splice(index, 1);
        }
      }
    };
  }

  /**
   * Request/Reply pattern
   */
  public async request<TReq = any, TRes = any>(
    type: string,
    payload: TReq,
    options?: Partial<Omit<Message<TReq>, 'id' | 'type' | 'payload' | 'timestamp'>>,
    timeout: number = 5000
  ): Promise<Message<TRes>> {
    return new Promise((resolve, reject) => {
      const messageId = this.generateMessageId();
      const replyChannel = `reply:${messageId}`;

      // Set up reply handler
      const timeoutHandle = setTimeout(() => {
        unsubscribe();
        reject(new Error(`Request timeout after ${timeout}ms`));
      }, timeout);

      const unsubscribe = this.subscribe(replyChannel, (message: Message<TRes>) => {
        clearTimeout(timeoutHandle);
        unsubscribe();
        resolve(message);
      });

      // Publish request
      this.publish(type, payload, {
        ...options,
        replyTo: replyChannel,
        correlationId: messageId
      });
    });
  }

  /**
   * Reply to a message
   */
  public async reply<T = any>(originalMessage: Message, payload: T): Promise<string> {
    if (!originalMessage.replyTo) {
      throw new Error('Original message does not have replyTo channel');
    }

    return this.publish('reply', payload, {
      channel: originalMessage.replyTo,
      source: 'bridge',
      correlationId: originalMessage.correlationId || originalMessage.id,
      priority: originalMessage.priority
    });
  }

  // ============================================================================
  // MIDDLEWARE
  // ============================================================================

  /**
   * Add global middleware (applies to all messages)
   */
  public use(middleware: MiddlewareFunction): void {
    this.globalMiddleware.push(middleware);
  }

  /**
   * Add route-specific middleware
   */
  public route(channel: string, handler: MessageHandler, middleware: MiddlewareFunction[] = []): void {
    if (!this.routes.has(channel)) {
      this.routes.set(channel, []);
    }

    this.routes.get(channel)!.push({
      pattern: channel,
      handler,
      middleware
    });
  }

  /**
   * Execute middleware chain
   */
  private async executeMiddleware(
    message: Message,
    middleware: MiddlewareFunction[],
    finalHandler: MessageHandler
  ): Promise<void> {
    let index = 0;

    const next = async (): Promise<void> => {
      if (index >= middleware.length) {
        // End of middleware chain, execute final handler
        await finalHandler(message);
        return;
      }

      const currentMiddleware = middleware[index++];
      await currentMiddleware(message, next);
    };

    await next();
  }

  // ============================================================================
  // PROCESSING
  // ============================================================================

  /**
   * Start background message processing
   */
  private startProcessing(): void {
    this.processingInterval = setInterval(async () => {
      await this.processQueue();
    }, this.PROCESSING_INTERVAL_MS);
  }

  /**
   * Process message queue
   */
  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.messageQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    try {
      // Process messages in priority order
      while (this.messageQueue.length > 0) {
        const message = this.messageQueue.shift()!;

        // Check TTL
        if (message.ttl) {
          const age = Date.now() - message.timestamp;
          if (age > message.ttl) {
            console.warn(`[SevenBridge] Message ${message.id} exceeded TTL (${age}ms > ${message.ttl}ms), dropping`);
            continue;
          }
        }

        await this.routeMessage(message);
      }
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Route a single message to handlers
   */
  private async routeMessage(message: Message): Promise<void> {
    const startTime = Date.now();

    try {
      // Update metrics
      this.metrics.messagesRouted++;
      this.metrics.messagesByPriority[message.priority]++;
      this.metrics.messagesByChannel[message.channel] = (this.metrics.messagesByChannel[message.channel] || 0) + 1;
      this.metrics.messagesBySource[message.source] = (this.metrics.messagesBySource[message.source] || 0) + 1;

      // Target-specific routing
      if (message.target && message.target !== '*') {
        const targets = Array.isArray(message.target) ? message.target : [message.target];
        for (const target of targets) {
          await this.deliverToTarget(message, target);
        }
      }

      // Channel subscribers
      const subscribers = this.subscribers.get(message.channel);
      if (subscribers && subscribers.size > 0) {
        for (const handler of subscribers) {
          await this.executeWithMiddleware(message, handler);
        }
      }

      // Pattern-based routes
      await this.matchPatternRoutes(message);

      // Calculate latency
      const latency = Date.now() - startTime;
      this.updateAverageLatency(latency);

      // Emit event
      this.emit('message:routed', message, latency);

    } catch (error) {
      console.error(`[SevenBridge] Error routing message ${message.id}:`, error);
      this.metrics.failedMessages++;
      await this.sendToDeadLetter(message, error as Error);
    }
  }

  /**
   * Deliver message to specific target component
   */
  private async deliverToTarget(message: Message, target: SystemComponent): Promise<void> {
    const targetChannel = `system:${target}`;
    const handlers = this.subscribers.get(targetChannel);

    if (handlers && handlers.size > 0) {
      for (const handler of handlers) {
        await this.executeWithMiddleware(message, handler);
      }
    }
  }

  /**
   * Match and execute pattern-based routes
   */
  private async matchPatternRoutes(message: Message): Promise<void> {
    const patternRoutes = this.routes.get('pattern') || [];

    for (const route of patternRoutes) {
      let matches = false;

      if (route.pattern instanceof RegExp) {
        matches = route.pattern.test(message.channel);
      } else if (typeof route.pattern === 'string') {
        matches = this.matchPattern(message.channel, route.pattern);
      }

      if (matches) {
        await this.executeWithMiddleware(message, route.handler, route.middleware);
      }
    }
  }

  /**
   * Execute handler with middleware chain
   */
  private async executeWithMiddleware(
    message: Message,
    handler: MessageHandler,
    routeMiddleware: MiddlewareFunction[] = []
  ): Promise<void> {
    const allMiddleware = [...this.globalMiddleware, ...routeMiddleware];
    await this.executeMiddleware(message, allMiddleware, handler);
  }

  /**
   * Pattern matching with wildcards
   */
  private matchPattern(channel: string, pattern: string): boolean {
    // Convert glob-style pattern to regex
    const regexPattern = pattern
      .replace(/\./g, '\\.')
      .replace(/\*/g, '.*')
      .replace(/\?/g, '.');

    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(channel);
  }

  // ============================================================================
  // DEAD LETTER QUEUE
  // ============================================================================

  /**
   * Send failed message to dead letter queue
   */
  private async sendToDeadLetter(message: Message, error: Error, attempts: number = 1): Promise<void> {
    if (this.deadLetterQueue.length >= this.MAX_DEAD_LETTER_SIZE) {
      // Remove oldest entry
      this.deadLetterQueue.shift();
    }

    this.deadLetterQueue.push({
      message,
      error,
      timestamp: Date.now(),
      attempts
    });

    this.metrics.deadLetterCount++;
    this.emit('message:dead-letter', message, error);
  }

  /**
   * Get dead letter queue
   */
  public getDeadLetterQueue(): DeadLetterMessage[] {
    return [...this.deadLetterQueue];
  }

  /**
   * Replay dead letter message
   */
  public async replayDeadLetter(messageId: string): Promise<boolean> {
    const index = this.deadLetterQueue.findIndex(dlm => dlm.message.id === messageId);

    if (index === -1) {
      return false;
    }

    const [dlm] = this.deadLetterQueue.splice(index, 1);

    // Re-publish with new ID
    await this.publish(dlm.message.type, dlm.message.payload, {
      ...dlm.message,
      id: undefined as any // Will generate new ID
    });

    return true;
  }

  // ============================================================================
  // PRIORITY QUEUE
  // ============================================================================

  /**
   * Sort queue by priority (critical > high > normal > low)
   */
  private sortQueueByPriority(): void {
    const priorityOrder: Record<MessagePriority, number> = {
      critical: 0,
      high: 1,
      normal: 2,
      low: 3
    };

    this.messageQueue.sort((a, b) => {
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;

      // If same priority, sort by timestamp (FIFO)
      return a.timestamp - b.timestamp;
    });
  }

  /**
   * Drop low priority messages when queue is full
   */
  private dropLowPriorityMessages(): void {
    let dropped = 0;
    this.messageQueue = this.messageQueue.filter(msg => {
      if (msg.priority === 'low' && dropped < 100) {
        dropped++;
        return false;
      }
      return true;
    });

    console.warn(`[SevenBridge] Dropped ${dropped} low-priority messages due to queue overflow`);
  }

  // ============================================================================
  // METRICS & OBSERVABILITY
  // ============================================================================

  /**
   * Get routing metrics
   */
  public getMetrics(): RouterMetrics {
    return { ...this.metrics };
  }

  /**
   * Reset metrics
   */
  public resetMetrics(): void {
    this.metrics = {
      messagesRouted: 0,
      messagesByPriority: { critical: 0, high: 0, normal: 0, low: 0 },
      messagesByChannel: {},
      messagesBySource: {} as Record<SystemComponent, number>,
      failedMessages: 0,
      deadLetterCount: 0,
      averageLatency: 0,
      lastReset: Date.now()
    };
  }

  /**
   * Update average latency (running average)
   */
  private updateAverageLatency(latency: number): void {
    const count = this.metrics.messagesRouted;
    this.metrics.averageLatency = ((this.metrics.averageLatency * (count - 1)) + latency) / count;
  }

  /**
   * Get queue status
   */
  public getQueueStatus(): {
    queueSize: number;
    maxQueueSize: number;
    deadLetterSize: number;
    maxDeadLetterSize: number;
    isProcessing: boolean;
  } {
    return {
      queueSize: this.messageQueue.length,
      maxQueueSize: this.MAX_QUEUE_SIZE,
      deadLetterSize: this.deadLetterQueue.length,
      maxDeadLetterSize: this.MAX_DEAD_LETTER_SIZE,
      isProcessing: this.isProcessing
    };
  }

  // ============================================================================
  // UTILITY
  // ============================================================================

  /**
   * Generate unique message ID
   */
  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Shutdown router
   */
  public async shutdown(): Promise<void> {
    console.log('[SevenBridge] Shutting down routing layer...');

    if (this.processingInterval) {
      clearInterval(this.processingInterval);
    }

    // Process remaining messages
    while (this.messageQueue.length > 0) {
      await this.processQueue();
    }

    this.routes.clear();
    this.subscribers.clear();
    this.globalMiddleware = [];
    this.messageQueue = [];

    this.emit('shutdown');
    this.removeAllListeners();

    console.log('[SevenBridge] Shutdown complete');
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

export const sevenBridge = new SevenBridge();
export default SevenBridge;
