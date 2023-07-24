import { CreateChatRequest } from '../../dto/create-chat-request.dto';

export class CreateChatCommand{
  constructor(public readonly createChatRequest: CreateChatRequest){}
}