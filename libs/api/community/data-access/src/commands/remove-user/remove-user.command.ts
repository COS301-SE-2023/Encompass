export class RemoveUserCommand {
    constructor(public readonly username: string, public readonly communityName: string) {}
}