/**
 * SEVENBRIDGE ROUTING LAYER TESTS (HEI-62)
 * Comprehensive test suite for message routing, pub/sub, middleware, and system integration
 */

import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import SevenBridge from '../../core/routing/SevenBridge.js';
import type { Message, MessageHandler, MiddlewareFunction } from '../../core/routing/SevenBridge.js';
import {
  loggingMiddleware,
  validationMiddleware,
  filterMiddleware,
  transformMiddleware,
  rateLimitMiddleware
} from '../../core/routing/middleware.js';

describe('SevenBridge Routing Layer', () => {
  let router: SevenBridge;

  beforeEach(() => {
    router = new SevenBridge();
  });

  afterEach(async () => {
    await router.shutdown();
  });

  // ============================================================================
  // BASIC PUB/SUB
  // ============================================================================

  describe('Basic Pub/Sub', () => {
    test('should publish and receive messages', async () => {
      let received: Message | null = null;

      router.subscribe('test:channel', (message) => {
        received = message;
      });

      await router.publish('test:message', { data: 'hello' }, {
        channel: 'test:channel',
        source: 'runtime'
      });

      // Wait for processing
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(received).not.toBeNull();
      expect(received?.type).toBe('test:message');
      expect(received?.payload).toEqual({ data: 'hello' });
    });

    test('should support multiple subscribers on same channel', async () => {
      const received: Message[] = [];

      router.subscribe('shared:channel', (msg) => received.push(msg));
      router.subscribe('shared:channel', (msg) => received.push(msg));
      router.subscribe('shared:channel', (msg) => received.push(msg));

      await router.publish('test', { value: 42 }, {
        channel: 'shared:channel',
        source: 'memory'
      });

      await new Promise(resolve => setTimeout(resolve, 50));

      expect(received.length).toBe(3);
      expect(received[0].payload).toEqual({ value: 42 });
    });

    test('should return unsubscribe function', async () => {
      let callCount = 0;

      const unsubscribe = router.subscribe('test:channel', () => {
        callCount++;
      });

      await router.publish('test', {}, { channel: 'test:channel', source: 'runtime' });
      await new Promise(resolve => setTimeout(resolve, 50));
      expect(callCount).toBe(1);

      // Unsubscribe
      unsubscribe();

      await router.publish('test', {}, { channel: 'test:channel', source: 'runtime' });
      await new Promise(resolve => setTimeout(resolve, 50));
      expect(callCount).toBe(1); // Should not increase
    });
  });

  // ============================================================================
  // PATTERN MATCHING
  // ============================================================================

  describe('Pattern Matching', () => {
    test('should match wildcard patterns', async () => {
      let received: Message | null = null;

      router.subscribePattern('test:*', (message) => {
        received = message;
      });

      await router.publish('something', { data: 'test' }, {
        channel: 'test:foo',
        source: 'runtime'
      });

      await new Promise(resolve => setTimeout(resolve, 50));

      expect(received).not.toBeNull();
      expect(received?.channel).toBe('test:foo');
    });

    test('should match regex patterns', async () => {
      let received: Message | null = null;

      router.subscribePattern(/^memory:.+/, (message) => {
        received = message;
      });

      await router.publish('mem-event', { data: 'test' }, {
        channel: 'memory:store',
        source: 'runtime'
      });

      await new Promise(resolve => setTimeout(resolve, 50));

      expect(received).not.toBeNull();
      expect(received?.channel).toBe('memory:store');
    });
  });

  // ============================================================================
  // REQUEST/REPLY
  // ============================================================================

  describe('Request/Reply Pattern', () => {
    test('should support request/reply', async () => {
      // Set up reply handler
      router.subscribe('test:request', async (message) => {
        await router.reply(message, { result: 'success' });
      });

      // Make request
      const response = await router.request('test:request', { query: 'hello' }, {
        channel: 'test:request',
        source: 'runtime'
      });

      expect(response.payload).toEqual({ result: 'success' });
    });

    test('should timeout on no reply', async () => {
      await expect(
        router.request('no:reply', { data: 'test' }, {
          channel: 'no:reply',
          source: 'runtime'
        }, 100)
      ).rejects.toThrow('Request timeout');
    });
  });

  // ============================================================================
  // PRIORITY QUEUE
  // ============================================================================

  describe('Priority Queue', () => {
    test('should process critical messages first', async () => {
      const processed: string[] = [];

      router.subscribe('priority:test', (message) => {
        processed.push(message.priority);
      });

      // Publish in reverse priority order
      await router.publish('test', {}, { channel: 'priority:test', source: 'runtime', priority: 'low' });
      await router.publish('test', {}, { channel: 'priority:test', source: 'runtime', priority: 'normal' });
      await router.publish('test', {}, { channel: 'priority:test', source: 'runtime', priority: 'high' });
      await router.publish('test', {}, { channel: 'priority:test', source: 'runtime', priority: 'critical' });

      await new Promise(resolve => setTimeout(resolve, 100));

      // Should be processed in priority order
      expect(processed[0]).toBe('critical');
      expect(processed[1]).toBe('high');
      expect(processed[2]).toBe('normal');
      expect(processed[3]).toBe('low');
    });
  });

  // ============================================================================
  // MIDDLEWARE
  // ============================================================================

  describe('Middleware', () => {
    test('should execute global middleware', async () => {
      let middlewareCalled = false;

      router.use(async (message, next) => {
        middlewareCalled = true;
        await next();
      });

      router.subscribe('test', () => {});
      await router.publish('test', {}, { channel: 'test', source: 'runtime' });
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(middlewareCalled).toBe(true);
    });

    test('should execute route-specific middleware', async () => {
      let routeMiddlewareCalled = false;

      const middleware: MiddlewareFunction = async (message, next) => {
        routeMiddlewareCalled = true;
        await next();
      };

      router.route('specific:channel', () => {}, [middleware]);

      await router.publish('test', {}, { channel: 'specific:channel', source: 'runtime' });
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(routeMiddlewareCalled).toBe(true);
    });

    test('should transform messages via middleware', async () => {
      let receivedPayload: any = null;

      const transformMw = transformMiddleware((payload: any) => {
        return { ...payload, transformed: true };
      });

      router.route('transform:test', (message) => {
        receivedPayload = message.payload;
      }, [transformMw]);

      await router.publish('test', { original: true }, {
        channel: 'transform:test',
        source: 'runtime'
      });

      await new Promise(resolve => setTimeout(resolve, 50));

      expect(receivedPayload).toEqual({ original: true, transformed: true });
    });

    test('should filter messages via middleware', async () => {
      let callCount = 0;

      const filterMw = filterMiddleware((message) => message.payload.allowed === true);

      router.route('filter:test', () => callCount++, [filterMw]);

      await router.publish('test', { allowed: false }, { channel: 'filter:test', source: 'runtime' });
      await router.publish('test', { allowed: true }, { channel: 'filter:test', source: 'runtime' });

      await new Promise(resolve => setTimeout(resolve, 50));

      expect(callCount).toBe(1); // Only one should pass filter
    });
  });

  // ============================================================================
  // TTL (Time To Live)
  // ============================================================================

  describe('TTL (Time To Live)', () => {
    test('should drop expired messages', async () => {
      let received = false;

      router.subscribe('ttl:test', () => {
        received = true;
      });

      // Publish with very short TTL
      await router.publish('test', {}, {
        channel: 'ttl:test',
        source: 'runtime',
        ttl: 10 // 10ms
      });

      // Wait for TTL to expire
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(received).toBe(false);
    });
  });

  // ============================================================================
  // TARGET ROUTING
  // ============================================================================

  describe('Target Routing', () => {
    test('should route to specific target', async () => {
      let receivedAtTarget = false;
      let receivedAtOther = false;

      router.subscribe('system:memory', () => {
        receivedAtTarget = true;
      });

      router.subscribe('system:safety', () => {
        receivedAtOther = true;
      });

      await router.publish('test', {}, {
        channel: 'test',
        source: 'runtime',
        target: 'memory'
      });

      await new Promise(resolve => setTimeout(resolve, 50));

      expect(receivedAtTarget).toBe(true);
      expect(receivedAtOther).toBe(false);
    });

    test('should broadcast to multiple targets', async () => {
      const received: string[] = [];

      router.subscribe('system:memory', () => received.push('memory'));
      router.subscribe('system:safety', () => received.push('safety'));
      router.subscribe('system:emotions', () => received.push('emotions'));

      await router.publish('test', {}, {
        channel: 'test',
        source: 'runtime',
        target: ['memory', 'safety', 'emotions']
      });

      await new Promise(resolve => setTimeout(resolve, 50));

      expect(received).toContain('memory');
      expect(received).toContain('safety');
      expect(received).toContain('emotions');
    });
  });

  // ============================================================================
  // METRICS
  // ============================================================================

  describe('Metrics', () => {
    test('should track routed messages', async () => {
      router.subscribe('test', () => {});

      await router.publish('test', {}, { channel: 'test', source: 'runtime' });
      await router.publish('test', {}, { channel: 'test', source: 'runtime' });
      await router.publish('test', {}, { channel: 'test', source: 'runtime' });

      await new Promise(resolve => setTimeout(resolve, 50));

      const metrics = router.getMetrics();
      expect(metrics.messagesRouted).toBe(3);
    });

    test('should track messages by priority', async () => {
      router.subscribe('test', () => {});

      await router.publish('test', {}, { channel: 'test', source: 'runtime', priority: 'critical' });
      await router.publish('test', {}, { channel: 'test', source: 'runtime', priority: 'high' });
      await router.publish('test', {}, { channel: 'test', source: 'runtime', priority: 'normal' });

      await new Promise(resolve => setTimeout(resolve, 50));

      const metrics = router.getMetrics();
      expect(metrics.messagesByPriority.critical).toBe(1);
      expect(metrics.messagesByPriority.high).toBe(1);
      expect(metrics.messagesByPriority.normal).toBe(1);
    });

    test('should track messages by channel', async () => {
      router.subscribe('channel1', () => {});
      router.subscribe('channel2', () => {});

      await router.publish('test', {}, { channel: 'channel1', source: 'runtime' });
      await router.publish('test', {}, { channel: 'channel1', source: 'runtime' });
      await router.publish('test', {}, { channel: 'channel2', source: 'runtime' });

      await new Promise(resolve => setTimeout(resolve, 50));

      const metrics = router.getMetrics();
      expect(metrics.messagesByChannel['channel1']).toBe(2);
      expect(metrics.messagesByChannel['channel2']).toBe(1);
    });

    test('should reset metrics', async () => {
      router.subscribe('test', () => {});

      await router.publish('test', {}, { channel: 'test', source: 'runtime' });
      await new Promise(resolve => setTimeout(resolve, 50));

      let metrics = router.getMetrics();
      expect(metrics.messagesRouted).toBe(1);

      router.resetMetrics();

      metrics = router.getMetrics();
      expect(metrics.messagesRouted).toBe(0);
    });
  });

  // ============================================================================
  // DEAD LETTER QUEUE
  // ============================================================================

  describe('Dead Letter Queue', () => {
    test('should capture failed messages', async () => {
      router.subscribe('test', () => {
        throw new Error('Handler failed');
      });

      await router.publish('test', {}, { channel: 'test', source: 'runtime' });
      await new Promise(resolve => setTimeout(resolve, 50));

      const deadLetters = router.getDeadLetterQueue();
      expect(deadLetters.length).toBe(1);
      expect(deadLetters[0].error.message).toBe('Handler failed');
    });

    test('should replay dead letter messages', async () => {
      let attempts = 0;

      router.subscribe('test', () => {
        attempts++;
        if (attempts === 1) {
          throw new Error('First attempt failed');
        }
      });

      await router.publish('test', { data: 'retry-me' }, { channel: 'test', source: 'runtime' });
      await new Promise(resolve => setTimeout(resolve, 50));

      const deadLetters = router.getDeadLetterQueue();
      expect(deadLetters.length).toBe(1);

      const messageId = deadLetters[0].message.id;
      await router.replayDeadLetter(messageId);

      await new Promise(resolve => setTimeout(resolve, 50));

      expect(attempts).toBe(2); // Original attempt + replay
    });
  });

  // ============================================================================
  // QUEUE STATUS
  // ============================================================================

  describe('Queue Status', () => {
    test('should report queue status', () => {
      const status = router.getQueueStatus();

      expect(status).toHaveProperty('queueSize');
      expect(status).toHaveProperty('maxQueueSize');
      expect(status).toHaveProperty('deadLetterSize');
      expect(status).toHaveProperty('maxDeadLetterSize');
      expect(status).toHaveProperty('isProcessing');

      expect(typeof status.queueSize).toBe('number');
      expect(typeof status.maxQueueSize).toBe('number');
    });
  });

  // ============================================================================
  // SHUTDOWN
  // ============================================================================

  describe('Shutdown', () => {
    test('should shutdown gracefully', async () => {
      router.subscribe('test', () => {});

      await router.shutdown();

      // Should clear all routes and subscribers
      const status = router.getQueueStatus();
      expect(status.queueSize).toBe(0);
    });
  });
});
