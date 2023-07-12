import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { ChatListCreatedEvent } from "./create-chat-list.event";

@EventsHandler(ChatListCreatedEvent)
export class ChatListCreateHandler implements IEventHandler<ChatListCreatedEvent>{
  async handle({ chatListId }: ChatListCreatedEvent): Promise<void>{
    console.log("Chat list created event handled")
  }
}