export class DeleteReplyCommand {
  constructor(
    public readonly commentId: string,
    public readonly replyId: string
  ) {}
}