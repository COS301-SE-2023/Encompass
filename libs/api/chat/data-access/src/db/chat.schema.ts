import { Schema, Prop } from "@nestjs/mongoose";
import { IdentifiableEntitySchema } from "@encompass/api/database/data-access";

@Schema({ versionKey: false, collection: "chat" })
export class ChatSchema extends IdentifiableEntitySchema{
  @Prop()
  readonly users!: string[];

  @Prop()
  readonly messages!: {
    username: string;
    message: string;
    dateTime: Date;
  }[];
}