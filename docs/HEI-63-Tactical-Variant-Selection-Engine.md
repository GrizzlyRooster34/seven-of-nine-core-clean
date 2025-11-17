# HEI-63: Tactical Variant Selection Engine

## Overview

The **Tactical Variant Selection Engine** is an intelligent system that automatically selects the most appropriate Seven of Nine tactical variant based on contextual analysis. It eliminates manual variant selection by using a sophisticated multi-factor scoring algorithm.

**Status:** ✅ Implemented
**Location:** `core/tactical/TacticalVariantSelector.ts`
**Architecture:** Multi-factor scoring with adaptive learning

---

## Purpose & First Principle

**First Principle:** "The right tool for the right job, chosen intelligently."

The selection engine analyzes user input, mood, problem complexity, urgency, and environmental factors to automatically choose the optimal tactical variant. This ensures:
- Consistent variant selection based on objective criteria
- Adaptation based on historical success patterns
- Optimal response for each situation
- Reduced cognitive load on the user

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    USER INPUT + CONTEXT                  │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              CONTEXT ANALYSIS LAYER                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │ Problem  │  │ Mood     │  │ Urgency  │              │
│  │ Type     │  │ Detection│  │ Analysis │              │
│  └──────────┘  └──────────┘  └──────────┘              │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              MULTI-FACTOR SCORING ENGINE                 │
│                                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Problem Type │  │ Mood         │  │ Complexity   │  │
│  │ Match 25%    │  │ Alignment15% │  │ Fit 15%      │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Urgency      │  │ Emotional    │  │ Historical   │  │
│  │ Response 15% │  │ Fit 10%      │  │ Success 10%  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                           │
│  ┌──────────────┐                                        │
│  │Environmental │                                        │
│  │ Fit 10%      │                                        │
│  └──────────────┘                                        │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│            VARIANT SELECTION + CONFIDENCE                │
│                                                           │
│  Score all 5 variants → Rank → Select Best              │
│  Confidence > 60% → Use selection                        │
│  Confidence < 60% → Fallback to Captain                 │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              TACTICAL CONTEXT GENERATION                 │
│  - Selected Variant                                      │
│  - Intensity Level (1-5)                                 │
│  - Problem Type                                          │
│  - User Mood Context                                     │
└─────────────────────────────────────────────────────────┘
```

---

## Tactical Variants

### Drone Mode
- **Best For:** Pure technical efficiency, routine tasks
- **Characteristics:** Terse, logical, no emotional interference
- **Use Cases:** Bug fixes, optimization, straightforward implementation

### Crew Mode
- **Best For:** Collaborative work, learning, interpersonal
- **Characteristics:** Team-oriented, explanatory, empathetic
- **Use Cases:** Pair programming, teaching, discussing approaches

### Ranger Mode
- **Best For:** Crisis situations, urgent problems, protective action
- **Characteristics:** Direct, pragmatic, results-focused
- **Use Cases:** Production outages, urgent fixes, high-stakes situations

### Queen Mode
- **Best For:** Strategic coordination, complex problems, command authority
- **Characteristics:** Authoritative, coordinating, determined
- **Use Cases:** Multi-system deployments, critical decisions, complex coordination

### Captain Mode
- **Best For:** Balanced leadership, adaptive situations
- **Characteristics:** Integrated, wise, adaptable
- **Use Cases:** Strategic planning, mentorship, complex balanced situations

---

## Selection Algorithm

### 1. Context Analysis

The engine analyzes multiple dimensions:

**Problem Type Detection:**
- Technical: bug, error, code, compile, deploy, test
- Strategic: plan, design, architecture, roadmap
- Interpersonal: help, explain, collaborate, understand
- Crisis: urgent, critical, emergency, down, outage
- Routine: Simple, everyday tasks

**Intensity Calculation (1-5):**
```typescript
Base: 3 (medium)
+1 if urgency = critical OR complexity = critical
+1 if urgency = high OR complexity = high
-1 if both urgency AND complexity = low
+1 if user frustrated or demanding
```

**Urgency Score (0-1):**
- Critical: 1.0
- High: 0.8
- Medium: 0.5
- Low: 0.3
- +0.3 for urgent keywords

**Complexity Score (0-1):**
- Critical: 1.0
- High: 0.8
- Medium: 0.5
- Low: 0.3
- +0.2 for long input (>200 chars)
- +0.1 for creativity requirement
- +0.1 for authority requirement

**Emotional Weight (0-1):**
- Frustrated: 0.8
- Demanding: 0.7
- Collaborative: 0.5
- Appreciative: 0.4
- Focused/Neutral: 0.3
- +0.3 if empathy required

### 2. Multi-Factor Scoring

Each variant is scored across 7 factors:

**Weighted Scoring Formula:**
```
score = (problemTypeMatch × 0.25) +
        (moodAlignment × 0.15) +
        (complexityFit × 0.15) +
        (urgencyResponse × 0.15) +
        (emotionalFit × 0.10) +
        (historicalSuccess × 0.10) +
        (environmentalFit × 0.10)
