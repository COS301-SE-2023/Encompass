import { BaseEntityRepository } from "@encompass/api/database/data-access";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ChatSchema } from "./chat.schema";
import { Chat } from "../chat";
import { ChatSchemaFactory } from "./chat-schema.factory";

@Injectable()
export class ChatEntityRepository extends BaseEntityRepository<
  ChatSchema,
  Chat
> {
  constructor(
    @InjectModel(ChatSchema.name)
    chatModel: Model<ChatSchema>,
    chatSchemaFactory: ChatSchemaFactory,
  ) {
    super(chatModel, chatSchemaFactory);
  }
}