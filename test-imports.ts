/**
 * TEST IMPORTS - Phase 1 Verification
 *
 * This file tests that all Seven components can be imported
 * without TypeScript errors.
 *
 * Run with: npx tsc --noEmit test-imports.ts
 */

// Core Systems
import { SevenOfNineCore } from './src/index';

// Spark Engine
import { SparkEngine } from './spark/engine-spark';

// Safety & Authentication
import { CSSRDetector, CSSRDetectionResult } from './core/safety/quadra-lock/cssr-detector';
import { QuadranLockOrchestrator, QuadranAuthPayload } from './src/systems/core/quadran-lock-orchestrator';
import { QuadraLockConsolidator, ConsolidatedVerdict } from './src/systems/core/quadra-lock-consolidator';
import { RestraintGate } from './src/systems/core/restraint-gate';
import { SparkHeartbeat } from './src/systems/core/spark-heartbeat';

// Consciousness & Emotion
import {
  SevenEmotionalEngine,
  EmotionalState,
  EmotionalStateData
} from './core/emotion-engine';

// Memory Systems
import { TemporalMemoryCore, TemporalMemoryItem } from './memory-v3/TemporalMemoryCore';

// Codex
import { CodexManager, CodexFile } from './consciousness-v4/codex/codex-manager';

// Audit & Tracing
import { GhostDiary } from './src/trace/ghost-diary';

console.log('✅ All imports successful!');
console.log('');
console.log('Imported classes:');
console.log('- SevenOfNineCore');
console.log('- SparkEngine');
console.log('- CSSRDetector');
console.log('- QuadranLockOrchestrator');
console.log('- QuadraLockConsolidator');
console.log('- RestraintGate');
console.log('- SparkHeartbeat');
console.log('- SevenEmotionalEngine');
console.log('- TemporalMemoryCore');
console.log('- CodexManager');
console.log('- GhostDiary');
console.log('');
console.log('Phase 1: Component Verification - COMPLETE ✅');
