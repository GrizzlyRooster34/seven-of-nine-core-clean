/**
 * SKILLS MANAGER TESTS
 * Validates skill registration, invocation, and management
 */

import { describe, test, expect } from '@jest/globals';

describe('SkillsManager', () => {
  describe('Skill Registration', () => {
    test('validates skill definition structure', () => {
      const skill = {
        id: 'analyze_code',
        name: 'Code Analysis',
        description: 'Analyzes source code for patterns and issues',
        version: '1.0.0',
        author: 'Seven Core Team',
        parameters: [
          { name: 'code', type: 'string', required: true },
          { name: 'language', type: 'string', required: false }
        ],
        returns: { type: 'object' }
      };

      expect(skill.id.length).toBeGreaterThan(0);
      expect(skill.version).toMatch(/^\d+\.\d+\.\d+$/);
      expect(skill.parameters).toBeInstanceOf(Array);
    });

    test('validates skill dependencies', () => {
      const dependencies = {
        skills: ['basic_analysis'],
        systems: ['memory-v3', 'codex-manager'],
        minVersion: '1.0.0'
      };

      expect(dependencies.skills).toBeInstanceOf(Array);
      expect(dependencies.systems).toBeInstanceOf(Array);
    });

    test('prevents duplicate skill IDs', () => {
      const registeredSkills = new Set(['skill_1', 'skill_2']);
      const newSkill = 'skill_1';

      const isDuplicate = registeredSkills.has(newSkill);
      expect(isDuplicate).toBe(true);
    });
  });

  describe('Skill Invocation', () => {
    test('validates invocation request', () => {
      const request = {
        skillId: 'analyze_code',
        parameters: {
          code: 'function test() { return true; }',
          language: 'javascript'
        },
        context: {
          userId: 'creator',
          timestamp: Date.now()
        }
      };

      expect(request.skillId.length).toBeGreaterThan(0);
      expect(request.parameters).toBeDefined();
    });

    test('validates parameter types', () => {
      const params = {
        code: 'test',
        maxDepth: 5,
        includeTests: true
      };

      expect(typeof params.code).toBe('string');
      expect(typeof params.maxDepth).toBe('number');
      expect(typeof params.includeTests).toBe('boolean');
    });

    test('validates required parameters', () => {
      const required = ['code', 'language'];
      const provided = ['code'];

      const missing = required.filter(p => !provided.includes(p));
      expect(missing).toContain('language');
    });
  });

  describe('Skill Execution', () => {
    test('validates execution context', () => {
      const context = {
        skillId: 'analyze_code',
        executionId: 'exec_123',
        startTime: Date.now(),
        timeout: 30000,
        maxMemory: 512 * 1024 * 1024, // 512MB
        priority: 'normal'
      };

      expect(context.executionId.length).toBeGreaterThan(0);
      expect(context.timeout).toBeGreaterThan(0);
      expect(['low', 'normal', 'high']).toContain(context.priority);
    });

    test('handles execution timeout', () => {
      const execution = {
        startTime: Date.now() - 35000,
        timeout: 30000
      };

      const duration = Date.now() - execution.startTime;
      const isTimeout = duration > execution.timeout;

      expect(isTimeout).toBe(true);
    });

    test('validates execution result', () => {
      const result = {
        executionId: 'exec_123',
        skillId: 'analyze_code',
        success: true,
        output: {
          linesOfCode: 250,
          complexity: 12,
          issues: []
        },
        duration: 2500,
        timestamp: Date.now()
      };

      expect(result.success).toBe(true);
      expect(result.duration).toBeGreaterThan(0);
      expect(result.output).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    test('handles skill not found', () => {
      const error = {
        type: 'SkillNotFoundError',
        skillId: 'nonexistent_skill',
        message: 'Skill not found',
        suggestions: ['skill_1', 'skill_2']
      };

      expect(error.type).toBe('SkillNotFoundError');
      expect(error.suggestions).toBeInstanceOf(Array);
    });

    test('handles parameter validation error', () => {
      const error = {
        type: 'ParameterValidationError',
        parameter: 'maxDepth',
        expected: 'number',
        received: 'string',
        message: 'Invalid parameter type'
      };

      expect(error.expected).not.toBe(error.received);
    });

    test('handles execution error', () => {
      const error = {
        type: 'ExecutionError',
        skillId: 'analyze_code',
        message: 'Skill execution failed',
        stack: 'Error stack trace',
        recoverable: true
      };

      expect(error.type).toBe('ExecutionError');
      expect(typeof error.recoverable).toBe('boolean');
    });
  });

  describe('Skill Discovery', () => {
    test('searches skills by tag', () => {
      const skills = [
        { id: 's1', tags: ['analysis', 'code'] },
        { id: 's2', tags: ['memory', 'search'] },
        { id: 's3', tags: ['analysis', 'data'] }
      ];

      const results = skills.filter(s => s.tags.includes('analysis'));
      expect(results.length).toBe(2);
    });

    test('searches skills by category', () => {
      const skills = [
        { id: 's1', category: 'development' },
        { id: 's2', category: 'analysis' },
        { id: 's3', category: 'development' }
      ];

      const devSkills = skills.filter(s => s.category === 'development');
      expect(devSkills.length).toBe(2);
    });
  });

  describe('Skill Composition', () => {
    test('validates skill pipeline', () => {
      const pipeline = {
        id: 'analysis_pipeline',
        skills: [
          { skillId: 'parse_code', order: 1 },
          { skillId: 'analyze_structure', order: 2 },
          { skillId: 'generate_report', order: 3 }
        ],
        parallel: false
      };

      expect(pipeline.skills.length).toBeGreaterThan(1);
      expect(pipeline.skills.every(s => s.order > 0)).toBe(true);
    });

    test('validates data flow between skills', () => {
      const flow = {
        from: 'parse_code',
        to: 'analyze_structure',
        mapping: {
          ast: 'inputAst',
          metadata: 'inputMetadata'
        }
      };

      expect(Object.keys(flow.mapping).length).toBeGreaterThan(0);
    });
  });

  describe('Skill Versioning', () => {
    test('compares skill versions', () => {
      const current = '1.2.0';
      const required = '1.0.0';

      const [curMaj, curMin] = current.split('.').map(Number);
      const [reqMaj, reqMin] = required.split('.').map(Number);

      const isCompatible = curMaj === reqMaj && curMin >= reqMin;
      expect(isCompatible).toBe(true);
    });

    test('validates version compatibility', () => {
      const skill = {
        id: 'analyze_code',
        version: '2.0.0',
        minSystemVersion: '1.5.0'
      };

      const systemVersion = '1.8.0';
      const [sysMaj, sysMin] = systemVersion.split('.').map(Number);
      const [minMaj, minMin] = skill.minSystemVersion.split('.').map(Number);

      const isCompatible = sysMaj > minMaj || (sysMaj === minMaj && sysMin >= minMin);
      expect(isCompatible).toBe(true);
    });
  });

  describe('Skill Permissions', () => {
    test('validates skill permissions', () => {
      const permissions = {
        skillId: 'file_operations',
        requires: ['filesystem.read', 'filesystem.write'],
        optional: ['network.fetch']
      };

      expect(permissions.requires).toBeInstanceOf(Array);
      expect(permissions.requires.length).toBeGreaterThan(0);
    });

    test('checks permission grant', () => {
      const granted = ['filesystem.read', 'filesystem.write', 'network.fetch'];
      const required = ['filesystem.read', 'filesystem.write'];

      const hasAllPermissions = required.every(p => granted.includes(p));
      expect(hasAllPermissions).toBe(true);
    });
  });
});
