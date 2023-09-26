export class AddCoinsCommand {
  constructor(
    public readonly username: string,
    public readonly addCoinsAmount: number
  ) {}
}
