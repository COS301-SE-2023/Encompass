import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateChatCommand } from "./create-chat.command";
import { ChatFactory } from "../../chat.factory";
import { EventPublisher } from "@nestjs/cqrs";


@CommandHandler(CreateChatCommand)
export class CreateChatHandler implements ICommandHandler<CreateChatCommand> {
  constructor(
    private readonly chatFactory: ChatFactory,
    private readonly eventPublisher: EventPublisher,
  ){}

  async execute({ createChatRequest }: CreateChatCommand){
    const {
      users,
    } = createChatRequest;

    const chat = this.eventPublisher.mergeObjectContext(
      await this.chatFactory.create(
        users,
        [],
      )
    );

    chat.commit();

    return chat;
  }
}