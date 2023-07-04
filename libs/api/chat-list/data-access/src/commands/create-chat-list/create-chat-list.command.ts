import { CreateChatListRequest } from "../../dto";

export class CreateChatListCommand {
  constructor(
    public readonly createChatListRequest: CreateChatListRequest
  ) {}
}