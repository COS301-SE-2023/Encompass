import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { CommunityEntityRepository } from "../../db/community-entity.repository";
import { GetCommunitiesByKeyWordQuery } from "./get-community-by-keyword.query";

@QueryHandler(GetCommunitiesByKeyWordQuery)
export class GetCommunitiesByKeywordHandler implements IQueryHandler<GetCommunitiesByKeyWordQuery>{
    constructor(private readonly communityEntityRepository: CommunityEntityRepository){}
    
    async execute({ keyword }: GetCommunitiesByKeyWordQuery){
        return this.communityEntityRepository.findCommunitiesByKeyword(keyword);
    }
}