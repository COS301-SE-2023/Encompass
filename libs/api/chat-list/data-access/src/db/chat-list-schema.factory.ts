import { EntitySchemaFactory } from "@encompass/api/database/data-access";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ChatListSchemaFactory 
  implements EntitySchemaFactory<ChatListSchema, ChatList>{
    
  }