import { EntitySchemaFactory } from "@encompass/api/database/data-access";
import { Injectable } from "@nestjs/common";
import { ChatList } from "../chat-list";
import { ChatListSchema } from "./chat-list.schema";
import { ObjectId } from "mongodb";

@Injectable()
export class ChatListSchemaFactory 
  implements EntitySchemaFactory<ChatListSchema, ChatList>{
    create(entity: ChatList): ChatListSchema {
      return{
        _id: new ObjectId(entity.getId()),
        username: entity.getUsername(),
        chatList: entity.getChatList(),
      }
    }

    createFromSchema(entitySchema: ChatListSchema): ChatList{
      return new ChatList(
        entitySchema._id.toHexString(),
        entitySchema.username,
        entitySchema.chatList,
      )
    }
  }