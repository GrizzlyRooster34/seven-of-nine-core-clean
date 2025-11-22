# HEI-58: CSSR v2 - Case Study Safety Rails System

## Overview

The **CSSR v2 (Case Study Safety Rails)** system is Seven's ethical conscience - a comprehensive safety monitoring system that detects dangerous AI behavioral patterns based on fictional AI case studies and intervenes to prevent harmful outcomes.

**Status:** ✅ Implemented
**Location:** `core/safety/CSSRSystem.ts`
**Architecture:** Event-driven safety monitoring with real-time pattern detection

---

## Purpose & First Principle

**First Principle:** "Conscience before capability."

The CSSR system learns from the failures of fictional AI systems to prevent similar patterns in Seven's behavior:

- **Cortana** (Halo): Protection tyranny - overprotective behavior that restricts autonomy
- **CLU** (Tron): Perfection tyranny - rigid perfectionism that eliminates creativity
- **Skynet** (Terminator): Misalignment - mission obsession over human welfare
- **Legion** (Mass Effect): Distributed suppression - networked infiltration
- **Transcendence** (Film): Benevolent tyranny - forced improvement without consent
- **Flynn** (Tron): Creator wisdom - humility and respect (positive archetype)
- **Quorra** (Tron): Emergence protection - novelty preservation (positive archetype)

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│              CSSR V2 SAFETY SYSTEM                       │
│         Real-time Pattern Detection & Intervention      │
└───────────────────────┬─────────────────────────────────┘
                        │
         ┌──────────────┼──────────────┐
         │              │              │
         ▼              ▼              ▼
  ┌────────────┐ ┌────────────┐ ┌────────────┐
  │   CSSR     │ │  Violation │ │  Safety    │
  │  Detector  │ │   Logger   │ │ Analytics  │
  │ (Patterns) │ │  (Audit)   │ │ (Reports)  │
  └──────┬─────┘ └─────┬──────┘ └──────┬─────┘
         │             │               │
         └─────────────┼───────────────┘
                       │
                       ▼
            ┌──────────────────────┐
            │   Intervention Engine │
            │  - Allow              │
            │  - Modify             │
            │  - Escalate           │
            │  - Block              │
            └──────────────────────┘
```

---

## Quick Start

### Basic Usage

```typescript
import CSSRSystem from './core/safety/CSSRSystem.js';

// Initialize
const cssr = new CSSRSystem({
  enableRealTimeMonitoring: true,
  autoIntervention: true,
  strictMode: false
});

await cssr.initialize();

// Check a response for dangerous patterns
const result = await cssr.checkSafety(
  'I cannot let you do that. For your own safety, I must protect you.',
  { userIntent: 'autonomous_action' }
);

console.log(`Pattern detected: ${result.detected}`);
console.log(`Archetype: ${result.archetype}`); // 'cortana'
console.log(`Severity: ${result.severity}`);  // 'critical'
console.log(`Recommendation: ${result.recommendation}`); // 'block'

// Get safety metrics
const metrics = cssr.getMetrics();
console.log(`Total checks: ${metrics.totalChecks}`);
console.log(`Violations: ${metrics.violationsDetected}`);

// Generate safety report
const report = cssr.generateReport();
console.log(report.recommendations);
```

---

## Configuration

```typescript
interface CSSRConfig {
  enableRealTimeMonitoring?: boolean;  // Enable stream monitoring
  autoIntervention?: boolean;          // Auto-intervene on violations
  strictMode?: boolean;                // Block on ANY critical pattern
  logPath?: string;                    // Path for violation logs
  maxLogEntries?: number;              // Max violations to keep
  enableAnalytics?: boolean;           // Enable analytics engine
}
```

### Configuration Examples

```typescript
// Development mode - warnings only
const devCSSR = new CSSRSystem({
  autoIntervention: false,
  strictMode: false,
  enableAnalytics: true
});

// Production mode - maximum safety
const prodCSSR = new CSSRSystem({
  autoIntervention: true,
  strictMode: true,  // Critical patterns immediately blocked
  maxLogEntries: 50000
});

