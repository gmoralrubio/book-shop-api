module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src/__tests__'],
  testMatch: ['**/*.test.ts'],
  // Compila los .js de faker
  transform: {
    '^.+\\.[tj]sx?$': ['ts-jest'],
  },
  transformIgnorePatterns: ['/node_modules/(?!@faker-js/)'],
  moduleNameMapper: {
    '^@__tests__(.*)$': '<rootDir>/src/__tests__$1',
    '^@domain(.*)$': '<rootDir>/src/domain$1',
    '^@infraestructure(.*)$': '<rootDir>/src/infraestructure$1',
    '^@ui(.*)$': '<rootDir>/src/ui$1',
  },
};
