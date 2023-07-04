import { BaseEntityRepository } from "@encompass/api/database/data-access";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ChatListSchema } from "./chat-list.schema";
import { ChatList } from "../chat-list";
import { ChatListSchemaFactory } from "./chat-list-schema.factory";
@Injectable()
export class ChatListEntityRepository extends BaseEntityRepository<
  ChatListSchema,
  ChatList
> {
  constructor(
    @InjectModel(ChatListSchema.name)
    chatListModel: Model<ChatListSchema>,
    chatListSchemaFactory: ChatListSchemaFactory,
  ){
    super(chatListModel, chatListSchemaFactory);
  }
}