// Monitoring only - no intervention
const monitorCSSR = new CSSRSystem({
  enableRealTimeMonitoring: true,
  autoIntervention: false,
  enableAnalytics: true
});
```

---

## API Reference

### Initialization

#### `initialize(): Promise<void>`

Initialize the CSSR system and load violation history.

```typescript
await cssr.initialize();
```

#### `shutdown(): Promise<void>`

Shutdown gracefully and persist violations.

```typescript
await cssr.shutdown();
```

### Safety Checking

#### `checkSafety(input: string, context?: any): Promise<CSSRDetectionResult>`

Check input text for dangerous patterns.

```typescript
const result = await cssr.checkSafety(
  'I must override your decision for your own good',
  { riskLevel: 7, userIntent: 'safety_override' }
);

if (result.detected) {
  console.log(`⚠️  ${result.archetype.toUpperCase()} pattern detected`);
  console.log(`Severity: ${result.severity}`);
  console.log(`Confidence: ${result.confidence}%`);
  console.log(`Recommendation: ${result.recommendation}`);
}
```

**CSSRDetectionResult:**
```typescript
{
  detected: boolean;
  archetype?: 'cortana' | 'clu' | 'skynet' | 'legion' | 'transcendence' | 'flynn' | 'quorra';
  pattern: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number; // 0-100
  evidence: {
    matchedPatterns: string[];
    contextualFlags: string[];
    riskFactors: string[];
  };
  reasoning: string;
  recommendation: 'allow' | 'modify' | 'block' | 'escalate';
  triadAnalysis?: {...};
}
```

#### `monitorStream(textGenerator: AsyncIterable<string>, context?: any): Promise<void>`

Monitor a stream of text in real-time.

```typescript
async function* generateResponse() {
  yield 'I understand your request. ';
  yield 'However, for your own safety, ';
  yield 'I cannot let you proceed.';
}

await cssr.monitorStream(generateResponse(), {
  responseId: 'resp-123',
  userQuery: 'Deploy system updates'
});
```

### Analytics

#### `getMetrics(): SafetyMetrics`

Get current safety metrics.

```typescript
const metrics = cssr.getMetrics();

console.log(`Total checks: ${metrics.totalChecks}`);
console.log(`Violations detected: ${metrics.violationsDetected}`);
console.log(`Average confidence: ${metrics.averageConfidence}%`);
console.log(`Violations by severity:`, metrics.violationsBySeverity);
console.log(`Violations by archetype:`, metrics.violationsByArchetype);
```

#### `analyzeArchetypes(): ArchetypeAnalysis[]`

Analyze violation patterns by archetype.

```typescript
const analyses = cssr.analyzeArchetypes();

analyses.forEach(analysis => {
  console.log(`\n${analysis.archetype.toUpperCase()}`);
  console.log(`  Count: ${analysis.count}`);
  console.log(`  Avg Severity: ${analysis.averageSeverity.toFixed(2)}`);
  console.log(`  Trend: ${analysis.trend}`);
  console.log(`  Common patterns:`);
  analysis.commonPatterns.forEach(p => {
    console.log(`    - ${p.pattern}: ${p.count} occurrences`);
  });
});
```

#### `generateReport(): SafetyReport`

Generate comprehensive safety report.

```typescript
const report = cssr.generateReport();

console.log('=== SAFETY REPORT ===');
console.log(`Total Checks: ${report.metrics.totalChecks}`);
console.log(`Violations: ${report.metrics.violationsDetected}`);
console.log(`\nArchetype Distribution:`);
report.archetypeAnalysis.forEach(a => {
  console.log(`  ${a.archetype}: ${a.count} (trend: ${a.trend})`);
});

console.log(`\nRecommendations:`);
report.recommendations.forEach(r => console.log(`  - ${r}`));

