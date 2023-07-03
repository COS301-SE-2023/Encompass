import { Body, Controller, Post } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { CreateChatCommand } from "./commands/create-chat/create-chat.command";
import { CreateChatRequest } from "./dto/create-chat-request.dto";
import { ChatDto } from "./chat.dto";

@Controller('chat')
export class ChatController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ){}

  @Post('create')
  async createChat(
    @Body() createChatRequest: CreateChatRequest,
  ){
    return await this.commandBus.execute<CreateChatCommand, ChatDto>(
      new CreateChatCommand(createChatRequest),
    );
  }
}