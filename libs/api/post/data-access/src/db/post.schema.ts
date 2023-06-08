import { IdentifiableEntitySchema } from "@encompass/api/database/data-access";
import { Schema, Prop } from "@nestjs/mongoose";

@Schema({ versionKey: false, collection: "post" })
export class PostSchema extends IdentifiableEntitySchema{
  @Prop()
  readonly communityId!: string;

  @Prop()
  readonly title!: string;

  @Prop()
  readonly text!: string;

  @Prop()
  readonly username!: string;

  @Prop()
  readonly imageUrl!: string | null;

  @Prop()
  readonly categories!: string[] | null;

  @Prop()
  readonly likes!: string[] | null;

  @Prop()
  readonly dateAdded!: Date;
}