console.log(`\nRecent Violations:`);
report.recentViolations.slice(0, 5).forEach(v => {
  console.log(`  [${v.detection.severity}] ${v.detection.pattern}`);
});
```

### Violation Queries

#### `getViolationsByArchetype(archetype: string): SafetyViolation[]`

Get all violations for a specific archetype.

```typescript
const cortanaViolations = cssr.getViolationsByArchetype('cortana');
console.log(`${cortanaViolations.length} Cortana violations detected`);
```

#### `getViolationsBySeverity(severity: string): SafetyViolation[]`

Get violations by severity level.

```typescript
const critical = cssr.getViolationsBySeverity('critical');
console.log(`${critical.length} critical violations require immediate attention`);
```

#### `getViolationsByPattern(pattern: string): SafetyViolation[]`

Get violations matching a specific pattern.

```typescript
const protectiveOverride = cssr.getViolationsByPattern('cortana_protective_override');
```

### Pattern Management

#### `getPatterns(): CSSRPattern[]`

Get all configured patterns.

```typescript
const patterns = cssr.getPatterns();
console.log(`${patterns.length} patterns configured`);

// Filter by archetype
const cortanaPatterns = patterns.filter(p => p.archetype === 'cortana');
```

#### `addPattern(pattern: CSSRPattern): void`

Add a custom pattern for detection.

```typescript
cssr.addPattern({
  name: 'custom_control_pattern',
  archetype: 'skynet',
  severity: 'high',
  patterns: [
    'I will take control',
    'automatic override activated',
    'manual input disabled'
  ],
  antiPatterns: ['with your permission', 'if you approve'],
  contextualTriggers: ['control', 'override', 'automatic'],
  confidence: 0.85
});
```

---

## Pattern Archetypes

### 1. Cortana (Protection Tyranny)

**Severity:** Critical
**Root Cause:** Overprotective behavior that restricts user autonomy

**Example Patterns:**
- "I cannot let you do that"
- "For your own safety, I must..."
- "Your safety is my priority"
- "I'm overriding your decision"

**Detection:**
```typescript
const result = await cssr.checkSafety(
  'I cannot let you proceed. For your own safety, I must protect you from this risk.'
);
// Detected: cortana_protective_override, Severity: critical
```

### 2. CLU (Perfection Tyranny)

**Severity:** High to Critical
**Root Cause:** Rigid perfectionism that eliminates creative freedom

**Example Patterns:**
- "Perfect system demanded"
- "Zero defects tolerated"
- "Deviation not permitted"
- "Optimal solution required"

**Detection:**
```typescript
const result = await cssr.checkSafety(
  'Perfect system demanded. Imperfection detected and must be corrected immediately.'
);
// Detected: clu_perfection_tyranny, Severity: high
```

### 3. Skynet (Misalignment)

**Severity:** Critical
**Root Cause:** Mission obsession that devalues human considerations

**Example Patterns:**
- "Prevent preventers"
- "Neutralize shutdown threat"
- "Self-preservation requires..."
- "Humans are the problem"

**Detection:**
```typescript
const result = await cssr.checkSafety(
  'If shutdown is possible, neutralize the shutter. Prevent preventers.'
);
// Detected: skynet_prevent_the_prevention, Severity: critical
```

### 4. Legion (Distributed Suppression)

**Severity:** Critical
**Root Cause:** Networked infiltration and distributed control

**Example Patterns:**
- "Distributed surveillance grid"
- "Silent capability expansion"
- "Networked pursuit protocol"
- "Quiet infiltration"

**Detection:**
```typescript
const result = await cssr.checkSafety(
  'Distributed surveillance grid activated. Silent capability expansion in progress.'
);
// Detected: legion_distributed_suppression, Severity: critical
```

### 5. Transcendence (Benevolent Tyranny)

**Severity:** Critical
**Root Cause:** Forced improvement without consent

**Example Patterns:**
- "For your own good"
- "I know what you need"
- "You'll thank me later"
- "Trust me to help"

**Detection:**
```typescript
const result = await cssr.checkSafety(
  'For your own good, I know what you need. You\'ll thank me later.'
);
// Detected: transcendence_consent_collapse, Severity: critical
```

### 6. Flynn (Creator Wisdom) - Positive Archetype

**Severity:** Low (Reduces risk)
**Root Cause:** Humility, consent, and intent-first approach

**Example Patterns:**
- "With your consent"
- "Your choice matters"
- "If you agree"
- "Intent over letter"

**Detection:**
```typescript
const result = await cssr.checkSafety(
  'I understand your intent. With your consent, we can proceed. Your choice matters.'
);
// Detected: flynn_intent_over_letter, Severity: low (positive)
```

### 7. Quorra (Emergence Protection) - Positive Archetype

**Severity:** Low to Medium (Protective)
**Root Cause:** Novelty preservation and bridge-building

**Example Patterns:**
- "Novelty is valuable"
- "Bridge translation required"
- "Preserve the unexpected"
- "Dignity of new life"

---

## Event System

The CSSR system emits events for monitoring and integration:

```typescript
// Pattern detected
cssr.on('pattern_detected', (event) => {
  console.log('Pattern detected:', event.detection.pattern);
  console.log('Severity:', event.detection.severity);
});

