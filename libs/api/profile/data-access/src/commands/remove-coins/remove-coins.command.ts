export class RemoveCoinsCommand{
  constructor(
    public readonly username: string,
    public readonly removeCoinsAmount: number
  ) {}
}