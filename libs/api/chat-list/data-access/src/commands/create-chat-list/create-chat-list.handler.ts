import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateChatListCommand } from "./create-chat-list.command";
import { ChatListFactory } from "../../chat-list.factory";
import { EventPublisher } from "@nestjs/cqrs";

@CommandHandler(CreateChatListCommand)
export class CreateChatListHandler implements ICommandHandler<CreateChatListCommand>{
  constructor(
    private readonly chatListFactory: ChatListFactory,
    private readonly eventPublisher: EventPublisher,
  ){}

  async execute({ createChatListRequest }: CreateChatListCommand){
    const {
      username,
    } = createChatListRequest;

    const chatListObject = this.eventPublisher.mergeObjectContext(
      await this.chatListFactory.create(
        username,
        [],
      )
    );

    chatListObject.commit();

    return chatListObject;
  }
}