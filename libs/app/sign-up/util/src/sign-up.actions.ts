import { CreateAccountRequest } from "@encompass/api/account/data-access";

export class signUp{
  static readonly type = '[signUp] Sign Up';
  constructor(public request: { email: string, password: string }){}
}