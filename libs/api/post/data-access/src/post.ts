import { AggregateRoot } from "@nestjs/cqrs";

export class Post extends AggregateRoot{
  constructor(
    public readonly _id: string ,
    public communityId: string,
    public title: string,
    public text: string,
    public username: string,
    public imageUrl: string | null,
    public categories: string [] | null,
    public likes: string [] | null,
    public dateAdded: Date,
  ){
    super();
  }

  getId(): string {
    return this._id;
  }

  getCommunityId(): string {
    return this.communityId;
  }

  getTitle(): string {
    return this.title;
  }

  getText(): string {
    return this.text;
  }

  getUsername(): string {
    return this.username;
  }

  getImageUrl(): string | null{
    return this.imageUrl;
  }

  getCategories(): string [] | null{
    return this.categories;
  }

  getLikes(): string [] | null{
    return this.likes;
  }

  getDateAdded(): Date {
    return this.dateAdded;
  }
  
}