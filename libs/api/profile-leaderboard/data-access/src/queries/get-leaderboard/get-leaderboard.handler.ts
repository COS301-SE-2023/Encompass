import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { ProfileLeaderboardDto } from "../../profile-leaderboard.dto";
import { GetLeaderboardQuery } from "./get-leaderboard.query";
import { ProfileLeaderboardDtoRepository } from "../../db/profile-leaderboard-dto.repository";

@QueryHandler(GetLeaderboardQuery)
export class GetLeaderboardHandler implements IQueryHandler<GetLeaderboardQuery>{
  constructor(
    private readonly profileLeaderboardDtoRepository: ProfileLeaderboardDtoRepository
  ){}

  async execute(): Promise<ProfileLeaderboardDto[]>{
    return await this.profileLeaderboardDtoRepository.getLeaderboard();
  }
}