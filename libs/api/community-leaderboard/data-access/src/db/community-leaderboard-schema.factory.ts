import { EntitySchemaFactory } from "@encompass/api/database/data-access";
import { Injectable } from "@nestjs/common";
import { CommunityLeaderboardSchema } from "./community-leaderboard.schema";
import { CommunityLeaderboard } from "../community-leaderboard";
import { ObjectId } from "mongodb";

@Injectable()
export class CommunityLeaderboardSchemaFactory 
  implements EntitySchemaFactory<CommunityLeaderboardSchema, CommunityLeaderboard>{
    create(entity: CommunityLeaderboard): CommunityLeaderboardSchema {
      return {
        _id: new ObjectId(entity.getId()),
        name: entity.getName(),
        communityEP: entity.getCommunityEP(),
        position: entity.getPosition()
      }
    }

    createFromSchema(entitySchema: CommunityLeaderboardSchema): CommunityLeaderboard {
      return new CommunityLeaderboard(
        entitySchema._id.toHexString(),
        entitySchema.name,
        entitySchema.communityEP,
        entitySchema.position
      )
    }
  }