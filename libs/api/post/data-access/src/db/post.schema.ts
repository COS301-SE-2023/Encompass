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
  readonly categories!: string[] | null;

  @Prop()
  readonly likes!: string[] | null;

  @Prop()
  readonly dateAdded!: Date;

  @Prop()
  readonly spoiler!: boolean;

  @Prop()
  readonly ageRestricted!: boolean;

  @Prop()
  readonly shares!: number;

  @Prop()
  readonly comments!: number;
}