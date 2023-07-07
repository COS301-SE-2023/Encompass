import { Controller, Post, Body, Get, Param } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { CreateChatListRequest } from "./dto/create-chat-list-request.dto";
import { CreateChatListCommand } from "./commands/create-chat-list/create-chat-list.command";
import { ChatListDto } from "./chat-list.dto";
import { GetChatListQuery } from "./queries/get-chat-list/get-chat-list.query";
import { AddChatRequest } from "./dto";
import { AddChatCommand } from "./commands/add-chat/add-chat.command";

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

  @Get('get-chat-list/:username')
  async getChatList(
    @Param('username') username: string,
  ){
    return await this.queryBus.execute<GetChatListQuery, ChatListDto>(
      new GetChatListQuery(username),
    );
  }

  @Post('add-chat/:username')
  async addChat(
    @Param('username') username: string,
    @Body() addChatRequest: AddChatRequest,
  ){
    return await this.commandBus.execute<AddChatCommand, ChatListDto>(
      new AddChatCommand(username, addChatRequest.chatRef, addChatRequest.otherUser),
    );
  }
}