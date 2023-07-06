import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetRecommendedCommunitiesQuery } from "./get-recommended-communities.query";
import { CommunityEntityRepository } from "../../db/community-entity.repository"

@QueryHandler(GetRecommendedCommunitiesQuery)
export class GetRecommendedCommunitiesHandler implements IQueryHandler<GetRecommendedCommunitiesQuery> {
    constructor(private readonly communityEntityRepository: CommunityEntityRepository){}

    async execute({ userId }: GetRecommendedCommunitiesQuery){
        console.log(userId)
        return this.communityEntityRepository.findCommunitiesByUserId(userId);
    }
}