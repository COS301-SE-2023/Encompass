import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetCommunityRequestQuery } from "./get-commuity-request.query";
import { CommunityRequestEntityRepository } from "../db/community-request-entity.repository";

@QueryHandler(GetCommunityRequestQuery)
export class GetCommunityRequestHandler implements IQueryHandler<GetCommunityRequestQuery>{
  constructor(private communityRequestEntityRepository: CommunityRequestEntityRepository){}
  async execute({communityId}: GetCommunityRequestQuery){
    return this.communityRequestEntityRepository.findOneById(communityId);
  }
}