export class ChatListDto{
  readonly _id!: string;
  readonly username!: string;
  readonly chatList!: {
    chatRef: string;
    otherUser: string;
  }[];
}