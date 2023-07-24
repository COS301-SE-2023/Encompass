import { IdentifiableEntitySchema } from "@encompass/api/database/data-access";
import { Prop, Schema } from "@nestjs/mongoose";

@Schema({ versionKey: false, collection: "chat-list" })
export class ChatListSchema extends IdentifiableEntitySchema{
  @Prop()
  readonly username!: string;

  @Prop()
  readonly chatList!:{
    chatRef: string;
    otherUser: string;
  }[]
}