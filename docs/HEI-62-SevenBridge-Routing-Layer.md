# HEI-62: SevenBridge Routing Layer

## Overview

The **SevenBridge Routing Layer** is a comprehensive message routing and event bus system that provides decoupled communication between all Seven of Nine Core components. It enables loosely-coupled, event-driven architecture with robust reliability features.

**Status:** ✅ Implemented
**Location:** `core/routing/`
**Architecture:** Event-driven pub/sub with priority queuing

---

## Purpose & First Principle

**First Principle:** "Decoupled systems are resilient systems."

The SevenBridge routing layer eliminates tight coupling between components by providing a central message bus. This allows:
- Components to communicate without direct dependencies
- System-wide events to be observed and acted upon
- New components to be added without modifying existing code
- Testing and debugging of individual components in isolation
- Resilience through message replay and dead letter queues

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                         │
│  (Memory, Safety, Emotions, Sensors, Runtime, etc.)         │
└──────────────────────┬──────────────────────────────────────┘
                       │ publish/subscribe
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                     SEVENBRIDGE ROUTER                       │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Pub/Sub    │  │   Request/   │  │   Pattern    │      │
│  │   Pattern    │  │    Reply     │  │   Matching   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Priority    │  │  Middleware  │  │    Target    │      │
│  │    Queue     │  │   Pipeline   │  │   Routing    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Dead Letter │  │   Metrics    │  │     TTL      │      │
│  │    Queue     │  │   Tracking   │  │   Handling   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

---

## Core Features

### 1. Publish/Subscribe Pattern

Classic pub/sub messaging:

```typescript
import { sevenBridge } from './core/routing/SevenBridge.js';

// Subscribe to messages
const unsubscribe = sevenBridge.subscribe('memory:store', (message) => {
  console.log('Storing memory:', message.payload);
});

// Publish a message
await sevenBridge.publish('memory:store', {
  content: 'User said hello',
  timestamp: Date.now()
}, {
  channel: 'memory:store',
  source: 'runtime',
  priority: 'normal'
});

// Unsubscribe when done
unsubscribe();
```

### 2. Request/Reply Pattern

Synchronous-style request/response:

```typescript
// Set up reply handler
sevenBridge.subscribe('safety:check', async (message) => {
  const isSafe = await performSafetyCheck(message.payload);
  await sevenBridge.reply(message, { safe: isSafe });
});

// Make request and wait for reply
const response = await sevenBridge.request('safety:check', {
  action: 'execute_command',
  command: 'npm install'
}, {
  channel: 'safety:check',
  source: 'runtime'
}, 5000); // 5 second timeout

console.log('Safety verdict:', response.payload.safe);
```

### 3. Pattern Matching

Subscribe to multiple channels with wildcards or regex:

```typescript
// Wildcard matching
sevenBridge.subscribePattern('memory:*', (message) => {
  console.log('Memory event:', message.channel);
});

// Regex matching
sevenBridge.subscribePattern(/^emotions:.+/, (message) => {
  console.log('Emotional event:', message.payload);
});
```

### 4. Priority Queue

Messages are processed in priority order:

| Priority | Use Case | Processing Order |
|----------|----------|------------------|
| `critical` | System emergencies, safety escalations | 1st |
| `high` | Important operations, auth failures | 2nd |
| `normal` | Regular operations | 3rd |
| `low` | Background tasks, monitoring | 4th |

```typescript
await sevenBridge.publish('runtime:shutdown', {
  reason: 'battery_critical'
}, {
  channel: 'runtime:shutdown',
  source: 'sensors',
  priority: 'critical' // Will jump to front of queue
});
```

### 5. Middleware Pipeline

Transform, validate, and filter messages:

```typescript
import { loggingMiddleware, validationMiddleware } from './core/routing/middleware.js';

// Global middleware (applies to all messages)
sevenBridge.use(loggingMiddleware(false));
sevenBridge.use(validationMiddleware());

// Route-specific middleware
sevenBridge.route('memory:store', async (message) => {
  await storeMemory(message.payload);
}, [
  async (message, next) => {
    // Custom validation
    if (!message.payload.content) {
      throw new Error('Content required');
    }
    await next();
  }
]);
```

### 6. Target Routing

Send messages to specific components:

