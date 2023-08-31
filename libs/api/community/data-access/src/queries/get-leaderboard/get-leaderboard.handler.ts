import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetLeaderboardQuery } from "./get-leaderboard.query";
import { CommunityDtoRepository } from "../../db/community-dto.repository";
import { CommunityDto } from "../../community.dto";
import { CommunityLeaderboardDto } from "@encompass/api/community-leaderboard/data-access";

@QueryHandler(GetLeaderboardQuery)
export class GetLeaderboardHandler implements IQueryHandler<GetLeaderboardQuery>{
  constructor(
    private communityDtoRepository: CommunityDtoRepository
  ){}
  async execute(){
    let position = 1
    const leaderboard: CommunityLeaderboardDto[] = [];
    const communities: CommunityDto[] = await this.communityDtoRepository.findTopCommunities();

    communities.forEach(community => {
      leaderboard.push({
        _id: community._id,
        name: community.name,
        communityEP: community.communityEP,
        position: position++
      })
    })

    return leaderboard;
  }
}