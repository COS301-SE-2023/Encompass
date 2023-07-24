import { EntityFactory } from "@encompass/api/database/data-access";
import { Injectable } from "@nestjs/common";
import { ChatList } from "./chat-list";
import { ChatListEntityRepository } from "./db/chat-list-entity.repository";
import { ObjectId } from "mongodb";
import { ChatListCreatedEvent } from "./events/create-chat-list.event";

@Injectable()
export class ChatListFactory implements EntityFactory<ChatList>{
  constructor(
    private readonly chatListEntityRepository: ChatListEntityRepository,
  ){}

  async create(
    username: string,
    chatList: {
      chatRef: string;
      otherUser: string;
    }[],
  ) : Promise<ChatList>{
    const chatListObject = new ChatList(
      new ObjectId().toHexString(),
      username,
      chatList,
    );
    await this.chatListEntityRepository.create(chatListObject);
    chatListObject.apply(new ChatListCreatedEvent(chatListObject.getId()))
    return chatListObject;
  }
}