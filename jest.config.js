/** @type {import('jest').Config} */
export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
        diagnostics: false,
        tsconfig: {
          module: 'ESNext',
          moduleResolution: 'bundler',
          target: 'ES2022',
          lib: ['ES2022'],
          strict: false,
          esModuleInterop: true,
          skipLibCheck: true,
        },
      },
    ],
  },
  testMatch: [
    '<rootDir>/tests/unit/**/*.test.ts',
    '<rootDir>/tests/integration/**/*.test.ts',
    '<rootDir>/tests/security/**/*.test.ts',
    '<rootDir>/tests/load/**/*.test.ts',
    '<rootDir>/tests/penetration/**/*.test.ts',
  ],
  globalSetup: '<rootDir>/tests/setup.ts',
  globalTeardown: '<rootDir>/tests/teardown.ts',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/lib/payment/**/*.ts',
    'src/utils/dataMasking.ts',
    'src/lib/crypto/CryptoEngine.ts',
    'src/lib/security.ts',
  ],
  coverageReporters: ['text', 'json', 'lcov'],
  testTimeout: 30000,
  verbose: true,
};