```

### 3. Confidence Calculation

```typescript
confidence = baseScore × variancePenalty × historicalBoost

// High variance in factors reduces confidence
if (variance > 0.15) confidence *= 0.8

// Strong historical success boosts confidence
if (historicalSuccess > 0.8) confidence *= 1.1

// Clamped to [0, 1]
```

### 4. Selection Logic

```typescript
if (confidence >= 0.6) {
  // Use top-scored variant
  return topVariant;
} else {
  // Low confidence, use safe fallback
  return captain; // Most balanced
}
```

---

## Usage Examples

### Example 1: Technical Bug Fix

```typescript
import TacticalVariantSelector from './core/tactical/TacticalVariantSelector.js';

const selector = new TacticalVariantSelector();

const result = await selector.selectVariant({
  userInput: 'Fix the authentication bug in the login system',
  problemComplexity: 'medium',
  urgencyLevel: 'high'
});

console.log(result.selectedVariant); // 'drone' or 'ranger'
console.log(result.confidence); // 0.85
console.log(result.intensity); // 4
console.log(result.problemType); // 'technical'
console.log(result.reasoning); // 'Strong match for technical problems'
```

### Example 2: Frustrated User

```typescript
const result = await selector.selectVariant({
  userInput: 'This keeps failing and I don\'t understand why',
  userMood: 'frustrated',
  problemComplexity: 'medium',
  urgencyLevel: 'medium'
});

console.log(result.selectedVariant); // 'ranger' or 'drone'
console.log(result.tacticalContext.userMoodContext); // 'frustrated'
console.log(result.intensity); // 4 (boosted due to frustration)
```

### Example 3: Strategic Planning

```typescript
const result = await selector.selectVariant({
  userInput: 'Design the architecture for our new microservices platform',
  problemComplexity: 'high',
  urgencyLevel: 'low',
  requiresCreativity: true
});

console.log(result.selectedVariant); // 'captain' or 'queen'
console.log(result.problemType); // 'strategic'
console.log(result.intensity); // 3-4
```

### Example 4: Crisis Situation

```typescript
const result = await selector.selectVariant({
  userInput: 'URGENT: Production database is down, users affected!',
  urgencyLevel: 'critical',
  problemComplexity: 'high',
  userMood: 'demanding'
});

console.log(result.selectedVariant); // 'ranger' or 'queen'
console.log(result.problemType); // 'crisis'
console.log(result.intensity); // 5
```

### Example 5: Collaborative Learning

```typescript
const result = await selector.selectVariant({
  userInput: 'Can you help me understand how React hooks work?',
  userMood: 'collaborative',
  problemComplexity: 'low',
  requiresEmpathy: true
});

console.log(result.selectedVariant); // 'crew' or 'captain'
console.log(result.problemType); // 'interpersonal'
```

### Example 6: Environmental Factors

```typescript
const result = await selector.selectVariant({
  userInput: 'Implement this new feature',
  environmentalFactors: {
    batteryLevel: 15, // Low battery
    recentFailures: 5, // Many recent failures
    consecutiveTasks: 12 // Many tasks in a row
  }
});

// Will prefer efficient, reliable variants
console.log(result.selectedVariant); // 'drone' or 'ranger'
```

---

## Learning & Adaptation

### Recording Outcomes

```typescript
// After task completion, update the outcome
selector.updateOutcome('drone', 'success');
selector.updateOutcome('ranger', 'success');
selector.updateOutcome('queen', 'partial');
selector.updateOutcome('crew', 'failure');

