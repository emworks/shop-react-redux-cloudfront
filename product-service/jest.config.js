/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@libs(.*)$': '<rootDir>/src/libs/$1',
    '^src(.*)$': '<rootDir>/src/$1',
  },
};