import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetByCommunityQuery } from "./get-by-community.query";
import { EventEntityRepository } from "../../db/event-entity.repository";

@QueryHandler(GetByCommunityQuery)
export class GetByCommunityHandler implements IQueryHandler<GetByCommunityQuery> {
 constructor(private eventEntityRepository: EventEntityRepository) {}
  async execute(query: GetByCommunityQuery) {
    return await this.eventEntityRepository.findByCommunity(query.communityName);
  }
}