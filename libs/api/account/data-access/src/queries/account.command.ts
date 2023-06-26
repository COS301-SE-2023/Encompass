export class GetAccountCommand{
  constructor(
    public readonly email: string,
    public readonly password: string
    ){}
}