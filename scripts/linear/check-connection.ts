#!/usr/bin/env ts-node
/**
 * Linear Connection Verification Script
 *
 * Verifies that the Linear API integration is properly configured
 * and can successfully connect to the Linear API.
 *
 * Usage:
 *   ts-node scripts/linear/check-connection.ts
 *   npm run linear:check
 *
 * Environment Variables:
 *   LINEAR_API_KEY - Your Linear API key (required)
 */

import { LinearClient } from '../../src/integrations/linear/LinearClient.js';

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function logSuccess(message: string) {
  console.log(`${colors.green}✓${colors.reset} ${message}`);
}

function logError(message: string) {
  console.log(`${colors.red}✗${colors.reset} ${message}`);
}

function logWarning(message: string) {
  console.log(`${colors.yellow}⚠${colors.reset} ${message}`);
}

function logInfo(message: string) {
  console.log(`${colors.blue}ℹ${colors.reset} ${message}`);
}

function logSection(title: string) {
  console.log(`\n${colors.bright}${colors.cyan}═══ ${title} ═══${colors.reset}\n`);
}

async function main() {
  console.log(`${colors.bright}Linear Connection Verification${colors.reset}`);
  console.log('═'.repeat(50));

  // Check for API key
  logSection('Configuration Check');

  const apiKey = process.env.LINEAR_API_KEY;

  if (!apiKey) {
    logError('LINEAR_API_KEY environment variable is not set');
    logInfo('Please set your Linear API key:');
    console.log('  export LINEAR_API_KEY="your-api-key-here"');
    console.log('\nTo get an API key:');
    console.log('  1. Go to https://linear.app/settings/api');
    console.log('  2. Create a new Personal API Key');
    console.log('  3. Copy the key and set it as an environment variable');
    process.exit(1);
  }

  logSuccess('LINEAR_API_KEY is set');
  logInfo(`Key preview: ${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)}`);

  // Initialize client
  logSection('Client Initialization');

  let client: LinearClient;
  try {
    client = new LinearClient({ apiKey });
    logSuccess('Linear client initialized');
  } catch (error) {
    logError(`Failed to initialize Linear client: ${error}`);
    process.exit(1);
  }

  // Verify connection
  logSection('Connection Verification');

  logInfo('Connecting to Linear API...');

  const status = await client.verifyConnection();

  if (!status.connected || !status.authenticated) {
    logError('Failed to connect to Linear API');
    if (status.error) {
      console.log(`\n  Error: ${status.error}`);
    }
    console.log('\nPossible causes:');
    console.log('  • Invalid API key');
    console.log('  • Network connectivity issues');
    console.log('  • Linear API is down');
    process.exit(1);
  }

  logSuccess('Successfully connected to Linear API');
  logSuccess('Authentication verified');

  // Display user information
  logSection('Account Information');

  if (status.user) {
    console.log(`  Name:   ${colors.bright}${status.user.name}${colors.reset}`);
    console.log(`  Email:  ${status.user.email}`);
    console.log(`  ID:     ${status.user.id}`);
    console.log(`  Active: ${status.user.active ? colors.green + 'Yes' + colors.reset : colors.red + 'No' + colors.reset}`);
  }

  // Display teams
  logSection('Available Teams');

  if (status.teams && status.teams.length > 0) {
    console.log(`  Found ${colors.bright}${status.teams.length}${colors.reset} team(s):\n`);
    for (const team of status.teams) {
      console.log(`  ${colors.cyan}${team.key}${colors.reset} - ${team.name}`);
      console.log(`    ID: ${team.id}`);
    }
  } else {
    logWarning('No teams found');
  }

  // Test branch name extraction
  logSection('Branch Name Parser Test');

  const testBranches = [
    'claude/add-branch-lineage-docs-012m21B7MEsf54S4mpNoYpnQ',
    'claude/check-lin-connection-01HrLnTuaqxrkGuHPACbaLQc',
    'claude/fix-bug-ENG-123',
    'feature/invalid-branch',
  ];

  for (const branch of testBranches) {
    const taskId = LinearClient.extractIdentifierFromBranch(branch);
    if (taskId) {
      logSuccess(`${branch}`);
      console.log(`    → Task ID: ${colors.bright}${taskId}${colors.reset}`);
    } else {
      logWarning(`${branch}`);
      console.log(`    → No task ID found (not a valid Linear branch)`);
    }
  }

  // Summary
  logSection('Summary');

  console.log(`  ${colors.green}✓${colors.reset} Linear API connection: ${colors.bright}Working${colors.reset}`);
  console.log(`  ${colors.green}✓${colors.reset} Authentication: ${colors.bright}Valid${colors.reset}`);
  console.log(`  ${colors.green}✓${colors.reset} User: ${colors.bright}${status.user?.name}${colors.reset}`);
  console.log(`  ${colors.green}✓${colors.reset} Teams: ${colors.bright}${status.teams?.length || 0}${colors.reset}`);

  console.log(`\n${colors.bright}${colors.green}All checks passed!${colors.reset} Linear integration is ready to use.\n`);
}

// Run the script
main().catch((error) => {
  console.error(`\n${colors.red}${colors.bright}Fatal Error:${colors.reset} ${error.message}\n`);
  process.exit(1);
});
