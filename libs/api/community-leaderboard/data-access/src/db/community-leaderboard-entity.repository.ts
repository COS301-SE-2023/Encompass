import { Injectable } from "@nestjs/common";
import { CommunityLeaderboardSchema } from "./community-leaderboard.schema";
import { CommunityLeaderboardSchemaFactory } from "./community-leaderboard-schema.factory";
import { BaseEntityRepository } from "@encompass/api/database/data-access";
import { CommunityLeaderboard } from "../community-leaderboard";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class CommunityLeaderboardEntityRepository extends BaseEntityRepository<
  CommunityLeaderboardSchema,
  CommunityLeaderboard
  >{
    constructor(
      @InjectModel(CommunityLeaderboardSchema.name)
      communityLeaderboardModel: Model<CommunityLeaderboardSchema>,
      communityLeaderboardSchemaFactory: CommunityLeaderboardSchemaFactory,
    ){
      super(communityLeaderboardModel, communityLeaderboardSchemaFactory);
    }
  }