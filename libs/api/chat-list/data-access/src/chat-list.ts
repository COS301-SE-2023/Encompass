import { AggregateRoot } from "@nestjs/cqrs";

export class ChatList extends AggregateRoot{
  constructor(
    public readonly _id: string,
    public username: string,
    public chatList: {
      chatRef: string;
      otherUser: string;
    }[],
  ){
    super();
  }

  getId(): string {
    return this._id;
  }

  getUsername(): string {
    return this.username;
  }

  getChatList(): {
    chatRef: string;
    otherUser: string;
  }[] {
    return this.chatList;
  }
}