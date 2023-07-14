import '@testing-library/jest-dom'
const nxPreset = require('@nx/jest/preset').default;

module.exports = { ...nxPreset, coverageReporters: ['lcov'] };
