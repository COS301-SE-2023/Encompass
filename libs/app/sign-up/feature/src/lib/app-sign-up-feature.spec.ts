import { appSignUpFeature } from './app-sign-up-feature';

describe('signUp isolation test', () => {
  it('should work', () => {
    expect(appSignUpFeature()).toEqual('app-sign-up-feature');
  });
});

