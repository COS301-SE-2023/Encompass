import { EntitySchemaFactory } from "@encompass/api/database/data-access";
import { Injectable } from "@nestjs/common";
import { ProfileLeaderboard } from "../profile-leaderboard";
import { ProfileLeaderboardSchema } from "./profile-leaderboard.schema";
import { ObjectId } from "mongodb";

@Injectable()
export class ProfileLeaderboardSchemaFactory
  implements EntitySchemaFactory<ProfileLeaderboardSchema, ProfileLeaderboard>{
    create(profileLeaderboard: ProfileLeaderboard): ProfileLeaderboardSchema{
      return {
        _id: new ObjectId(profileLeaderboard.getId()),
        name: profileLeaderboard.getName(),
        lastName: profileLeaderboard.getLastName(),
        ep: profileLeaderboard.getEp(),
        username: profileLeaderboard.getUsername()
      }
    }

    createFromSchema(entitySchema: ProfileLeaderboardSchema): ProfileLeaderboard{
      return new ProfileLeaderboard(
        entitySchema._id.toHexString(),
        entitySchema.name,
        entitySchema.lastName,
        entitySchema.ep,
        entitySchema.username
      )
    }
}