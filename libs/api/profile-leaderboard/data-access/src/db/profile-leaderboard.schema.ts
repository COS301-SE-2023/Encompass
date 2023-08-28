import { IdentifiableEntitySchema } from "@encompass/api/database/data-access";
import { Prop, Schema } from "@nestjs/mongoose";

@Schema({ versionKey: false, collection: "profile-leaderboard" })
export class ProfileLeaderboardSchema extends IdentifiableEntitySchema{
  @Prop()
  readonly name!: string;

  @Prop()
  readonly lastName!: string;

  @Prop()
  readonly ep!: number;

  @Prop()
  readonly username!: string;

  @Prop()
  readonly profileImage!: string;
}