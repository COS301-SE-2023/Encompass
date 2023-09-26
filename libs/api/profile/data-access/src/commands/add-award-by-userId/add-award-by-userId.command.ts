export class AddAwardByUserIdCommand{
  constructor(public readonly userId: string, public readonly award: string){}
}