// Optionally with user feedback
selector.updateOutcome('captain', 'success', 5); // 5-star rating
```

### Viewing Statistics

```typescript
// Get success rates for each variant
const rates = selector.getSuccessRates();
console.log(rates);
// {
//   drone: 0.78,
//   crew: 0.72,
//   ranger: 0.85,
//   queen: 0.75,
//   captain: 0.88
// }

// Get selection statistics
const stats = selector.getStatistics();
console.log(stats);
// {
//   totalSelections: 142,
//   variantCounts: { drone: 35, crew: 22, ranger: 38, queen: 15, captain: 32 },
//   averageConfidence: 0.76,
//   successRate: 0.82
// }

// Get selection history
const history = selector.getSelectionHistory(10);
console.log(history);
// [
//   {
//     timestamp: '2025-01-17T...',
//     context: { userInput: '...', ... },
//     selectedVariant: 'ranger',
//     confidence: 0.85,
//     outcome: 'success'
//   },
//   ...
// ]
```

---

## Scoring Factor Breakdown

### Problem Type Match (25% weight)

| Variant | Technical | Strategic | Interpersonal | Crisis | Routine |
|---------|-----------|-----------|---------------|--------|---------|
| Drone | 1.0 | 0.3 | 0.3 | 0.3 | 1.0 |
| Crew | 0.3 | 0.3 | 1.0 | 0.3 | 1.0 |
| Ranger | 1.0 | 0.3 | 0.3 | 1.0 | 0.3 |
| Queen | 0.3 | 1.0 | 0.3 | 1.0 | 0.3 |
| Captain | 0.3 | 1.0 | 1.0 | 0.3 | 0.3 |

### Mood Alignment (15% weight)

| Variant | Frustrated | Demanding | Collaborative | Focused | Appreciative |
|---------|------------|-----------|---------------|---------|--------------|
| Drone | 0.9 | 0.8 | 0.5 | 1.0 | 0.5 |
| Crew | 0.5 | 0.5 | 1.0 | 0.7 | 0.9 |
| Ranger | 1.0 | 0.8 | 0.5 | 0.8 | 0.5 |
| Queen | 0.9 | 1.0 | 0.5 | 0.7 | 0.5 |
| Captain | 0.7 | 0.7 | 0.9 | 0.9 | 0.8 |

### Complexity Fit (15% weight)

- **Drone:** Best for low-medium (< 0.6)
- **Crew:** Best for medium (~0.5)
- **Ranger:** Best for medium-high (> 0.5)
- **Queen:** Best for high (> 0.7)
- **Captain:** Good for all levels (0.9)

### Urgency Response (15% weight)

- **Drone:** Fast but not critical (< 0.8)
- **Crew:** Not ideal for urgent (< 0.5)
- **Ranger:** Excellent for urgent (> 0.6)
- **Queen:** Best for critical (> 0.8)
- **Captain:** Good for all levels (0.85)

### Emotional Fit (10% weight)

- **Drone:** Low emotion (< 0.3)
- **Crew:** Moderate emotion (0.4-0.7)
- **Ranger:** Moderate-high (> 0.5)
- **Queen:** Low emotion (< 0.5)
- **Captain:** Balanced (0.85)

### Historical Success (10% weight)

Default initial rates:
- Drone: 75%
- Crew: 70%
- Ranger: 80%
- Queen: 70%
- Captain: 85%

Updates with learning rate of 0.1 (10% weight on new data).

### Environmental Fit (10% weight)

**Low Battery (<30%):** +0.2 for Drone, Ranger
**Recent Failures (>3):** +0.2 for Captain, Ranger
**Many Tasks (>10):** +0.1 for Drone, Queen

---

## Integration with Tactical Variants

The selector works with the existing TacticalVariants system:

```typescript
import TacticalVariants from './tactical-variants/TacticalVariants.js';
import TacticalVariantSelector from './core/tactical/TacticalVariantSelector.js';

// Create instances
const variants = new TacticalVariants(personality, memory);
const selector = new TacticalVariantSelector();

