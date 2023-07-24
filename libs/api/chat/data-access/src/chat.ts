import { AggregateRoot } from "@nestjs/cqrs";

export class Chat extends AggregateRoot{
  constructor(
    public readonly _id: string,
    public users: string[],
    public messages: {
      username: string;
      message: string;
      dateTime: Date;
    }[],
  ){
    super();
  }

  getId(): string {
    return this._id;
  }

  getUsers(): string[] {
    return this.users;
  }

  getMessages(): {
    username: string;
    message: string;
    dateTime: Date;
  }[] {
    return this.messages;
  }

  addMessage(
    username: string,
    message: string,
  ){
    const arr = [...this.messages, {username: username, message: message, dateTime: new Date()}]
    this.messages = arr;
  }
}