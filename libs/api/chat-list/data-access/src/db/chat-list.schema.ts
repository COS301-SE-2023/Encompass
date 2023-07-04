import { Prop, Schema } from "@nestjs/mongoose";

@Schema({ versionKey: false, collection: "chat-list" })
export class ChatListSchema {
  @Prop()
  readonly username!: string;

  @Prop()
  readonly chatList!:{
    chatRef: string;
    otherUser: string;
  }[]
}