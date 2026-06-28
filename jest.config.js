module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src/__tests__'],
  testMatch: ['**/*.test.ts'],
  moduleNameMapper: {
    '^@domain(.*)$': '<rootDir>/src/domain$1',
    '^@infraestructure(.*)$': '<rootDir>/src/infraestructure$1',
    '^@ui(.*)$': '<rootDir>/src/ui$1',
    '^@__tests__(.*)$': '<rootDir>/src/__tests__$1',
  },
};
