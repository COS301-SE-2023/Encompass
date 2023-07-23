export class UpdatePasswordCommand{
  constructor(public readonly userId: string, public readonly password: string){}
}