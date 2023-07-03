import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { ChatCreatedEvent } from "./create-chat.event";

@EventsHandler(ChatCreatedEvent)
export class ChatCreateHandler implements IEventHandler<ChatCreatedEvent>{
  async handle({ chatId }: ChatCreatedEvent): Promise<void>{
    console.log("Chat created event handled")
  }
}