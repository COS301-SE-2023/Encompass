import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetChatListQuery } from "./get-chat-list.query";
import { ChatListEntityRepository } from "../../db/chat-list-entity.repository";

@QueryHandler(GetChatListQuery)
export class GetChatListHandler implements IQueryHandler<GetChatListQuery> {
  constructor(private readonly chatListEntityRepository: ChatListEntityRepository) {}

  async execute(query: GetChatListQuery) {
    return this.chatListEntityRepository.findOneByUsername(query.username);
  }
}