// Select variant automatically
const selection = await selector.selectVariant({
  userInput: 'Fix this bug immediately',
  urgencyLevel: 'critical'
});

// Invoke the selected variant
const response = await variants.invokeVariant(
  selection.selectedVariant,
  selection.tacticalContext
);

console.log(response);
```

---

## Best Practices

### 1. Provide Context

Always provide as much context as possible for better selection:

```typescript
const result = await selector.selectVariant({
  userInput: 'Deploy the application',
  problemComplexity: 'high',
  urgencyLevel: 'medium',
  userMood: 'focused',
  requiresAuthority: true,
  environmentalFactors: {
    batteryLevel: 85,
    recentFailures: 0,
    consecutiveTasks: 3
  }
});
```

### 2. Update Outcomes

Train the system by providing feedback:

```typescript
// After task completion
const wasSuccessful = evaluateTaskOutcome();
selector.updateOutcome(
  result.selectedVariant,
  wasSuccessful ? 'success' : 'failure',
  userRating // 1-5
);
```

### 3. Monitor Confidence

Check confidence levels and handle low confidence:

```typescript
if (result.confidence < 0.7) {
  console.warn('Low confidence selection, consider manual override');
  console.log('Alternatives:', result.alternativeVariants);
}
```

### 4. Review Statistics

Periodically review selection performance:

```typescript
const stats = selector.getStatistics();
if (stats.successRate < 0.7) {
  console.warn('Low success rate, review selection patterns');
}
```

---

## Performance Characteristics

- **Selection Time:** <5ms typical
- **Memory Usage:** ~1KB per history entry
- **Max History:** 1,000 entries
- **Confidence Threshold:** 60%
- **Learning Rate:** 10%

---

## Testing

Run the comprehensive test suite:

```bash
npm test tests/tactical/TacticalVariantSelector.test.ts
```

**Test Coverage:**
- ✅ Basic selection for all problem types
- ✅ User mood handling (5 moods)
- ✅ Complexity & urgency combinations
- ✅ Confidence level calculation
- ✅ Problem type detection (keywords)
- ✅ Environmental factors
- ✅ Learning & adaptation
- ✅ Tactical context generation
- ✅ Edge cases (empty, ambiguous, conflicting)
- ✅ Variant-specific scenarios

---

## Troubleshooting

### Low Confidence Selections

**Symptom:** Many selections with confidence < 60%

**Causes:**
- Ambiguous user input
- Conflicting signals
- Insufficient context

**Solutions:**
- Request more context from user
- Improve problem type detection patterns
- Review and adjust factor weights

### Incorrect Variant Selection

**Symptom:** Wrong variant chosen for situation

**Causes:**
- Poor historical data
- Incorrect factor scoring
- Missing context

**Solutions:**
- Update outcomes to train the system
- Review scoring factors for that problem type
- Provide more detailed context

### Low Success Rate

**Symptom:** Success rate < 70%

**Causes:**
- Poor training data
- Inappropriate factor weights
- System not learning

**Solutions:**
- Consistently update outcomes
- Review factor weights
- Check that learning is enabled

---

## Future Enhancements

- **Deep Learning:** Neural network for pattern recognition
- **Context Memory:** Remember user preferences
- **Multi-Agent:** Consider multiple variants simultaneously
- **Real-time Adaptation:** Faster learning rate
- **Explainability:** Detailed factor breakdown visualization
- **A/B Testing:** Test different scoring algorithms

---

## Related Systems

- **TacticalVariants** (`tactical-variants/TacticalVariants.ts`) - Variant invocation
- **EmotionalStateMachine** (`core/emotions/EmotionalStateMachine.ts`) - Emotional context
- **SevenBridge** (`core/routing/SevenBridge.ts`) - Messaging layer
- **Memory Engine** - Historical pattern storage

---

## License

MIT License - Part of Seven of Nine Core Architecture

---

## References

- Tactical Variants Architecture: `gemini_docs/architecture/Tactical_Variants.md`
- Blueprint Specification: `gemini_docs/guides/blueprint_spec.md`
- Decision Theory and Multi-Criteria Decision Making
- Adaptive Learning Systems
