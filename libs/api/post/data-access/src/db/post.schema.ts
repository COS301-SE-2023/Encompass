import { IdentifiableEntitySchema } from "@encompass/api/database/data-access";
import { Schema, Prop } from "@nestjs/mongoose";

@Schema({ versionKey: false, collection: "post" })
export class PostSchema extends IdentifiableEntitySchema{
  @Prop()
  readonly community!: string;

  @Prop()
  readonly title!: string;

  @Prop()
  readonly text!: string;

  @Prop()
  readonly username!: string;

  @Prop()
  readonly imageUrl!: string | null;

  @Prop()
  readonly communityImageUrl!: string | null;

  @Prop()
  readonly categories!: string[];

  @Prop()
  readonly likes!: string[];

  @Prop()
  readonly dateAdded!: string;

  @Prop()
  readonly spoiler!: boolean;

  @Prop()
  readonly ageRestricted!: boolean;

  @Prop()
  readonly shares!: number;

  @Prop()
  readonly comments!: number;
}