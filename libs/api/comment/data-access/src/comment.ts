import { AggregateRoot } from "@nestjs/cqrs";
import { AddReplyRequest } from "./dto/add-reply-request.dto";
import { ObjectId } from "mongodb";

export class Comment extends AggregateRoot{
  constructor(
    public readonly _id: string,
    public postId: string,
    public username: string,
    public text: string,
    public replies: {
      id: string;
      username: string;
      text: string;
      dateAdded: Date;
    }[],
    public dateAdded: Date,
  ){
    super();
  }

  getId(): string {
    return this._id;
  }

  getPostId(): string {
    return this.postId;
  }

  getUsername(): string {
    return this.username;
  }

  getText(): string {
    return this.text;
  }

  getDateAdded(): Date {
    return this.dateAdded;
  }
  
  getReplies(): {
    id: string;
    username: string;
    text: string;
    dateAdded: Date;
  }[] {
    return this.replies;
  }

  addReply(reply: AddReplyRequest): void {
    this.replies.push({
      id: new ObjectId().toHexString(),
      username: reply.username,
      text: reply.text,
      dateAdded: new Date(),
    })
  }
}