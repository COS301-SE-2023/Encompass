import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetAllCommunitiesQuery } from "./getAllCommunities.query";
import { CommunityEntityRepository } from "../../db/community-entity.repository";

@QueryHandler(GetAllCommunitiesQuery)
export class GetAllCommunitiesHandler implements IQueryHandler<GetAllCommunitiesQuery> {
    constructor(private readonly communityEntityRepository: CommunityEntityRepository) {}

    async execute() {
        // console.log("GetAllCommunitiesQuery was called");
        return this.communityEntityRepository.findAll();
    }
}