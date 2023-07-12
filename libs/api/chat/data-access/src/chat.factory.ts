import { EntityFactory } from "@encompass/api/database/data-access";
import { Injectable } from "@nestjs/common";
import { Chat } from "./chat";
import { ChatEntityRepository } from "./db/chat-entity.repository";
import { ObjectId } from "mongodb";
import { ChatCreatedEvent } from "./events/create-chat.event";

@Injectable()
export class ChatFactory implements EntityFactory<Chat>{
  constructor(
    private readonly chatEntityRepository: ChatEntityRepository,
  ){}

  async create(
    users: string[],
    messages: {
      username: string;
      message: string;
      dateTime: Date;
    }[],
  ) : Promise<Chat>{
    const chat = new Chat(
      new ObjectId().toHexString(),
      users,
      messages,
    );
    await this.chatEntityRepository.create(chat);
    chat.apply(new ChatCreatedEvent(chat.getId()))
    return chat;
  }
}