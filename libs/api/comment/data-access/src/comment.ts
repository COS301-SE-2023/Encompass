import { AggregateRoot } from "@nestjs/cqrs";

export class Comment extends AggregateRoot{
  constructor(
    public readonly _id: string,
    public postId: string,
    public username: string,
    public text: string,
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
  
}