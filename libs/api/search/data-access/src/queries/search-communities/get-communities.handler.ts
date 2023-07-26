import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetCommunitiesByKeywordQuery } from "./get-communities.query";
import { CommunityEntityRepository } from "libs/api/community/data-access/src/db/community-entity.repository";

@QueryHandler(GetCommunitiesByKeywordQuery)
export class GetCommunitiesByKeywordHandler implements IQueryHandler<GetCommunitiesByKeywordQuery>{
    constructor(private readonly communityEntityRepository: CommunityEntityRepository){}
    
    async execute({ keyword }: GetCommunitiesByKeywordQuery){
        return this.communityEntityRepository.findCommunitiesByKeyword(keyword);
    }
}