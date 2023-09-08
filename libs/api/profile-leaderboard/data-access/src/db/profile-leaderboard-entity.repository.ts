import { BaseEntityRepository } from "@encompass/api/database/data-access";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ProfileLeaderboardSchema } from "./profile-leaderboard.schema";
import { ProfileLeaderboardSchemaFactory } from "./profile-leaderboard-schema.factory";
import { ProfileLeaderboard } from "../profile-leaderboard";

@Injectable()
export class ProfileLeaderboardEntityRepository extends BaseEntityRepository<
ProfileLeaderboardSchema,
ProfileLeaderboard
>{
  constructor(
    @InjectModel(ProfileLeaderboardSchema.name)
    profileLeaderboardModel: Model<ProfileLeaderboardSchema>,
    profileLeaderboardSchemaFactory: ProfileLeaderboardSchemaFactory,
  ){
    super(profileLeaderboardModel, profileLeaderboardSchemaFactory);
  }
}