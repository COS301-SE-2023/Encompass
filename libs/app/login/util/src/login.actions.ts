export class login{
  static readonly type = '[login] Login';
  constructor(public request: {email: string, password: string}){}
}