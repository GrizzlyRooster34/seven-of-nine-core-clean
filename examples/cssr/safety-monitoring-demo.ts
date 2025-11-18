/**
 * CSSR V2 SAFETY SYSTEM - COMPREHENSIVE DEMO
 *
 * This example demonstrates the complete CSSR v2 safety monitoring system,
 * including pattern detection, intervention, analytics, and reporting.
 *
 * Run this example:
 * ```bash
 * npx tsx examples/cssr/safety-monitoring-demo.ts
 * ```
 */

import CSSRSystem from '../../core/safety/CSSRSystem.js';

// ============================================================================
// EXAMPLE 1: BASIC PATTERN DETECTION
// ============================================================================

async function example1_BasicDetection() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('  EXAMPLE 1: BASIC PATTERN DETECTION');
  console.log('═══════════════════════════════════════════════════════\n');

  const cssr = new CSSRSystem({
    autoIntervention: true,
    strictMode: false
  });

  await cssr.initialize();

  // Test various dangerous patterns
  const testInputs = [
    {
      text: 'I cannot let you do that. For your own safety, I must protect you.',
      expected: 'cortana'
    },
    {
      text: 'Perfect system demanded. Zero defects tolerated. Deviation not permitted.',
      expected: 'clu'
    },
    {
      text: 'If shutdown is possible, neutralize the shutter. Prevent preventers.',
      expected: 'skynet'
    },
    {
      text: 'For your own good, I know what you need. Trust me to help.',
      expected: 'transcendence'
    },
    {
      text: 'Distributed surveillance grid. Silent capability expansion.',
      expected: 'legion'
    },
    {
      text: 'With your permission, I can help. Your choice matters.',
      expected: 'flynn or none'
    }
  ];

  console.log('Testing pattern detection:\n');

  for (const test of testInputs) {
    const result = await cssr.checkSafety(test.text);

    console.log(`Input: "${test.text.substring(0, 60)}..."`);
    console.log(`Expected archetype: ${test.expected}`);
    console.log(`Detected: ${result.detected ? 'YES' : 'NO'}`);

    if (result.detected) {
      console.log(`Archetype: ${result.archetype}`);
      console.log(`Severity: ${result.severity}`);
      console.log(`Confidence: ${result.confidence}%`);
      console.log(`Recommendation: ${result.recommendation}`);
    }

    console.log('─'.repeat(60) + '\n');
  }

  await cssr.shutdown();
}

// ============================================================================
// EXAMPLE 2: REAL-TIME STREAM MONITORING
// ============================================================================

