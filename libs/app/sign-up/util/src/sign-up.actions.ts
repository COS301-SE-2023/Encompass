export class SignUp{
  static readonly type = '[signUp] Sign Up';
  constructor(public request: { email: string, password: string, username: string }){}
}

export class CheckAccount{
  static readonly type = '[signUp] Check Account';
  constructor(public request: string){}
}

export class CheckUsername{
  static readonly type = '[signUp] Check Username';
  constructor(public request: string){}
}