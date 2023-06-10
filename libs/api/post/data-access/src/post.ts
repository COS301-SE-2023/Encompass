import { AggregateRoot } from "@nestjs/cqrs";
import { UpdatePostRequest } from "./dto/update-post-request.dto";

export class Post extends AggregateRoot{
  constructor(
    public readonly _id: string ,
    public community: string,
    public title: string,
    public text: string,
    public username: string,
    public imageUrl: string | null,
    public categories: string [] | null,
    public likes: string [] | null,
    public dateAdded: Date,
    public spoiler: boolean,
    public ageRestricted: boolean
  ){
    super();
  }

  getId(): string {
    return this._id;
  }

  getCommunity(): string {
    return this.community;
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
  
  getSpoiler(): boolean {
    return this.spoiler;
  }

  getAgeRestricted(): boolean {
    return this.ageRestricted;
  }

  updatePost(updatePostRequest: UpdatePostRequest)
  {
    this.title = updatePostRequest.title;
    this.text = updatePostRequest.text;
    this.imageUrl = updatePostRequest.imageUrl;
    this.categories = updatePostRequest.categories;
    this.likes = updatePostRequest.likes;
    this.spoiler = updatePostRequest.spoiler;
    this.ageRestricted = updatePostRequest.ageRestricted;
  }
}