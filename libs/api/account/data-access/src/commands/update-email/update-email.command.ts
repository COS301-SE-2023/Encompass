export class UpdateEmailCommand{
  constructor(public readonly userId: string, public readonly email: string){}
}