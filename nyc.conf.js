module.exports = {
  verbose: false,
  'report-dir': './dist/coverage',
  reporter: [
    'lcov',
    'json',
    'text-summary'
  ],
  'temp-dir': './dist/coverage'
};
