import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { MongooseModule } from "@nestjs/mongoose";
import { ChatListSchema } from "./db/chat-list.schema";
import { SchemaFactory } from "@nestjs/mongoose";
import { ChatListController } from "./chat-list.controller";
import { ChatListEntityRepository } from "./db/chat-list-entity.repository";
import { ChatListDtoRepository } from "./db/chat-list-dto.repository";
import { ChatListSchemaFactory } from "./db/chat-list-schema.factory";
import { ChatListFactory } from "./chat-list.factory";
import { CreateChatListHandler } from "./commands";
import { ChatListCreateHandler } from "./events";
import { GetChatListHandler } from "./queries";

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      {
        name: ChatListSchema.name,
        schema: SchemaFactory.createForClass(ChatListSchema),
      }
    ])
  ],
  controllers: [ChatListController],
  providers: [
    ChatListEntityRepository,
    ChatListDtoRepository,
    ChatListSchemaFactory,
    ChatListFactory,
    CreateChatListHandler,
    ChatListCreateHandler,
    GetChatListHandler
  ]
})

export class ChatListModule{}