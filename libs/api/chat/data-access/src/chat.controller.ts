import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { CreateChatCommand } from "./commands/create-chat/create-chat.command";
import { CreateChatRequest } from "./dto/create-chat-request.dto";
import { ChatDto } from "./chat.dto";
import { GetChatQuery } from "./queries/get-chat/get-chat.query";
import { AddMessageRequest } from "./dto";
import { AddMessageCommand } from "./commands/add-message/add-message.command";

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

  @Get('get-chat/:chatId')
  async getChat(
    @Param('chatId') chatId: string,
  ){
    return await this.queryBus.execute<GetChatQuery, ChatDto>(
      new GetChatQuery(chatId),
    );
  }

  @Patch('add-message/:chatId')
  async addMessage(
    @Param('chatId') chatId: string,
    @Body() addMessageRequest: AddMessageRequest,
  ){
    return await this.commandBus.execute<AddMessageCommand, ChatDto>(
      new AddMessageCommand(chatId, addMessageRequest.username, addMessageRequest.message, addMessageRequest.dateTime),
    );
  }
}