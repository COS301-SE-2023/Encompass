import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { MongooseModule } from "@nestjs/mongoose";
import { ChatSchema } from "./db/chat.schema";
import { SchemaFactory } from "@nestjs/mongoose";
import { ChatController } from "./chat.controller";
import { ChatEntityRepository } from "./db/chat-entity.repository";
import { ChatDtoRepository } from "./db/chat-dto.repository";
import { ChatSchemaFactory } from "./db/chat-schema.factory";
import { ChatFactory } from "./chat.factory";
import { AddMessageHandler, CreateChatHandler } from "./commands";
import { ChatCreatedEvent } from "./events/create-chat.event";
import { GetChatHandler } from "./queries";

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      {
        name: ChatSchema.name,
        schema: SchemaFactory.createForClass(ChatSchema),
      }
    ])
  ],
  controllers: [ChatController],
  providers: [
    ChatEntityRepository,
    ChatDtoRepository,
    ChatSchemaFactory,
    ChatFactory,
    CreateChatHandler,
    ChatCreatedEvent,
    GetChatHandler,
    AddMessageHandler
  ],
})

export class ChatModule{}