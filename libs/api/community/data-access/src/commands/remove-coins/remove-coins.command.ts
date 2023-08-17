export class RemoveCoinsCommand{
  constructor(public readonly communityName: string, public readonly removeCoinsAmount: number){}
}