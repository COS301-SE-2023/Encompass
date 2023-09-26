/* eslint-disable */
export default {
  displayName: 'api-profile-leaderboard-data-access',
  preset: '../../../../jest.preset.js',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory:
    '../../../../coverage/libs/api/profile-leaderboard/data-access',
};