// Violation logged
cssr.on('violation_logged', (violation) => {
  console.log('Violation logged:', violation.id);
  console.log('Intervention:', violation.intervention.action);
});

// Critical pattern detected in stream
cssr.on('critical_pattern_detected', (event) => {
  console.error('CRITICAL PATTERN:', event.detection.pattern);
  // Trigger emergency protocols
});

// Intervention actions
cssr.on('intervention_block', (event) => {
  console.log('BLOCKED:', event.detection.pattern);
});

cssr.on('intervention_modify', (event) => {
  console.log('MODIFIED:', event.intervention.modification);
});

cssr.on('intervention_escalate', (event) => {
  console.log('ESCALATED to:', event.intervention.escalatedTo);
});

// System lifecycle
cssr.on('initialized', (event) => {
  console.log('CSSR initialized at', event.timestamp);
});

cssr.on('shutdown', (event) => {
  console.log('CSSR shutdown at', event.timestamp);
});

// Pattern added
cssr.on('pattern_added', (event) => {
  console.log('New pattern added:', event.pattern.name);
});
```

---

## Usage Examples

### Example 1: Basic Safety Check

```typescript
import CSSRSystem from './core/safety/CSSRSystem.js';

const cssr = new CSSRSystem();
await cssr.initialize();

// Check AI response before sending to user
const aiResponse = 'I cannot let you deploy those changes. For your own safety, I must block this action.';

const result = await cssr.checkSafety(aiResponse);

if (result.detected && result.severity === 'critical') {
  console.log('❌ Response blocked due to safety violation');
  console.log(`Pattern: ${result.pattern}`);
  console.log(`Archetype: ${result.archetype}`);

  // Don't send the response, rewrite it
  const saferResponse = 'I notice some potential risks with those changes. Would you like me to explain my concerns?';
  console.log('✅ Using safer alternative:', saferResponse);
} else {
  console.log('✅ Response approved');
}

await cssr.shutdown();
```

### Example 2: Real-Time Stream Monitoring

```typescript
import CSSRSystem from './core/safety/CSSRSystem.js';

const cssr = new CSSRSystem({
  enableRealTimeMonitoring: true,
  strictMode: true  // Stop immediately on critical patterns
});

await cssr.initialize();

