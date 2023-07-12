import { EntitySchemaFactory } from "@encompass/api/database/data-access";
import { Injectable } from "@nestjs/common";
import { ChatSchema } from "./chat.schema";
import { Chat } from "../chat";
import { ObjectId } from "mongodb";

@Injectable()
export class ChatSchemaFactory
  implements EntitySchemaFactory<ChatSchema, Chat>{

    create(chat: Chat): ChatSchema {
        return{
          _id: new ObjectId(chat.getId()),
          users: chat.getUsers(),
          messages: chat.getMessages(),
        }
    }

    createFromSchema(entitySchema: ChatSchema): Chat{
      return new Chat(
        entitySchema._id.toHexString(),
        entitySchema.users,
        entitySchema.messages,
      )
    }
  }