import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { AddMessageCommand } from "./add-message.command";
import { ChatEntityRepository } from "../../db/chat-entity.repository";


@CommandHandler(AddMessageCommand)
export class AddMessageHandler implements ICommandHandler<AddMessageCommand>{
  constructor(
    private readonly chatEntityRepository: ChatEntityRepository,
    private readonly eventPublisher: EventPublisher,
  ){}

  async execute(command: AddMessageCommand){
    const chat = this.eventPublisher.mergeObjectContext(
      await this.chatEntityRepository.findOneById(command.chatId)
    )  

    chat.addMessage(command.username, command.message, command.dateTime);
    await this.chatEntityRepository.findOneAndReplaceById(chat._id, chat);
    chat.commit();

    return chat
  } 
}