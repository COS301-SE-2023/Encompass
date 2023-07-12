import { CommandHandler } from "@nestjs/cqrs";
import { ICommandHandler, EventPublisher } from "@nestjs/cqrs";
import { AddChatCommand } from "./add-chat.command";
import { ChatListEntityRepository } from "../../db/chat-list-entity.repository";

@CommandHandler(AddChatCommand)
export class AddChatHandler implements ICommandHandler<AddChatCommand>{
  constructor(
    private readonly chatListEntityRepository: ChatListEntityRepository,
    private readonly eventPublisher: EventPublisher
  ){}

  async execute({username, chatRef, otherUser}: AddChatCommand) {
    const chatList = this.eventPublisher.mergeObjectContext(
      await this.chatListEntityRepository.findOneByUsername(username)
    )  

    chatList.addChat(chatRef, otherUser);
    await this.chatListEntityRepository.findOneAndReplaceById(chatList._id, chatList);
    chatList.commit();

    return chatList
  }
}