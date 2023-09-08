import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetLeaderboardQuery } from "./get-leaderboard.query";
import { ProfileDtoRepository } from "../../db/profile-dto.repository";
import { ProfileDto } from "../../profile.dto";
import { ProfileLeaderboardDto } from "@encompass/api/profile-leaderboard/data-access";

@QueryHandler(GetLeaderboardQuery)
export class GetLeaderboardHandler implements IQueryHandler{
  constructor(
    private profileDtoRepository: ProfileDtoRepository
  ){}
  async execute(){
    const leaderboard: ProfileLeaderboardDto[] = [];
    const profiles: ProfileDto[] = await this.profileDtoRepository.findTop20Profiles();

    profiles.forEach(profile => {
      leaderboard.push({
        _id: profile._id,
        name: profile.name,
        lastName: profile.lastName,
        ep: profile.ep,
        username: profile.username,
        profileImage: profile.profileImage
      })
    })

    return leaderboard;
  }
}