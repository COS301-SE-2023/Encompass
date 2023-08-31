import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetLeaderboardQuery } from "./get-leaderboard.query";
import { CommunityLeaderboardDto } from "../../community-leaderboard.dto";
import { CommunityLeaderboardDtoRepository } from "../../db/community-leaderboard-dto.repository";

@QueryHandler(GetLeaderboardQuery)
export class GetLeaderboardHandler implements IQueryHandler<GetLeaderboardQuery>{
  constructor(
    private readonly communityLeaderboardDtoRepository: CommunityLeaderboardDtoRepository
  ){}

  async execute(): Promise<CommunityLeaderboardDto[]>{
    return await this.communityLeaderboardDtoRepository.getLeaderboard();
  }
}