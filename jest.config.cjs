/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@systems/(.*)$': '<rootDir>/src/systems/$1',
    '^@core/(.*)$': '<rootDir>/src/systems/core/$1',
    '^lz4js$': '<rootDir>/node_modules/lz4js/lz4.js',
  },
  transform: {
    // '^' means 'start of string'
    // '\' is an escape for '\', so '\\.' means a literal dot
    // '(ts|tsx)$' means 'ends with ts or tsx'
    '^.+\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
};
