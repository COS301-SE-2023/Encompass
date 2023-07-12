import { IdentifiableEntitySchema } from "@encompass/api/database/data-access";
import { Schema, Prop } from "@nestjs/mongoose";

@Schema({versionKey: false, collection: 'community-request'})
export class CommunityRequestSchema extends IdentifiableEntitySchema {
  @Prop()
  readonly requestUsernames!: string[]
}