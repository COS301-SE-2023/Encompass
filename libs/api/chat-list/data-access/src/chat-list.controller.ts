import { Controller, Post, Body } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { CreateChatListRequest } from "./dto/create-chat-list-request.dto";
import { CreateChatListCommand } from "./commands/create-chat-list/create-chat-list.command";
import { ChatListDto } from "./chat-list.dto";

@Controller('chat-list')
export class ChatListController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ){}

  @Post('create')
  async createChatList(
    @Body() createChatListRequest: CreateChatListRequest,
  ){
    return await this.commandBus.execute<CreateChatListCommand, ChatListDto>(
      new CreateChatListCommand(createChatListRequest),
    );
  }
}