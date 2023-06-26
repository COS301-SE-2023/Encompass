export class CommentCreatedEvent {
  constructor(public readonly commentId: string | null | undefined) {}
}