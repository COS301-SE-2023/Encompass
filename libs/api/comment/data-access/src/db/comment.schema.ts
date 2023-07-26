import { Schema, Prop } from "@nestjs/mongoose";
import { IdentifiableEntitySchema } from "@encompass/api/database/data-access";

@Schema({ versionKey: false, collection: "comment" })
export class CommentSchema extends IdentifiableEntitySchema{
  @Prop()
  readonly postId!: string;

  @Prop()
  readonly text!: string;

  @Prop()
  readonly username!: string;

  @Prop()
  readonly replies!: {
    id: string;
    username: string;
    text: string;
    dateAdded: Date;
    profileImage: string;
  }[];

  @Prop()
  readonly dateAdded!: Date;

  @Prop()
  readonly profileImage!: string;
}