export class DislikePostCommand {
    constructor(public readonly userId: string,public readonly postId: string) {}
}