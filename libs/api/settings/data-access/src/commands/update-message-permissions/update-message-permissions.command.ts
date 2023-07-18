export class UpdateMessagePermissionsCommand{
  constructor(public readonly userId: string, public readonly messagePermissions: string){}
}