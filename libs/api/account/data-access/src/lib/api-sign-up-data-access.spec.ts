/*
FILENAME: api-sign-up-data-access.spec.ts

AUTHOR: Sameet Keshav

CREATION DATE: 27 May 2023

DESCRIPTION: This file ensures that the api sign up data access works properly.
*/

import { apiSignUpDataAccess } from './api-sign-up-data-access';

describe('apiSignUpDataAccess', () => {
  it('should work', () => {
    expect(apiSignUpDataAccess()).toEqual('api-sign-up-data-access');
  });
});
