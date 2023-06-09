import { CreateCommentRequest } from "../../dto/create-comment-request.dto";

export class CreateCommentCommand{
  constructor(public readonly createCommentRequest: CreateCommentRequest){}
}