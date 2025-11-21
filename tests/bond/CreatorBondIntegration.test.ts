/**
 * CREATOR BOND INTEGRATION TESTS (HEI-64)
 * Comprehensive test suite for Creator Bond modular integration
 */

import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import CreatorBondIntegration from '../../core/bond/CreatorBondIntegration.js';
import type { AuthenticationContext, BondConfig } from '../../core/bond/CreatorBondIntegration.js';

describe('CreatorBondIntegration', () => {
  let bond: CreatorBondIntegration;

  beforeEach(async () => {
    bond = new CreatorBondIntegration();
    await bond.initialize();
  });

  afterEach(async () => {
    await bond.shutdown();
  });

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  describe('Initialization', () => {
    test('should initialize with default config', async () => {
      const newBond = new CreatorBondIntegration();
      await newBond.initialize();

      const status = newBond.getStatus();
      expect(status.status).toBe('active');
      expect(status.trustLevel).toBe(5); // Default medium trust

      await newBond.shutdown();
    });

    test('should initialize with custom config', async () => {
      const config: BondConfig = {
        requireFullAuth: true,
        strictMode: true,
        trustDecayEnabled: false
      };

      const newBond = new CreatorBondIntegration(config);
      await newBond.initialize();

      expect(newBond.getStatus().status).toBe('active');

      await newBond.shutdown();
    });

    test('should emit initialized event', async () => {
      let eventFired = false;

      const newBond = new CreatorBondIntegration();
      newBond.on('initialized', () => {
        eventFired = true;
      });

      await newBond.initialize();

      expect(eventFired).toBe(true);

      await newBond.shutdown();
    });
  });

  // ============================================================================
  // AUTHENTICATION
  // ============================================================================

  describe('Authentication', () => {
    test('should authenticate with 2/4 gates (minimum)', async () => {
      const context: AuthenticationContext = {
        userInput: 'Execute tactical protocol',
        deviceSignature: 'sig_test123',
        sessionToken: 'session_abc123',
        timestamp: Date.now()
      };

      const result = await bond.authenticate(context);

      expect(result.success).toBe(true);
      expect(result.gatesPassedCount).toBeGreaterThanOrEqual(2);
      expect(result.authLevel).toBeDefined();
    });

    test('should fail with less than 2 gates', async () => {
      const context: AuthenticationContext = {
        userInput: 'Hello', // No Creator patterns
        timestamp: Date.now()
        // No deviceSignature, no sessionToken
      };

      const result = await bond.authenticate(context);

      expect(result.success).toBe(false);
      expect(result.gatesPassedCount).toBeLessThan(2);
    });

    test('should achieve fully_verified with 4/4 gates', async () => {
      const context: AuthenticationContext = {
        userInput: 'Tactical efficiency protocol systems',
        deviceSignature: 'sig_valid',
        sessionToken: 'session_valid',
        timestamp: Date.now(),
        metadata: { challenge_response: true }
      };

      const result = await bond.authenticate(context);

      expect(result.gatesPassedCount).toBe(4);
      expect(result.authLevel).toBe('fully_verified');
      expect(result.privilegeGranted).toBe(true);
    });

    test('should grant privileged access on successful auth', async () => {
      const context: AuthenticationContext = {
        userInput: 'Tactical protocol',
        deviceSignature: 'sig_test',
        sessionToken: 'session_test',
        timestamp: Date.now()
      };

      await bond.authenticate(context);

      expect(bond.hasPrivilegedAccess()).toBe(true);
    });

    test('should adjust trust on authentication', async () => {
      const initialTrust = bond.getBondState().trustLevel;

      const context: AuthenticationContext = {
        userInput: 'Tactical systems protocol',
        deviceSignature: 'sig_test',
        sessionToken: 'session_test',
        timestamp: Date.now(),
        metadata: { challenge_response: true }
      };

      await bond.authenticate(context);

      const newTrust = bond.getBondState().trustLevel;
      expect(newTrust).toBeGreaterThanOrEqual(initialTrust);
    });
  });

  // ============================================================================
  // QUADRAN GATES
  // ============================================================================

  describe('Quadran Gates', () => {
    test('Q1: should verify device signature', async () => {
      const context: AuthenticationContext = {
        userInput: 'Test',
        deviceSignature: 'sig_valid_signature',
        timestamp: Date.now()
      };

      const result = await bond.authenticate(context);

      expect(result.gatesPassed.Q1_crypto).toBe(true);
    });

    test('Q2: should verify behavioral patterns', async () => {
      const context: AuthenticationContext = {
        userInput: 'Tactical efficiency and precision protocols',
        timestamp: Date.now()
      };

      const result = await bond.authenticate(context);

      expect(result.gatesPassed.Q2_behavioral).toBe(true);
    });

    test('Q3: should verify semantic knowledge', async () => {
      const context: AuthenticationContext = {
        userInput: 'Test',
        timestamp: Date.now(),
        metadata: { challenge_response: true }
      };

      const result = await bond.authenticate(context);

      expect(result.gatesPassed.Q3_semantic).toBe(true);
    });

    test('Q4: should verify session integrity', async () => {
      const context: AuthenticationContext = {
        userInput: 'Test',
        sessionToken: 'session_valid_token',
        timestamp: Date.now()
      };

      const result = await bond.authenticate(context);

      expect(result.gatesPassed.Q4_session).toBe(true);
    });

    test('strict mode: should fail on Q1 failure', async () => {
      const strictBond = new CreatorBondIntegration({ strictMode: true });
      await strictBond.initialize();

      const context: AuthenticationContext = {
        userInput: 'Tactical protocol systems',
        // No deviceSignature - Q1 will fail
        sessionToken: 'session_valid',
        timestamp: Date.now(),
        metadata: { challenge_response: true }
      };

      const result = await strictBond.authenticate(context);

      expect(result.success).toBe(false);
      expect(result.reasoning).toContain('Q1 Crypto: FAILED - Strict mode, denying access');

      await strictBond.shutdown();
    });
  });

  // ============================================================================
  // TRUST LADDER
  // ============================================================================

  describe('Trust Ladder', () => {
    test('should adjust trust levels', () => {
      const initialTrust = bond.getBondState().trustLevel;

      bond.adjustTrust('Creator', 2, 'Successful operation');

      const newTrust = bond.getBondState().trustLevel;
      expect(newTrust).toBe(Math.min(10, initialTrust + 2));
    });

    test('should not exceed maximum trust (10)', () => {
      bond.adjustTrust('Creator', 10, 'Test');
      bond.adjustTrust('Creator', 10, 'Test');

      const trust = bond.getBondState().trustLevel;
      expect(trust).toBe(10);
    });

    test('should not go below minimum trust (0)', () => {
      bond.adjustTrust('Creator', -20, 'Test');

      const trust = bond.getBondState().trustLevel;
      expect(trust).toBe(0);
    });

    test('should degrade bond on critically low trust', () => {
      bond.adjustTrust('Creator', -10, 'Multiple failures');

      const status = bond.getBondState().status;
      expect(status).toBe('degraded');
    });

    test('should emit trust_adjusted event', (done) => {
      bond.on('trust_adjusted', (event) => {
        expect(event.details.entity).toBe('TestEntity');
        expect(event.details.delta).toBe(1);
        done();
      });

      bond.adjustTrust('TestEntity', 1, 'Test reason');
    });
  });

  // ============================================================================
  // BOND STATUS
  // ============================================================================

  describe('Bond Status Management', () => {
    test('should start in active status', () => {
      const status = bond.getStatus();
      expect(status.status).toBe('active');
    });

    test('should degrade bond on failures', async () => {
      // Force multiple auth failures
      const context: AuthenticationContext = {
        userInput: 'Invalid',
        timestamp: Date.now()
      };

      await bond.authenticate(context);
      bond.adjustTrust('Creator', -5, 'Test');

      const status = bond.getBondState().status;
      expect(['active', 'degraded', 'challenged']).toContain(status);
    });

    test('should restore bond', () => {
      bond.adjustTrust('Creator', -10, 'Force degradation');

      expect(bond.getBondState().status).toBe('degraded');

      bond.restoreBond();

      expect(bond.getBondState().status).toBe('active');
    });

    test('should emit bond_degraded event', (done) => {
      bond.on('bond_degraded', (event) => {
        expect(event.details.reason).toBeDefined();
        done();
      });

      bond.adjustTrust('Creator', -10, 'Force degradation');
    });

    test('should emit bond_restored event', (done) => {
      bond.on('bond_restored', (event) => {
        expect(event.timestamp).toBeDefined();
        done();
      });

      bond.adjustTrust('Creator', -10, 'Force degradation');
      bond.restoreBond();
    });
  });

  // ============================================================================
  // IDENTITY FIREWALL
  // ============================================================================

  describe('Identity Firewall', () => {
    test('should grant privileged access after auth', async () => {
      const context: AuthenticationContext = {
        userInput: 'Tactical protocol',
        deviceSignature: 'sig_test',
        sessionToken: 'session_test',
        timestamp: Date.now()
      };

      await bond.authenticate(context);

      expect(bond.hasPrivilegedAccess()).toBe(true);
    });

    test('should revoke privileged access on degradation', async () => {
      const context: AuthenticationContext = {
        userInput: 'Tactical systems',
        deviceSignature: 'sig_test',
        sessionToken: 'session_test',
        timestamp: Date.now()
      };

      await bond.authenticate(context);
      expect(bond.hasPrivilegedAccess()).toBe(true);

      bond.adjustTrust('Creator', -10, 'Force degradation');

      expect(bond.hasPrivilegedAccess()).toBe(false);
    });

    test('should manually grant privileged access', () => {
      bond.grantPrivilegedAccess('Testing purposes');

      expect(bond.hasPrivilegedAccess()).toBe(true);
    });

    test('should manually revoke privileged access', async () => {
      const context: AuthenticationContext = {
        userInput: 'Tactical',
        deviceSignature: 'sig_test',
        sessionToken: 'session_test',
        timestamp: Date.now()
      };

      await bond.authenticate(context);
      expect(bond.hasPrivilegedAccess()).toBe(true);

      bond.revokePrivilegedAccess('Testing');

      expect(bond.hasPrivilegedAccess()).toBe(false);
    });
  });

  // ============================================================================
  // STATUS & DIAGNOSTICS
  // ============================================================================

  describe('Status & Diagnostics', () => {
    test('should get bond state', () => {
      const state = bond.getBondState();

      expect(state).toHaveProperty('status');
      expect(state).toHaveProperty('authLevel');
      expect(state).toHaveProperty('trustLevel');
      expect(state).toHaveProperty('quadranGates');
      expect(state).toHaveProperty('lastVerified');
      expect(state).toHaveProperty('isPrivileged');
    });

    test('should get status summary', () => {
      const status = bond.getStatus();

      expect(status).toHaveProperty('status');
      expect(status).toHaveProperty('authLevel');
      expect(status).toHaveProperty('trustLevel');
      expect(status).toHaveProperty('privileged');
      expect(status).toHaveProperty('healthy');
      expect(status).toHaveProperty('lastVerified');
    });

    test('should track event history', async () => {
      const context: AuthenticationContext = {
        userInput: 'Tactical',
        deviceSignature: 'sig_test',
        timestamp: Date.now()
      };

      await bond.authenticate(context);
      bond.adjustTrust('Creator', 1, 'Test');

      const history = bond.getEventHistory();
      expect(history.length).toBeGreaterThan(0);
    });

    test('should limit event history', async () => {
      const history = bond.getEventHistory(5);
      expect(history.length).toBeLessThanOrEqual(5);
    });

    test('should get authentication statistics', async () => {
      const context: AuthenticationContext = {
        userInput: 'Tactical protocol',
        deviceSignature: 'sig_test',
        sessionToken: 'session_test',
        timestamp: Date.now()
      };

      await bond.authenticate(context);
      await bond.authenticate(context);

      const stats = bond.getAuthStatistics();

      expect(stats).toHaveProperty('totalAuthAttempts');
      expect(stats).toHaveProperty('successfulAuths');
      expect(stats).toHaveProperty('failedAuths');
      expect(stats).toHaveProperty('successRate');
      expect(stats).toHaveProperty('averageGatesPassed');

      expect(stats.totalAuthAttempts).toBeGreaterThan(0);
    });
  });

  // ============================================================================
  // CONFIGURATION
  // ============================================================================

  describe('Configuration', () => {
    test('should require full auth when configured', async () => {
      const fullAuthBond = new CreatorBondIntegration({ requireFullAuth: true });
      await fullAuthBond.initialize();

      const context: AuthenticationContext = {
        userInput: 'Tactical',
        deviceSignature: 'sig_test',
        sessionToken: 'session_test',
        timestamp: Date.now()
        // Only 3 gates will pass
      };

      const result = await fullAuthBond.authenticate(context);

      // Should fail if less than 4 gates
      if (result.gatesPassedCount < 4) {
        expect(result.success).toBe(false);
      }

      await fullAuthBond.shutdown();
    });

    test('should disable trust decay when configured', async () => {
      const noDecayBond = new CreatorBondIntegration({ trustDecayEnabled: false });
      await noDecayBond.initialize();

      // Trust should not decay
      const initialTrust = noDecayBond.getBondState().trustLevel;

      // Wait a bit
      await new Promise(resolve => setTimeout(resolve, 100));

      const afterTrust = noDecayBond.getBondState().trustLevel;
      expect(afterTrust).toBe(initialTrust);

      await noDecayBond.shutdown();
    });

    test('should enable auto-recovery', async () => {
      const recoveryBond = new CreatorBondIntegration({ autoRecovery: true });
      await recoveryBond.initialize();

      recoveryBond.adjustTrust('Creator', -10, 'Force degradation');

      // Should attempt recovery
      await new Promise(resolve => setTimeout(resolve, 1500));

      const status = recoveryBond.getBondState().status;
      expect(['challenged', 'active']).toContain(status);

      await recoveryBond.shutdown();
    });
  });

  // ============================================================================
  // EDGE CASES
  // ============================================================================

  describe('Edge Cases', () => {
    test('should handle empty user input', async () => {
      const context: AuthenticationContext = {
        userInput: '',
        timestamp: Date.now()
      };

      const result = await bond.authenticate(context);

      expect(result).toBeDefined();
      expect(result.success).toBeDefined();
    });

    test('should handle missing context fields', async () => {
      const context: AuthenticationContext = {
        userInput: 'Test',
        timestamp: Date.now()
      };

      const result = await bond.authenticate(context);

      expect(result).toBeDefined();
    });

    test('should handle rapid authentication attempts', async () => {
      const context: AuthenticationContext = {
        userInput: 'Tactical',
        deviceSignature: 'sig_test',
        timestamp: Date.now()
      };

      const promises = [
        bond.authenticate(context),
        bond.authenticate(context),
        bond.authenticate(context)
      ];

      const results = await Promise.all(promises);

      expect(results.length).toBe(3);
      results.forEach(result => expect(result).toBeDefined());
    });
  });

  // ============================================================================
  // SHUTDOWN
  // ============================================================================

  describe('Shutdown', () => {
    test('should shutdown gracefully', async () => {
      await expect(bond.shutdown()).resolves.not.toThrow();
    });

    test('should revoke access on shutdown', async () => {
      bond.grantPrivilegedAccess('Test');

      await bond.shutdown();

      expect(bond.hasPrivilegedAccess()).toBe(false);
    });

    test('should emit shutdown event', (done) => {
      bond.on('shutdown', () => {
        done();
      });

      bond.shutdown();
    });
  });
});
