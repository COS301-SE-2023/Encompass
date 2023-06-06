export class PostCreatedEvent {
    constructor(public readonly postId: string | null | undefined) {}
}