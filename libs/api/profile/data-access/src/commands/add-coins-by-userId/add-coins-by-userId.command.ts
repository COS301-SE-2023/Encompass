export class AddCoinsByUserIdCommand{
  constructor(public readonly userId: string, public readonly coins: number){}
}