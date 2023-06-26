import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetCommunityQuery } from "./get-community.query";
import { CommunityEntityRepository } from "../db/community-entity.repository";

@QueryHandler(GetCommunityQuery)
export class GetCommunityHandler implements IQueryHandler<GetCommunityQuery> {

    constructor(private readonly communityEntityRepository: CommunityEntityRepository){}

    async execute({ communityId }: GetCommunityQuery){
        console.log(communityId)
        return this.communityEntityRepository.findOneById(communityId);
    }
}