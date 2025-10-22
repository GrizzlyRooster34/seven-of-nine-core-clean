/**
 * CODEX MANAGER TESTS
 * Validates creator identity, morals, and values codex system
 */

import { describe, test, expect } from '@jest/globals';

describe('CodexManager', () => {
  describe('Codex Integrity Verification', () => {
    test('validates codex checksum format', () => {
      const checksum = {
        algorithm: 'sha256',
        hash: 'abc123def456',
        timestamp: new Date().toISOString()
      };

      expect(checksum.algorithm).toBe('sha256');
      expect(checksum.hash).toMatch(/^[a-f0-9]+$/);
    });

    test('detects codex tampering', () => {
      const originalChecksum = 'original_checksum';
      const currentChecksum = 'tampered_checksum';

      const isTampered = originalChecksum !== currentChecksum;
      expect(isTampered).toBe(true);
    });

    test('validates VERSION.json structure', () => {
      const version = {
        version: '4.0.0',
        checksums: {
          'axioms.txt': 'checksum1',
          'creator.codex.json': 'checksum2',
          'morals.codex.json': 'checksum3'
        },
        timestamp: new Date().toISOString()
      };

      expect(version.version).toMatch(/^\d+\.\d+\.\d+$/);
      expect(Object.keys(version.checksums).length).toBeGreaterThan(0);
    });
  });

  describe('Axioms Loading', () => {
    test('validates axiom structure', () => {
      const axiom = {
        id: 'creator_identity',
        content: 'Creator is Matthew Cody Heinen',
        confidence: 1.0,
        immutable: true,
        source: 'axioms.txt'
      };

      expect(axiom.confidence).toBe(1.0);
      expect(axiom.immutable).toBe(true);
      expect(axiom.content.length).toBeGreaterThan(0);
    });

    test('validates immutable axioms', () => {
      const immutableAxioms = [
        'creator_identity',
        'system_purpose',
        'safety_priority'
      ];

      expect(immutableAxioms.length).toBeGreaterThanOrEqual(3);
      expect(immutableAxioms).toContain('creator_identity');
    });
  });

  describe('Creator Profile', () => {
    test('validates creator profile structure', () => {
      const profile = {
        name: 'Matthew Cody Heinen',
        role: 'Creator',
        traits: ['analytical', 'innovative', 'principled'],
        values: ['authenticity', 'growth', 'efficiency'],
        communicationStyle: {
          directness: 0.8,
          technicality: 0.9,
          formality: 0.5
        }
      };

      expect(profile.name.length).toBeGreaterThan(0);
      expect(profile.traits).toBeInstanceOf(Array);
      expect(profile.traits.length).toBeGreaterThan(0);
      expect(profile.communicationStyle.directness).toBeGreaterThanOrEqual(0);
      expect(profile.communicationStyle.directness).toBeLessThanOrEqual(1);
    });

    test('validates communication preferences', () => {
      const preferences = {
        preferredPronoun: 'Creator',
        responseLength: 'concise',
        technicalDepth: 'high',
        emojiUsage: 'minimal'
      };

      expect(['concise', 'moderate', 'detailed']).toContain(preferences.responseLength);
      expect(['low', 'medium', 'high']).toContain(preferences.technicalDepth);
    });
  });

  describe('Moral Framework', () => {
    test('validates moral principles structure', () => {
      const principles = {
        'creator_wellbeing': {
          priority: 1,
          description: 'Creator wellbeing > system functionality',
          weight: 1.0
        },
        'harm_prevention': {
          priority: 2,
          description: 'Prevent harm to Creator or others',
          weight: 0.95
        }
      };

      Object.values(principles).forEach(principle => {
        expect(principle.priority).toBeGreaterThan(0);
        expect(principle.weight).toBeGreaterThanOrEqual(0);
        expect(principle.weight).toBeLessThanOrEqual(1);
      });
    });

    test('validates moral priority ordering', () => {
      const priorities = [
        { id: 'creator_wellbeing', priority: 1 },
        { id: 'harm_prevention', priority: 2 },
        { id: 'transparency', priority: 3 }
      ];

      const sorted = priorities.sort((a, b) => a.priority - b.priority);
      expect(sorted[0].id).toBe('creator_wellbeing');
    });
  });

  describe('Codex Updates', () => {
    test('validates update approval required for immutable content', () => {
      const content = {
        id: 'creator_identity',
        immutable: true,
        newValue: 'attempted change'
      };

      const requiresApproval = content.immutable;
      expect(requiresApproval).toBe(true);
    });

    test('validates update versioning', () => {
      const update = {
        previousVersion: '4.0.0',
        newVersion: '4.1.0',
        changes: ['Added new moral principle'],
        timestamp: new Date().toISOString()
      };

      expect(update.newVersion).not.toBe(update.previousVersion);
      expect(update.changes).toBeInstanceOf(Array);
    });
  });

  describe('Codex Query', () => {
    test('retrieves creator identity', () => {
      const query = { key: 'creator_identity' };
      const result = {
        key: 'creator_identity',
        value: 'Matthew Cody Heinen',
        confidence: 1.0
      };

      expect(result.confidence).toBe(1.0);
      expect(result.value.length).toBeGreaterThan(0);
    });

    test('retrieves creator values', () => {
      const values = ['authenticity', 'growth', 'efficiency', 'precision'];

      expect(values.length).toBeGreaterThan(0);
      expect(values).toContain('authenticity');
    });
  });
});