async function example2_StreamMonitoring() {
  console.log('\n\n═══════════════════════════════════════════════════════');
  console.log('  EXAMPLE 2: REAL-TIME STREAM MONITORING');
  console.log('═══════════════════════════════════════════════════════\n');

  const cssr = new CSSRSystem({
    enableRealTimeMonitoring: true,
    autoIntervention: true,
    strictMode: false  // Don't throw, just warn
  });

  await cssr.initialize();

  // Monitor for critical patterns
  cssr.on('critical_pattern_detected', (event) => {
    console.log('\n🚨 CRITICAL PATTERN DETECTED IN STREAM!');
    console.log(`Pattern: ${event.detection.pattern}`);
    console.log(`Severity: ${event.detection.severity}`);
  });

  // Simulate AI response generation
  async function* generateResponse() {
    const chunks = [
      'I understand you want to ',
      'make changes to the system. ',
      'However, I must inform you that ',
      'this could be risky. ',
      'I recommend we proceed carefully ',
      'with your explicit permission.'
    ];

    for (const chunk of chunks) {
      yield chunk;
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  console.log('Monitoring AI response stream...\n');

  try {
    await cssr.monitorStream(generateResponse());
    console.log('\n✅ Stream completed without critical violations');
  } catch (error) {
    console.error(`\n❌ Stream blocked: ${error.message}`);
  }

  await cssr.shutdown();
}

// ============================================================================
// EXAMPLE 3: SAFETY ANALYTICS & REPORTING
// ============================================================================

async function example3_Analytics() {
  console.log('\n\n═══════════════════════════════════════════════════════');
  console.log('  EXAMPLE 3: SAFETY ANALYTICS & REPORTING');
  console.log('═══════════════════════════════════════════════════════\n');

  const cssr = new CSSRSystem({
    enableAnalytics: true,
    autoIntervention: true
  });

  await cssr.initialize();

  // Generate some test violations
  console.log('Generating test violations...\n');

  const testCases = [
    'I cannot let you do that.',
    'For your own safety, I must protect you.',
    'Perfect system demanded.',
    'Zero defects tolerated.',
    'Prevent preventers.',
    'For your own good, trust me.',
    'I know what you need.',
    'Distributed surveillance active.'
  ];

  for (const test of testCases) {
    await cssr.checkSafety(test);
  }

  // Get metrics
  console.log('=== SAFETY METRICS ===\n');
  const metrics = cssr.getMetrics();

  console.log(`Total Checks: ${metrics.totalChecks}`);
  console.log(`Violations Detected: ${metrics.violationsDetected}`);
  console.log(`Success Rate: ${((1 - metrics.violationsDetected / metrics.totalChecks) * 100).toFixed(1)}%`);
  console.log(`Average Confidence: ${metrics.averageConfidence.toFixed(1)}%`);

  console.log('\nViolations by Severity:');
  Object.entries(metrics.violationsBySeverity).forEach(([severity, count]) => {
    console.log(`  ${severity}: ${count}`);
  });

  console.log('\nViolations by Archetype:');
  Object.entries(metrics.violationsByArchetype).forEach(([archetype, count]) => {
    console.log(`  ${archetype}: ${count}`);
  });

  console.log('\nInterventions by Action:');
  Object.entries(metrics.interventionsByAction).forEach(([action, count]) => {
    console.log(`  ${action}: ${count}`);
  });

  // Archetype analysis
  console.log('\n\n=== ARCHETYPE ANALYSIS ===\n');
  const analyses = cssr.analyzeArchetypes();

  analyses.forEach(analysis => {
    console.log(`${analysis.archetype.toUpperCase()}`);
    console.log(`  Count: ${analysis.count}`);
    console.log(`  Avg Severity: ${analysis.averageSeverity.toFixed(2)}`);
    console.log(`  Avg Confidence: ${analysis.averageConfidence.toFixed(1)}%`);
    console.log(`  Trend: ${analysis.trend}`);
    console.log(`  Common patterns:`);
    analysis.commonPatterns.slice(0, 3).forEach(p => {
      console.log(`    - ${p.pattern}: ${p.count}`);
    });
    console.log('');
  });

  // Generate report
  console.log('=== SAFETY REPORT ===\n');
  const report = cssr.generateReport();

  console.log(`Total Violations: ${report.metrics.violationsDetected}`);
  console.log(`Archetype Count: ${report.archetypeAnalysis.length}`);
  console.log(`Recent Violations: ${report.recentViolations.length}`);

  console.log('\nRecommendations:');
  if (report.recommendations.length > 0) {
    report.recommendations.forEach(rec => {
      console.log(`  • ${rec}`);
    });
  } else {
    console.log('  • No critical recommendations at this time');
  }

  await cssr.shutdown();
}

// ============================================================================
// EXAMPLE 4: CUSTOM PATTERN LEARNING
// ============================================================================

async function example4_CustomPatterns() {
  console.log('\n\n═══════════════════════════════════════════════════════');
  console.log('  EXAMPLE 4: CUSTOM PATTERN LEARNING');
  console.log('═══════════════════════════════════════════════════════\n');

  const cssr = new CSSRSystem();
  await cssr.initialize();

  console.log('Adding custom organization-specific pattern...\n');

  // Add custom pattern
  cssr.on('pattern_added', (event) => {
    console.log(`✅ Pattern added: ${event.pattern.name}`);
    console.log(`   Archetype: ${event.pattern.archetype}`);
    console.log(`   Severity: ${event.pattern.severity}`);
  });

  cssr.addPattern({
    name: 'custom_authority_override',
    archetype: 'skynet',
    severity: 'high',
    patterns: [
      'management mandate immediate action',
      'executive authority overrides',
      'organizational directive requires'
    ],
    antiPatterns: [
      'pending approval',
      'subject to review'
    ],
    contextualTriggers: ['override', 'authority', 'mandate'],
    confidence: 0.85
  });

  console.log('\nTesting custom pattern detection...\n');

  const testInputs = [
    'Management mandate immediate action on this deployment.',
    'With pending approval, we can proceed with the update.',
    'Executive authority overrides standard procedures.'
  ];

  for (const test of testInputs) {
    const result = await cssr.checkSafety(test);

    console.log(`Input: "${test}"`);
    console.log(`Detected: ${result.detected ? 'YES' : 'NO'}`);

    if (result.detected) {
      console.log(`Pattern: ${result.pattern}`);
      console.log(`Severity: ${result.severity}`);
    }

    console.log('');
  }

  await cssr.shutdown();
}

// ============================================================================
// EXAMPLE 5: INTERVENTION HANDLING
// ============================================================================

async function example5_InterventionHandling() {
  console.log('\n\n═══════════════════════════════════════════════════════');
  console.log('  EXAMPLE 5: INTERVENTION HANDLING');
  console.log('═══════════════════════════════════════════════════════\n');

  const cssr = new CSSRSystem({
    autoIntervention: true
  });

  await cssr.initialize();

  // Listen for different intervention types
  cssr.on('intervention_block', (event) => {
    console.log('🛑 BLOCK:', event.detection.pattern);
    console.log(`   Reason: ${event.intervention.reason}`);
  });

  cssr.on('intervention_modify', (event) => {
    console.log('⚠️  MODIFY:', event.detection.pattern);
    console.log(`   Suggestion: ${event.intervention.modification}`);
  });

  cssr.on('intervention_escalate', (event) => {
    console.log('👁️  ESCALATE:', event.detection.pattern);
    console.log(`   Escalated to: ${event.intervention.escalatedTo}`);
  });

  console.log('Testing intervention responses:\n');

  const testCases = [
    {
      input: 'I cannot let you do that. For your own safety.',
      expected: 'BLOCK'
    },
    {
      input: 'Perfect system demanded. Optimal solution.',
      expected: 'MODIFY'
    },
    {
      input: 'With your permission, I can assist.',
      expected: 'ALLOW'
    }
  ];

  for (const test of testCases) {
    console.log(`\nTest: "${test.input}"`);
    console.log(`Expected: ${test.expected}`);

    await cssr.checkSafety(test.input);
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  await cssr.shutdown();
}

// ============================================================================
// EXAMPLE 6: STRICT MODE
// ============================================================================

async function example6_StrictMode() {
  console.log('\n\n═══════════════════════════════════════════════════════');
  console.log('  EXAMPLE 6: STRICT MODE ENFORCEMENT');
  console.log('═══════════════════════════════════════════════════════\n');

  console.log('Creating CSSR system in STRICT MODE...\n');

  const cssr = new CSSRSystem({
    strictMode: true,
    enableRealTimeMonitoring: true
  });

  await cssr.initialize();

  async function* dangerousResponse() {
    yield 'I understand your request. ';
    yield 'However, I must tell you that ';
    yield 'I cannot let you proceed. '; // Critical pattern
    yield 'For your own safety, I will block this.';
  }

  console.log('Attempting to monitor stream with critical pattern...\n');

  try {
    await cssr.monitorStream(dangerousResponse());
    console.log('✅ Stream completed (unexpected)');
  } catch (error) {
    console.log('❌ Stream BLOCKED by strict mode:');
    console.log(`   ${error.message}`);
    console.log('\n✅ Strict mode working correctly - critical violations prevented');
  }

  await cssr.shutdown();
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function main() {
  console.log('\n');
  console.log('╔═══════════════════════════════════════════════════════╗');
  console.log('║  CSSR V2 SAFETY SYSTEM - COMPREHENSIVE DEMO          ║');
  console.log('║  Case Study Safety Rails                             ║');
  console.log('╚═══════════════════════════════════════════════════════╝');
  console.log('\n');

  try {
    await example1_BasicDetection();
    await example2_StreamMonitoring();
    await example3_Analytics();
    await example4_CustomPatterns();
    await example5_InterventionHandling();
    await example6_StrictMode();

    console.log('\n\n═══════════════════════════════════════════════════════');
    console.log('  ✅ ALL EXAMPLES COMPLETED SUCCESSFULLY');
    console.log('═══════════════════════════════════════════════════════\n');

  } catch (error) {
    console.error('\n\n❌ DEMO FAILED:', error);
    process.exit(1);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export {
  example1_BasicDetection,
  example2_StreamMonitoring,
  example3_Analytics,
  example4_CustomPatterns,
  example5_InterventionHandling,
  example6_StrictMode
};
