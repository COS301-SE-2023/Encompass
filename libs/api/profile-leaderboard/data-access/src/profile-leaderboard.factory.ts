import { EntityFactory } from "@encompass/api/database/data-access";
import { Injectable } from "@nestjs/common";
import { ProfileLeaderboard } from "./profile-leaderboard";
import { ProfileLeaderboardEntityRepository } from "./db/profile-leaderboard-entity.repository";
import { ObjectId } from "mongodb";

@Injectable()
export class ProfileLeaderboardFactory implements EntityFactory<ProfileLeaderboard>{
  constructor(
    private readonly profileLeaderboardEntityRepository: ProfileLeaderboardEntityRepository,
  ){}

  async create(
    _id: string,
    name: string,
    lastName: string,
    ep: number,
    username: string,
  ): Promise<ProfileLeaderboard>{
    const profileLeaderboard = new ProfileLeaderboard(
      new ObjectId(_id).toHexString(),
      name,
      lastName,
      ep,
      username
    );

    await this.profileLeaderboardEntityRepository.create(profileLeaderboard);
    // profileLeaderboard.apply(new ProfileLeaderboardCreatedEvent(profileLeaderboard.getId()))
    return profileLeaderboard;
  }
}