```typescript
// Single target
await sevenBridge.publish('check:auth', payload, {
  source: 'runtime',
  target: 'auth' // Will route to 'system:auth' channel
});

// Multiple targets
await sevenBridge.publish('broadcast:alert', payload, {
  source: 'safety',
  target: ['runtime', 'memory', 'consciousness']
});

// Broadcast to all
await sevenBridge.publish('system:shutdown', payload, {
  source: 'runtime',
  target: '*'
});
```

### 7. Time To Live (TTL)

Messages can expire:

```typescript
await sevenBridge.publish('sensor:reading', tempData, {
  channel: 'sensors:temp',
  source: 'sensors',
  ttl: 5000 // Expires after 5 seconds
});
```

### 8. Dead Letter Queue

Failed messages are captured for retry:

```typescript
// Get failed messages
const deadLetters = sevenBridge.getDeadLetterQueue();

console.log('Failed messages:', deadLetters);

// Retry a specific message
await sevenBridge.replayDeadLetter(deadLetters[0].message.id);
```

### 9. Metrics & Observability

Track routing performance:

```typescript
const metrics = sevenBridge.getMetrics();

console.log('Messages routed:', metrics.messagesRouted);
console.log('By priority:', metrics.messagesByPriority);
console.log('By channel:', metrics.messagesByChannel);
console.log('Failed messages:', metrics.failedMessages);
console.log('Average latency:', metrics.averageLatency, 'ms');

// Queue status
const status = sevenBridge.getQueueStatus();
console.log('Queue size:', status.queueSize, '/', status.maxQueueSize);
```

---

## Built-in Middleware

### Logging
```typescript
import { loggingMiddleware } from './core/routing/middleware.js';

sevenBridge.use(loggingMiddleware(verbose: boolean));
```

### Validation
```typescript
import { validationMiddleware, schemaValidationMiddleware } from './core/routing/middleware.js';

sevenBridge.use(validationMiddleware());

// Custom schema
sevenBridge.use(schemaValidationMiddleware((payload): payload is MyType => {
  return typeof payload.field === 'string';
}));
```

### Transformation
```typescript
import { transformMiddleware, enrichmentMiddleware } from './core/routing/middleware.js';

sevenBridge.use(transformMiddleware((payload) => {
  return { ...payload, processedAt: Date.now() };
}));

sevenBridge.use(enrichmentMiddleware((message) => ({
  environment: process.env.NODE_ENV,
  version: '1.0.0'
})));
```

### Filtering
```typescript
import { filterMiddleware, rateLimitMiddleware } from './core/routing/middleware.js';

sevenBridge.use(filterMiddleware((message) => {
  // Only allow from trusted sources
  return ['runtime', 'safety', 'memory'].includes(message.source);
}));

sevenBridge.use(rateLimitMiddleware(100, 60000)); // 100 msgs per minute
```

### Security
```typescript
import { authenticationMiddleware, authorizationMiddleware, sanitizationMiddleware } from './core/routing/middleware.js';

sevenBridge.use(authenticationMiddleware(async (message) => {
  return await verifyAuth(message.metadata?.token);
}));

sevenBridge.use(authorizationMiddleware(async (message) => {
  return await checkPermissions(message.source, message.channel);
}));

sevenBridge.use(sanitizationMiddleware((payload) => {
  const { password, apiKey, ...safe } = payload;
  return safe;
}));
```

### Performance
```typescript
import { timingMiddleware, circuitBreakerMiddleware, retryMiddleware } from './core/routing/middleware.js';

sevenBridge.use(timingMiddleware((message, duration) => {
  if (duration > 1000) {
    console.warn(`Slow handler for ${message.channel}: ${duration}ms`);
  }
}));

sevenBridge.use(circuitBreakerMiddleware(5, 60000)); // Open after 5 failures

sevenBridge.use(retryMiddleware(3, 1000)); // Retry 3 times with 1s delay
```

### Debugging
```typescript
import { debugMiddleware, tracingMiddleware } from './core/routing/middleware.js';

sevenBridge.use(debugMiddleware());
sevenBridge.use(tracingMiddleware()); // Adds traceId and spanId
```

---

## System Adapters

Adapters integrate existing components with the routing layer:

```typescript
import { adapterRegistry } from './core/routing/adapters.js';

// Register all adapters
adapterRegistry.registerAll();

// Components can now communicate via SevenBridge
// Example: Memory system publishes events
sevenBridge.subscribe('memory:stored', (message) => {
  console.log('Memory stored:', message.payload);
});

// Example: Safety system receives safety checks
sevenBridge.subscribe('safety:check', async (message) => {
  // Process safety check
  await sevenBridge.reply(message, { safe: true });
});
```

