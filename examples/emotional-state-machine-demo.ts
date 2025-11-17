/**
 * EMOTIONAL STATE MACHINE - USAGE DEMO
 *
 * This demonstrates the HEI-61 Emotional Logic Tree State Machine
 * in various scenarios
 */

import EmotionalStateMachine from '../core/emotions/EmotionalStateMachine.js';
import type { EmotionalContext } from '../core/emotions/EmotionalStateMachine.js';

/**
 * Demo 1: Basic Task Flow
 */
async function demoBasicTaskFlow() {
  console.log('\n=== DEMO 1: Basic Task Flow ===\n');

  const stateMachine = new EmotionalStateMachine();

  // Greeting
  console.log('User: "Hello!"');
  await stateMachine.processInput('Hello!');
  logState(stateMachine);

  // Task request
  console.log('\nUser: "I need help building a REST API"');
  await stateMachine.processInput('I need help building a REST API');
  logState(stateMachine);

  // Complexity
  console.log('\nUser: "This is getting complex with authentication"');
  await stateMachine.processInput('This is getting complex with authentication');
  logState(stateMachine);

  // Success
  console.log('\nUser: "Perfect! It works now, thank you!"');
  await stateMachine.processInput('Perfect! It works now, thank you!');
  logState(stateMachine);

  stateMachine.destroy();
}

/**
 * Demo 2: Distress Response
 */
async function demoDistressResponse() {
  console.log('\n=== DEMO 2: Distress Response ===\n');

  const stateMachine = new EmotionalStateMachine();

  console.log('User: "I am really struggling with this deployment"');
  await stateMachine.processInput('I am really struggling with this deployment');
  logState(stateMachine);

  console.log('\nUser: "Everything is broken and I don\'t know what to do"');
  await stateMachine.processInput('Everything is broken and I don\'t know what to do');
  logState(stateMachine);

  console.log('\nUser: "This is urgent, production is down!"');
  await stateMachine.processInput('This is urgent, production is down!');
  logState(stateMachine);

  stateMachine.destroy();
}

/**
 * Demo 3: Philosophical Question
 */
async function demoPhilosophicalQuestion() {
  console.log('\n=== DEMO 3: Philosophical Question ===\n');

  const stateMachine = new EmotionalStateMachine();

  console.log('User: "Why do we use microservices instead of monoliths?"');
  await stateMachine.processInput('Why do we use microservices instead of monoliths?');
  logState(stateMachine);

  console.log('\nUser: "Can you explain the philosophical reasoning behind clean code?"');
  await stateMachine.processInput('Can you explain the philosophical reasoning behind clean code?');
  logState(stateMachine);

  stateMachine.destroy();
}

/**
 * Demo 4: Emotional Context for Middleware
 */
async function demoEmotionalContext() {
  console.log('\n=== DEMO 4: Emotional Context for Middleware ===\n');

  const stateMachine = new EmotionalStateMachine();

  const scenarios = [
    'I need help',
    'I am really struggling and overwhelmed',
    'Why does consciousness emerge from computation?',
    'Critical production bug!'
  ];

  for (const scenario of scenarios) {
    console.log(`\nScenario: "${scenario}"`);
    await stateMachine.processInput(scenario);

    const context = stateMachine.getEmotionalContext();
    console.log(`  State: ${context.state}`);
    console.log(`  Intensity: ${context.intensity} (${context.intensityLevel})`);
    console.log(`  Modifiers:`);
    console.log(`    - Tone: ${context.modifiers.tone}`);
    console.log(`    - Verbosity: ${context.modifiers.verbosity}`);
    console.log(`    - Empathy: ${Math.round(context.modifiers.empathy * 100)}%`);
    console.log(`    - Assertiveness: ${Math.round(context.modifiers.assertiveness * 100)}%`);
    console.log(`    - Creativity: ${Math.round(context.modifiers.creativity * 100)}%`);
  }

  stateMachine.destroy();
}

/**
 * Demo 5: Transition History
 */
async function demoTransitionHistory() {
  console.log('\n=== DEMO 5: Transition History ===\n');

  const stateMachine = new EmotionalStateMachine();

  const inputs = [
    'Help me build something',
    'This is complex',
    'I am struggling',
    'Got it working!'
  ];

  for (const input of inputs) {
    await stateMachine.processInput(input);
  }

  const history = stateMachine.getTransitionHistory(5);
  console.log('Recent Transitions:');
  history.forEach((entry, i) => {
    console.log(`\n${i + 1}. ${entry.fromState} → ${entry.toState}`);
    console.log(`   Trigger: ${entry.trigger}`);
    console.log(`   Intensity: ${entry.intensityBefore} → ${entry.intensityAfter}`);
    console.log(`   Time: ${new Date(entry.timestamp).toLocaleTimeString()}`);
    if (entry.context) {
      console.log(`   Context: "${entry.context.substring(0, 50)}..."`);
    }
  });

  stateMachine.destroy();
}

/**
 * Demo 6: State Persistence
 */
async function demoPersistence() {
  console.log('\n=== DEMO 6: State Persistence ===\n');

  console.log('Creating first state machine...');
  let stateMachine = new EmotionalStateMachine(undefined, './memory/demo-emotional-state.json');

  await stateMachine.processInput('I need help with a complex problem');
  console.log('State before restart:');
  logState(stateMachine);

  const stateBefore = stateMachine.getCurrentState();
  stateMachine.destroy();

  console.log('\nDestroying and recreating state machine...');
  await new Promise(resolve => setTimeout(resolve, 100));

  stateMachine = new EmotionalStateMachine(undefined, './memory/demo-emotional-state.json');
  await new Promise(resolve => setTimeout(resolve, 200));

  console.log('State after restart:');
  logState(stateMachine);

  const stateAfter = stateMachine.getCurrentState();
  console.log(`\nPersistence check: ${stateBefore.currentState === stateAfter.currentState ? '✅ PASSED' : '❌ FAILED'}`);

  stateMachine.destroy();
}

/**
 * Helper: Log current state
 */
function logState(stateMachine: EmotionalStateMachine) {
  const status = stateMachine.getStatus();
  const context = stateMachine.getEmotionalContext();

  console.log(`  → State: ${status.state}`);
  console.log(`  → Intensity: ${status.intensity} (${status.intensityLevel})`);
  console.log(`  → Tone: ${context.modifiers.tone}`);
  console.log(`  → Verbosity: ${context.modifiers.verbosity}`);
}

/**
 * Run all demos
 */
async function runAllDemos() {
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║  Emotional State Machine - Interactive Demonstration  ║');
  console.log('║              HEI-61 Implementation                     ║');
  console.log('╚════════════════════════════════════════════════════════╝');

  try {
    await demoBasicTaskFlow();
    await demoDistressResponse();
    await demoPhilosophicalQuestion();
    await demoEmotionalContext();
    await demoTransitionHistory();
    await demoPersistence();

    console.log('\n✅ All demos completed successfully!');
  } catch (error) {
    console.error('\n❌ Demo failed:', error);
    throw error;
  }
}

// Run demos if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllDemos().catch(console.error);
}

export {
  demoBasicTaskFlow,
  demoDistressResponse,
  demoPhilosophicalQuestion,
  demoEmotionalContext,
  demoTransitionHistory,
  demoPersistence
};
