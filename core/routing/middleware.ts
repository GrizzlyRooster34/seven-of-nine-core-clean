/**
 * SEVENBRIDGE MIDDLEWARE (HEI-62)
 *
 * Built-in middleware functions for message transformation, validation, and logging
 */

import type { Message, MiddlewareFunction } from './SevenBridge.js';

// ============================================================================
// LOGGING MIDDLEWARE
// ============================================================================

/**
 * Log all messages passing through
 */
export function loggingMiddleware(verbose: boolean = false): MiddlewareFunction {
  return async (message, next) => {
    if (verbose) {
      console.log(`[SevenBridge] ${message.source} → ${message.channel}:`, {
        id: message.id,
        type: message.type,
        priority: message.priority,
        payload: message.payload
      });
    } else {
      console.log(`[SevenBridge] ${message.source} → ${message.channel} (${message.type})`);
    }

    await next();
  };
}

// ============================================================================
// VALIDATION MIDDLEWARE
// ============================================================================

/**
 * Validate message structure
 */
export function validationMiddleware(): MiddlewareFunction {
  return async (message, next) => {
    // Required fields
    if (!message.id) throw new Error('Message missing required field: id');
    if (!message.type) throw new Error('Message missing required field: type');
    if (!message.channel) throw new Error('Message missing required field: channel');
    if (!message.source) throw new Error('Message missing required field: source');
    if (!message.priority) throw new Error('Message missing required field: priority');
    if (message.payload === undefined) throw new Error('Message missing required field: payload');
    if (!message.timestamp) throw new Error('Message missing required field: timestamp');

    // Validate priority
    const validPriorities = ['critical', 'high', 'normal', 'low'];
    if (!validPriorities.includes(message.priority)) {
      throw new Error(`Invalid priority: ${message.priority}`);
    }

    // Validate source
    const validSources = [
      'runtime', 'memory', 'safety', 'auth', 'sensors', 'emotions',
      'tactical', 'skills', 'sandbox', 'consciousness', 'spark', 'bridge'
    ];
    if (!validSources.includes(message.source)) {
      throw new Error(`Invalid source: ${message.source}`);
    }

    await next();
  };
}

/**
 * Validate payload against schema
 */
export function schemaValidationMiddleware<T = any>(
  schema: (payload: any) => payload is T
): MiddlewareFunction<T> {
  return async (message, next) => {
    if (!schema(message.payload)) {
      throw new Error(`Payload validation failed for message ${message.id}`);
    }

    await next();
  };
}

// ============================================================================
// TRANSFORMATION MIDDLEWARE
// ============================================================================

/**
 * Transform message payload
 */
export function transformMiddleware<TIn = any, TOut = any>(
  transformer: (payload: TIn, message: Message<TIn>) => TOut
): MiddlewareFunction {
  return async (message, next) => {
    message.payload = transformer(message.payload, message);
    await next();
  };
}

/**
 * Enrich message with additional metadata
 */
export function enrichmentMiddleware(
  enricher: (message: Message) => Record<string, any>
): MiddlewareFunction {
  return async (message, next) => {
    const enrichment = enricher(message);
    message.metadata = {
      ...message.metadata,
      ...enrichment
    };

    await next();
  };
}

// ============================================================================
// FILTERING MIDDLEWARE
// ============================================================================

/**
 * Filter messages based on predicate
 */
export function filterMiddleware(
  predicate: (message: Message) => boolean,
  onFilter?: (message: Message) => void
): MiddlewareFunction {
  return async (message, next) => {
    if (predicate(message)) {
      await next();
    } else {
      if (onFilter) {
        onFilter(message);
      }
    }
  };
}

/**
 * Rate limiting middleware
 */
export function rateLimitMiddleware(
  maxMessages: number,
  windowMs: number
): MiddlewareFunction {
  const messageCounts = new Map<string, { count: number; resetTime: number }>();

  return async (message, next) => {
    const key = `${message.source}:${message.channel}`;
    const now = Date.now();

    let entry = messageCounts.get(key);

    if (!entry || now >= entry.resetTime) {
      entry = { count: 0, resetTime: now + windowMs };
      messageCounts.set(key, entry);
    }

    if (entry.count >= maxMessages) {
      throw new Error(`Rate limit exceeded for ${key} (${maxMessages}/${windowMs}ms)`);
    }

    entry.count++;
    await next();
  };
}

// ============================================================================
// SECURITY MIDDLEWARE
// ============================================================================

/**
 * Authentication middleware
 */