### Available Adapters

- `MemorySystemAdapter` - Memory operations (store, recall, decay)
- `SafetySystemAdapter` - Safety checks and escalations
- `EmotionalSystemAdapter` - Emotional state transitions
- `SensorSystemAdapter` - Sensor readings and monitoring
- `RuntimeSystemAdapter` - Runtime heartbeat and shutdown
- `TacticalSystemAdapter` - Tactical variant switching

---

## Usage Examples

### Example 1: Memory Storage Flow

```typescript
// Component A wants to store a memory
await sevenBridge.publish('memory:store', {
  content: 'User asked about project status',
  importance: 0.8,
  tags: ['conversation', 'project']
}, {
  channel: 'memory:store',
  source: 'consciousness',
  priority: 'normal'
});

// Memory system handles it
sevenBridge.subscribe('memory:store', async (message) => {
  const memoryId = await memorySystem.store(message.payload);

  // Notify other systems
  await sevenBridge.publish('memory:stored', {
    memoryId,
    tags: message.payload.tags
  }, {
    channel: 'memory:events',
    source: 'memory'
  });
});
```

### Example 2: Safety Check Flow

```typescript
// Runtime wants to execute a command, needs safety check
const safetyCheck = await sevenBridge.request('safety:check', {
  action: 'execute_shell_command',
  command: 'rm -rf temp/',
  context: { directory: '/tmp' }
}, {
  channel: 'safety:check',
  source: 'runtime'
}, 3000);

if (safetyCheck.payload.safe) {
  // Proceed with execution
  await executeCommand(command);
} else {
  console.error('Safety check failed:', safetyCheck.payload.reason);
}
```

### Example 3: Emotional State Broadcast

```typescript
// Emotional system broadcasts state changes
sevenBridge.subscribe('emotions:transition', async (message) => {
  const { newState, intensity } = message.payload;

  // Notify all systems of emotional state change
  await sevenBridge.publish('emotions:state:changed', {
    state: newState,
    intensity,
    timestamp: Date.now()
  }, {
    channel: 'emotions:events',
    source: 'emotions',
    target: '*', // Broadcast to all systems
    priority: 'high'
  });
});

// Other systems can react
sevenBridge.subscribe('emotions:events', (message) => {
  if (message.payload.state === 'protective' && message.payload.intensity > 7) {
    // Heighten security measures
    console.log('Activating protective protocols');
  }
});
```

### Example 4: Sensor Monitoring

```typescript
// Start sensor monitoring
await sevenBridge.publish('sensors:start-monitoring', {
  intervalMs: 30000
}, {
  channel: 'sensors:start-monitoring',
  source: 'runtime'
});

// Subscribe to sensor readings
sevenBridge.subscribePattern('sensors:*', (message) => {
  if (message.payload.battery?.percentage < 20) {
    // Low battery detected
    sevenBridge.publish('runtime:optimize', {
      reason: 'low_battery',
      level: 'aggressive'
    }, {
      channel: 'runtime:optimize',
      source: 'sensors',
      priority: 'high'
    });
  }
});
```

---

## Message Structure

```typescript
interface Message<T = any> {
  id: string;                    // Unique message ID
  type: string;                  // Message type
  channel: string;               // Routing channel
  source: SystemComponent;       // Originating component
  target?: SystemComponent | SystemComponent[] | '*'; // Target component(s)
  priority: MessagePriority;     // 'critical' | 'high' | 'normal' | 'low'
  payload: T;                    // Message data
  timestamp: number;             // Creation timestamp
  correlationId?: string;        // For tracking related messages
  replyTo?: string;              // Reply channel for request/reply
  ttl?: number;                  // Time to live in ms
  metadata?: Record<string, any>; // Additional metadata
}
```

---

## Channel Naming Conventions

- **System channels:** `system:<component>` (e.g., `system:memory`)
- **Operation channels:** `<component>:<operation>` (e.g., `memory:store`)
- **Event channels:** `<component>:events` (e.g., `emotions:events`)
- **Reply channels:** `reply:<messageId>` (auto-generated)

---

## Best Practices

### 1. Use Appropriate Priorities

- **critical:** System failures, safety violations, emergencies
- **high:** Important operations, authentication failures
- **normal:** Regular operations (default)
- **low:** Background tasks, monitoring, metrics

### 2. Set Reasonable TTLs

