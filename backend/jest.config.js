module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/src/tests/**/*.test.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/index.js',
    '!src/database/**',
  ],
  coveragePathIgnorePatterns: ['/node_modules/'],
  verbose: true,
  silent: false,
};
