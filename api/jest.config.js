/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  testMatch: ['**/?(*.)+(test).[jt]s'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/test\\.js'],
  moduleFileExtensions: ['js', 'json'],
  verbose: false,
};
