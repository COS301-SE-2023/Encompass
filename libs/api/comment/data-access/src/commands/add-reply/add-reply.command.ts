import { AddReplyRequest } from "../../dto";

export class AddReplyCommand {
  constructor(
    public readonly commentId: string,
    public readonly reply: AddReplyRequest,
  ) {}
}