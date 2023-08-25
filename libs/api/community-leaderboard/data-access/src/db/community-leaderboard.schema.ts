import { IdentifiableEntitySchema } from "@encompass/api/database/data-access";
import { Prop, Schema } from "@nestjs/mongoose";

@Schema({ versionKey: false, collection: "community-leaderboard" })
export class CommunityLeaderboardSchema extends IdentifiableEntitySchema {
  @Prop()
  readonly name!: string;

  @Prop()
  readonly communityEP!: number;

  @Prop()
  readonly position!: number;
}