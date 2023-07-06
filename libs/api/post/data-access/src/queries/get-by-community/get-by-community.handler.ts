import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetByCommunityQuery } from "./get-by-community.query";
import { PostEntityRepository } from "../../db/post-entity.repository";

@QueryHandler(GetByCommunityQuery)
export class GetByCommunityHandler implements IQueryHandler<GetByCommunityQuery> {
 constructor(private postEntityRepository: PostEntityRepository) {}
  async execute(query: GetByCommunityQuery) {
    return await this.postEntityRepository.findByCommunity(query.communityName);
  }
}