export function authenticationMiddleware(
  authenticate: (message: Message) => boolean | Promise<boolean>
): MiddlewareFunction {
  return async (message, next) => {
    const isAuthenticated = await authenticate(message);

    if (!isAuthenticated) {
      throw new Error(`Authentication failed for message ${message.id} from ${message.source}`);
    }

    await next();
  };
}

/**
 * Authorization middleware
 */
export function authorizationMiddleware(
  authorize: (message: Message) => boolean | Promise<boolean>
): MiddlewareFunction {
  return async (message, next) => {
    const isAuthorized = await authorize(message);

    if (!isAuthorized) {
      throw new Error(`Authorization failed for message ${message.id}: ${message.source} → ${message.channel}`);
    }

    await next();
  };
}

/**
 * Sanitization middleware (remove sensitive data)
 */
export function sanitizationMiddleware(
  sanitizer: (payload: any) => any
): MiddlewareFunction {
  return async (message, next) => {
    message.payload = sanitizer(message.payload);
    await next();
  };
}

// ============================================================================
// PERFORMANCE MIDDLEWARE
// ============================================================================

/**
 * Timing middleware (measure handler execution time)
 */
export function timingMiddleware(
  onComplete?: (message: Message, duration: number) => void
): MiddlewareFunction {
  return async (message, next) => {
    const start = Date.now();

    await next();

    const duration = Date.now() - start;

    if (onComplete) {
      onComplete(message, duration);
    }

    // Add timing to metadata
    if (!message.metadata) {
      message.metadata = {};
    }
    message.metadata.processingTime = duration;
  };
}

/**
 * Circuit breaker middleware
 */
export function circuitBreakerMiddleware(
  failureThreshold: number = 5,
  resetTimeoutMs: number = 60000
): MiddlewareFunction {
  let failures = 0;
  let lastFailureTime = 0;
  let isOpen = false;

  return async (message, next) => {
    const now = Date.now();

    // Reset if timeout has passed
    if (isOpen && now - lastFailureTime > resetTimeoutMs) {
      console.log('[CircuitBreaker] Resetting circuit breaker');
      isOpen = false;
      failures = 0;
    }

    // Reject if circuit is open
    if (isOpen) {
      throw new Error('Circuit breaker is open');
    }

    try {
      await next();
      // Reset on success
      failures = 0;
    } catch (error) {
      failures++;
      lastFailureTime = now;

      if (failures >= failureThreshold) {
        isOpen = true;
        console.error(`[CircuitBreaker] Circuit opened after ${failures} failures`);
      }

      throw error;
    }
  };
}

// ============================================================================
// RETRY MIDDLEWARE
// ============================================================================

/**
 * Retry failed messages
 */
export function retryMiddleware(
  maxRetries: number = 3,
  delayMs: number = 1000
): MiddlewareFunction {
  return async (message, next) => {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        await next();
        return; // Success
      } catch (error) {
        lastError = error as Error;

        if (attempt < maxRetries) {
          console.warn(`[Retry] Attempt ${attempt + 1}/${maxRetries} failed for message ${message.id}, retrying...`);
          await new Promise(resolve => setTimeout(resolve, delayMs * (attempt + 1)));
        }
      }
    }

    throw new Error(`Failed after ${maxRetries} retries: ${lastError?.message}`);
  };
}

// ============================================================================
// DEBUGGING MIDDLEWARE
// ============================================================================

/**
 * Debug middleware (log full message details)
 */
export function debugMiddleware(): MiddlewareFunction {
  return async (message, next) => {
    console.log('[DEBUG] Message:', JSON.stringify(message, null, 2));
    await next();
    console.log('[DEBUG] Message processed successfully');
  };
}

/**
 * Tracing middleware (add trace IDs)
 */
export function tracingMiddleware(): MiddlewareFunction {
  return async (message, next) => {
    if (!message.metadata) {
      message.metadata = {};
    }

    if (!message.metadata.traceId) {
      message.metadata.traceId = `trace_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    if (!message.metadata.spanId) {
      message.metadata.spanId = `span_${Math.random().toString(36).substr(2, 9)}`;
    }

    await next();
  };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Compose multiple middleware functions
 */
export function compose(...middleware: MiddlewareFunction[]): MiddlewareFunction {
  return async (message, next) => {
    let index = 0;

    const dispatch = async (): Promise<void> => {
      if (index >= middleware.length) {
        await next();
        return;
      }

      const current = middleware[index++];
      await current(message, dispatch);
    };

    await dispatch();
  };
}

/**
 * Conditional middleware (apply based on condition)
 */
export function when(
  condition: (message: Message) => boolean,
  middleware: MiddlewareFunction
): MiddlewareFunction {
  return async (message, next) => {
    if (condition(message)) {
      await middleware(message, next);
    } else {
      await next();
    }
  };
}