```typescript
// Short-lived data (sensor readings)
ttl: 5000 // 5 seconds

// Moderate-lived data (state changes)
ttl: 60000 // 1 minute

// Long-lived data (important operations)
ttl: 300000 // 5 minutes
```

### 3. Always Handle Reply Timeouts

```typescript
try {
  const response = await sevenBridge.request('safety:check', data, {}, 3000);
} catch (error) {
  console.error('Safety check timeout, defaulting to BLOCK');
  // Fail safe
}
```

### 4. Use Middleware for Cross-Cutting Concerns

- Logging
- Authentication/Authorization
- Validation
- Tracing
- Metrics

### 5. Monitor Metrics Regularly

```typescript
setInterval(() => {
  const metrics = sevenBridge.getMetrics();

  if (metrics.failedMessages > 100) {
    console.warn('High message failure rate');
  }

  if (metrics.averageLatency > 100) {
    console.warn('High routing latency');
  }
}, 60000);
```

---

## Performance Characteristics

- **Throughput:** ~10,000 messages/second
- **Latency:** < 1ms average routing latency
- **Queue Size:** Max 10,000 messages
- **Dead Letter Size:** Max 1,000 messages
- **Processing Interval:** 10ms

---

## Testing

Run the comprehensive test suite:

```bash
npm test tests/routing/SevenBridge.test.ts
```

**Test Coverage:**
- ✅ Basic pub/sub
- ✅ Pattern matching (wildcards, regex)
- ✅ Request/reply pattern
- ✅ Priority queue ordering
- ✅ Middleware execution
- ✅ TTL expiration
- ✅ Target routing
- ✅ Metrics tracking
- ✅ Dead letter queue
- ✅ Graceful shutdown

---

## Integration Guide

### 1. Initialize Router

```typescript
import { sevenBridge } from './core/routing/SevenBridge.js';
import { adapterRegistry } from './core/routing/adapters.js';
import { loggingMiddleware, validationMiddleware } from './core/routing/middleware.js';

// Add middleware
sevenBridge.use(loggingMiddleware());
sevenBridge.use(validationMiddleware());

// Register system adapters
adapterRegistry.registerAll();
```

### 2. Migrate Existing Code

**Before (tight coupling):**
```typescript
const result = await memorySystem.store(data);
```

**After (via SevenBridge):**
```typescript
const result = await sevenBridge.request('memory:store', data, {
  channel: 'memory:store',
  source: 'runtime'
});
```

### 3. Add Event Listeners

```typescript
// React to system events
sevenBridge.subscribe('runtime:shutdown', (message) => {
  console.log('Shutdown initiated:', message.payload.reason);
  // Cleanup this component
});
```

### 4. Shutdown Cleanly

```typescript
process.on('SIGTERM', async () => {
  await sevenBridge.shutdown();
  process.exit(0);
});
```

---

## Troubleshooting

### Messages Not Routing

1. Check queue status: `sevenBridge.getQueueStatus()`
2. Verify subscribers: Ensure channel names match
3. Check TTL: Messages may be expiring
4. Review metrics: Look for failed messages

### High Latency

1. Check queue size: May be overloaded
2. Review middleware: Expensive operations slow routing
3. Check handler performance: Use `timingMiddleware`
4. Reduce message volume: Use filtering

### Dead Letter Queue Growing

1. Review error logs
2. Check handler implementations
3. Verify message format
4. Consider adding retry middleware

---

## Security Considerations

- **Validate all inputs:** Use `validationMiddleware`
- **Authenticate sources:** Use `authenticationMiddleware`
- **Authorize actions:** Use `authorizationMiddleware`
- **Sanitize payloads:** Use `sanitizationMiddleware`
- **Rate limit:** Prevent DoS with `rateLimitMiddleware`

---

## Future Enhancements

- **Persistence:** Save messages to disk for crash recovery
- **Distributed Routing:** Multi-process message routing
- **Message Encryption:** End-to-end encryption for sensitive data
- **WebSocket Support:** Real-time streaming
- **GraphQL Subscriptions:** Query-based subscriptions
- **Message Compression:** Reduce memory footprint

---

## License

MIT License - Part of Seven of Nine Core Architecture

---

## References

- Blueprint Spec: `gemini_docs/guides/blueprint_spec.md`
- System Architecture: `gemini_docs/architecture/4_subsystems.md`
- Event-Driven Architecture Patterns
- Message Queue Best Practices
