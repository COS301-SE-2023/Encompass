import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetChatQuery } from "./get-chat.query";
import { ChatEntityRepository } from "../../db/chat-entity.repository";

@QueryHandler(GetChatQuery)
export class GetChatHandler implements IQueryHandler<GetChatQuery>{
  constructor(private readonly chatEntityRepository: ChatEntityRepository){}

  async execute(query: GetChatQuery){
    return this.chatEntityRepository.findOneById(query.chatId);
  }
}