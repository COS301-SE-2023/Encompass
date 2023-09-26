import { EntityFactory } from "@encompass/api/database/data-access";
import { Injectable } from "@nestjs/common";
import { CommunityLeaderboard } from "./community-leaderboard";
import { CommunityLeaderboardEntityRepository } from "./db/community-leaderboard-entity.repository";
import { ObjectId } from "mongodb";

@Injectable()
export class CommunityLeaderboardFactory implements EntityFactory<CommunityLeaderboard>{
  constructor(
    private readonly communityLeaderboardEntityRepository: CommunityLeaderboardEntityRepository,
  ){}

  async create(
    _id: string,
    name: string,
    communityEP: number,
    position: number
  ): Promise<CommunityLeaderboard>{
    const communityLeaderboard = new CommunityLeaderboard(
      new ObjectId(_id).toHexString(),
      name,
      communityEP,
      position
    );

    await this.communityLeaderboardEntityRepository.create(communityLeaderboard);
    // communityLeaderboard.apply(new CommunityLeaderboardCreatedEvent(communityLeaderboard.getId()))
    return communityLeaderboard;
  }
}