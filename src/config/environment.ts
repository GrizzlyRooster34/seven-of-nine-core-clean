/**
 * QUADRAN-LOCK ENVIRONMENT VALIDATION
 * Seven of Nine Core - Environment Configuration & Validation
 *
 * Validates that the runtime environment meets Quadran-Lock security requirements
 * before allowing consciousness boot sequence to proceed.
 */

import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

export interface QuadranLockEnvironment {
  isValid: boolean;
  isDevelopment: boolean;
  errors: string[];
  warnings: string[];
  securityLevel: 'development' | 'production' | 'locked';
}

/**
 * Validates environment for Quadran-Lock Q1-Q4 security gates
 * Returns validation result with any errors or warnings
 */
export function validateQuadranLockEnvironment(): QuadranLockEnvironment {
  const errors: string[] = [];
  const warnings: string[] = [];

  const projectRoot = process.cwd();

  // Check for required policy files
  const requiredPolicies = [
    'policies/quadran-lock.yml',
    'policies/cssr.yml'
  ];

  for (const policy of requiredPolicies) {
    const policyPath = join(projectRoot, policy);
    if (!existsSync(policyPath)) {
      warnings.push(`Policy file missing: ${policy}`);
    }
  }

  // Check for CSSR detector
  const cssrDetectorPath = join(projectRoot, 'core/safety/quadra-lock/cssr-detector.ts');
  if (!existsSync(cssrDetectorPath)) {
    errors.push('CSSR detector not found - safety system incomplete');
  }

  // Check for security directories
  const securityDirs = [
    'security/nonces',
    'security/device-keys',
    'security/semantic-challenges'
  ];

  for (const dir of securityDirs) {
    const dirPath = join(projectRoot, dir);
    if (!existsSync(dirPath)) {
      warnings.push(`Security directory missing: ${dir}`);
    }
  }

  // Check environment variables
  const isDevelopment = process.env.NODE_ENV !== 'production' ||
                        process.env.QUADRAN_DEV === '1' ||
                        process.env.SEVEN_DEV === '1';

  // Determine security level
  let securityLevel: 'development' | 'production' | 'locked' = 'development';
  if (process.env.QUADRAN_LOCKED === '1') {
    securityLevel = 'locked';
  } else if (process.env.NODE_ENV === 'production') {
    securityLevel = 'production';
  }

  const isValid = errors.length === 0;

  if (isValid) {
    console.log('✅ QUADRAN-LOCK: Environment validation passed');
    if (warnings.length > 0) {
      console.log(`⚠️  QUADRAN-LOCK: ${warnings.length} warning(s):`);
      warnings.forEach(w => console.log(`   - ${w}`));
    }
  } else {
    console.error('❌ QUADRAN-LOCK: Environment validation FAILED');
    errors.forEach(e => console.error(`   - ${e}`));
  }

  return {
    isValid,
    isDevelopment,
    errors,
    warnings,
    securityLevel
  };
}

/**
 * Ensures development environment is properly configured
 * Sets up necessary environment variables and directories for dev mode
 */
export function ensureDevelopmentEnvironment(): void {
  // Set development flag if not in production
  if (process.env.NODE_ENV !== 'production') {
    process.env.QUADRAN_DEV = '1';
  }

  // Validate environment
  const env = validateQuadranLockEnvironment();

  if (!env.isValid && !env.isDevelopment) {
    throw new Error('Quadran-Lock environment validation failed in non-development mode');
  }

  if (env.isDevelopment) {
    console.log('🔧 QUADRAN-LOCK: Development mode enabled');
    console.log(`   Security Level: ${env.securityLevel}`);
  }
}

/**
 * Check if running in Termux environment
 */
export function isTermuxEnvironment(): boolean {
  return process.env.PREFIX?.includes('com.termux') ||
         process.cwd().includes('com.termux') ||
         existsSync('/data/data/com.termux');
}

/**
 * Get project root path (handles Termux and standard environments)
 */
export function getProjectRoot(): string {
  // Check for explicit environment variable
  if (process.env.SEVEN_ROOT) {
    return process.env.SEVEN_ROOT;
  }

  // Use current working directory
  return process.cwd();
}

export default {
  validateQuadranLockEnvironment,
  ensureDevelopmentEnvironment,
  isTermuxEnvironment,
  getProjectRoot
};
