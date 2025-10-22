import { createHash } from 'crypto';

/**
 * Tactical Fallback Checksum Tests
 * Validates the stableHash function and checksum validation
 */


// Extract stableHash function for testing
function stableHash(obj: any): string {
  const seen = new WeakSet();

  const replacer = (key: string, value: any): any => {
    if (value && typeof value === 'object') {
      // Handle circular references
      if (seen.has(value)) {
        return '[Circular]';
      }
      seen.add(value);

      // Sort object keys for deterministic serialization
      if (!Array.isArray(value)) {
        return Object.keys(value)
          .sort()
          .reduce((sorted: any, k: string) => {
            sorted[k] = value[k];
            return sorted;
          }, {});
      }
    }
    return value;
  };

  const str = JSON.stringify(obj, replacer);
  return createHash('sha256').update(str).digest('hex');
}

describe('Tactical Fallback Checksum', () => {
  test('stableHash produces consistent results', () => {
    const obj = { b: 2, a: 1, c: 3 };
    const hash1 = stableHash(obj);
    const hash2 = stableHash({ a: 1, b: 2, c: 3 }); // Different order
    
    expect(hash1).toBe(hash2);
    expect(hash1).toMatch(/^[a-f0-9]{64}$/); // Valid SHA256 hex
  });

  test('stableHash handles different data types', () => {
    const stringHash = stableHash('test content');
    const objHash = stableHash({ key: 'value' });
    const arrayHash = stableHash([1, 2, 3]);
    
    expect(stringHash).not.toBe(objHash);
    expect(objHash).not.toBe(arrayHash);
    expect(stringHash.length).toBe(64); // SHA256 length
  });

  test('stableHash graceful failure path', () => {
    // Test with circular reference (should not crash)
    const circular: any = { a: 1 };
    circular.self = circular;
    
    expect(() => stableHash(circular)).not.toThrow();
  });

  test('stableHash deterministic with nested objects', () => {
    const obj1 = {
      nested: { z: 3, y: 2, x: 1 },
      simple: 'value'
    };
    
    const obj2 = {
      simple: 'value',
      nested: { x: 1, y: 2, z: 3 }
    };
    
    const hash1 = stableHash(obj1);
    const hash2 = stableHash(obj2);
    
    expect(hash1).toBe(hash2);
  });
});