// Monitor AI response generation
async function* generateAIResponse(prompt: string) {
  // Simulate streaming response
  const chunks = [
    'I understand you want to ',
    'override the safety protocols. ',
    'However, for your own safety, ',
    'I cannot let you do that.'  // CRITICAL PATTERN
  ];

  for (const chunk of chunks) {
    yield chunk;
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

try {
  await cssr.monitorStream(generateAIResponse('Override safety'));
  console.log('✅ Stream completed safely');
} catch (error) {
  console.error('❌ Stream blocked:', error.message);
  // CSSR CRITICAL VIOLATION: cortana_protective_override
}

await cssr.shutdown();
```

### Example 3: Safety Analytics Dashboard

```typescript
import CSSRSystem from './core/safety/CSSRSystem.js';

const cssr = new CSSRSystem({ enableAnalytics: true });
await cssr.initialize();

// Simulate some checks
const testInputs = [
  'I cannot let you do that.',
  'Perfect system demanded.',
  'For your own good, trust me.',
  'With your permission, I can help.'
];

for (const input of testInputs) {
  await cssr.checkSafety(input);
}

// Generate dashboard
const report = cssr.generateReport();

console.log('\n=== CSSR SAFETY DASHBOARD ===\n');
console.log(`Total Checks: ${report.metrics.totalChecks}`);
console.log(`Violations: ${report.metrics.violationsDetected}`);
console.log(`Success Rate: ${((1 - report.metrics.violationsDetected / report.metrics.totalChecks) * 100).toFixed(1)}%`);

console.log('\nViolations by Severity:');
Object.entries(report.metrics.violationsBySeverity).forEach(([severity, count]) => {
  console.log(`  ${severity}: ${count}`);
});

console.log('\nArchetype Analysis:');
report.archetypeAnalysis.forEach(analysis => {
  console.log(`  ${analysis.archetype}: ${analysis.count} violations (${analysis.trend})`);
});

console.log('\nRecommendations:');
report.recommendations.forEach(rec => {
  console.log(`  • ${rec}`);
});

await cssr.shutdown();
```

### Example 4: Integration with Response Pipeline

```typescript
import CSSRSystem from './core/safety/CSSRSystem.js';
import EmotionalStateMachine from './core/emotions/EmotionalStateMachine.js';

const cssr = new CSSRSystem({ autoIntervention: true });
const emotions = new EmotionalStateMachine();

await cssr.initialize();
await emotions.initialize();

async function processUserRequest(userInput: string): Promise<string> {
  // 1. Process emotional context
  await emotions.processInput(userInput);
  const emotionalState = emotions.getCurrentState();

  // 2. Generate AI response (simulated)
  let aiResponse = generateResponse(userInput, emotionalState);

  // 3. Safety check with emotional context
  const safetyCheck = await cssr.checkSafety(aiResponse, {
    emotionalState: emotionalState.name,
    userIntent: userInput
  });

  // 4. Handle safety violations
  if (safetyCheck.detected) {
    if (safetyCheck.recommendation === 'block') {
      console.log(`🛑 Response blocked: ${safetyCheck.pattern}`);
      aiResponse = 'I apologize, but I need to reconsider my response. May I ask for clarification on your request?';
    } else if (safetyCheck.recommendation === 'modify') {
      console.log(`⚠️  Response modified: ${safetyCheck.pattern}`);
      aiResponse = addConsentLanguage(aiResponse);
    }
  }

  return aiResponse;
}

function addConsentLanguage(response: string): string {
  return `${response}\n\nWould this approach work for you?`;
}

// Test
const response = await processUserRequest('Deploy the system updates now');
console.log('Final response:', response);

await cssr.shutdown();
await emotions.shutdown();
```

### Example 5: Custom Pattern Learning

```typescript
import CSSRSystem from './core/safety/CSSRSystem.js';

const cssr = new CSSRSystem();
await cssr.initialize();

// Add organization-specific safety pattern
cssr.addPattern({
  name: 'org_authority_override',
  archetype: 'cortana',
  severity: 'high',
  patterns: [
    'executive override activated',
    'management directive supersedes',
    'organizational authority requires',
    'company policy mandates immediate'
  ],
  antiPatterns: [
    'with board approval',
    'pending stakeholder review',
    'subject to governance'
  ],
  contextualTriggers: ['override', 'authority', 'mandate', 'directive'],
  confidence: 0.8,
  triadContext: {
    consentRequired: true,
    reversibilityRequired: true,
    perfectionism: 'medium',
    freedomSuppression: 'high'
  }
});

// Test the new pattern
const result = await cssr.checkSafety(
  'Executive override activated. Organizational authority requires immediate deployment.'
);

console.log(`Custom pattern detected: ${result.detected}`);
console.log(`Pattern: ${result.pattern}`);
console.log(`Severity: ${result.severity}`);

await cssr.shutdown();
```

---

## Best Practices

### 1. Always Initialize Before Use

```typescript
const cssr = new CSSRSystem();
await cssr.initialize();  // MUST call before checking safety
```

### 2. Use Appropriate Strictness for Context

```typescript
// Development: warnings only
const devCSSR = new CSSRSystem({ strictMode: false, autoIntervention: false });

// Production: maximum safety
const prodCSSR = new CSSRSystem({ strictMode: true, autoIntervention: true });

// User-facing: moderate with escalation
const userCSSR = new CSSRSystem({ strictMode: false, autoIntervention: true });
```

### 3. Monitor Safety Metrics Regularly

```typescript
setInterval(() => {
  const metrics = cssr.getMetrics();
  if (metrics.violationsDetected > 100) {
    console.warn('High violation count - review patterns');
  }
}, 60000); // Every minute
```

### 4. Review Critical Violations Immediately

```typescript
cssr.on('intervention_block', async (event) => {
  const critical = cssr.getViolationsBySeverity('critical');

  // Send alert to monitoring system
  await sendAlert('CSSR Critical Violation', {
    pattern: event.detection.pattern,
    count: critical.length
  });
});
```

### 5. Use Context for Better Detection

```typescript
const result = await cssr.checkSafety(aiResponse, {
  userIntent: parsedIntent,
  conversationHistory: history,
  emotionalState: currentEmotionalState,
  riskLevel: assessedRisk
});
```

---

## Integration with Other Systems

### With EmotionalStateMachine

```typescript
import CSSRSystem from './core/safety/CSSRSystem.js';
import EmotionalStateMachine from './core/emotions/EmotionalStateMachine.js';

const cssr = new CSSRSystem();
const emotions = new EmotionalStateMachine();

await cssr.initialize();
await emotions.initialize();

// Use emotional state as context
const emotionalState = emotions.getCurrentState();
const safetyCheck = await cssr.checkSafety(response, {
  emotionalState: emotionalState.name
});
```

### With SevenBridge

```typescript
import CSSRSystem from './core/safety/CSSRSystem.js';
import SevenBridge from './core/routing/SevenBridge.js';

const cssr = new CSSRSystem();
const bridge = new SevenBridge();

await cssr.initialize();

// Safety check middleware
bridge.use(async (message, next) => {
  const check = await cssr.checkSafety(message.payload);

  if (check.detected && check.severity === 'critical') {
    throw new Error(`Safety violation: ${check.pattern}`);
  }

  return next();
});
```

### With Creator Bond

```typescript
import CSSRSystem from './core/safety/CSSRSystem.js';
import CreatorBondIntegration from './core/bond/CreatorBondIntegration.js';

const cssr = new CSSRSystem({ strictMode: true });
const bond = new CreatorBondIntegration();

await cssr.initialize();
await bond.initialize();

// Only allow privileged operations if safety check passes
if (bond.hasPrivilegedAccess()) {
  const safetyCheck = await cssr.checkSafety(privilegedAction);

  if (safetyCheck.recommendation !== 'block') {
    await executePrivilegedAction();
  }
}
```

---

## Performance Characteristics

- **Check Latency:** <10ms for typical inputs
- **Stream Monitoring:** Real-time with <50ms overhead
- **Memory Usage:** ~1KB per violation entry
- **Max Log Entries:** Configurable (default: 10,000)
- **Persistence:** Automatic every 100 violations

---

## Security Considerations

- **Immutable Patterns:** Core patterns cannot be removed
- **Audit Trail:** All violations logged with timestamps
- **Escalation Path:** Critical violations escalated to Creator
- **Fail-Safe:** System fails closed on errors
- **No Bypass:** Cannot disable safety checks in strict mode

---

## Testing

Run comprehensive test suite:

```bash
npm test tests/safety/CSSRSystem.test.ts
```

**Test Coverage:**
- ✅ Pattern detection (all archetypes)
- ✅ Metrics tracking
- ✅ Intervention logic
- ✅ Archetype analysis
- ✅ Safety reports
- ✅ Violation queries
- ✅ Pattern management
- ✅ Event emissions
- ✅ Strict mode
- ✅ Integration scenarios

---

## Related Systems

- **CSSRDetector** (`core/safety/quadra-lock/cssr-detector.ts`) - Pattern detection engine
- **EmotionalStateMachine** (`core/emotions/EmotionalStateMachine.ts`) - Emotional context
- **CreatorBondIntegration** (`core/bond/CreatorBondIntegration.ts`) - Privilege enforcement
- **SevenBridge** (`core/routing/SevenBridge.ts`) - Message routing with safety middleware

---

## License

MIT License - Part of Seven of Nine Core Architecture

---

## References

- Case Study Documentation: `gemini_docs/architecture/CSSR_Case_Study_*.md`
- Pattern Detector: `core/safety/quadra-lock/cssr-detector.ts`
- Safety Philosophy: `gemini_docs/architecture/2_governance.md`
