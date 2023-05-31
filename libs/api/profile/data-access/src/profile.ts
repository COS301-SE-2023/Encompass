import { AggregateRoot } from "@nestjs/cqrs";

export class Profile extends AggregateRoot{
  constructor(
    public readonly _id: string ,
    public readonly username: string,
    public readonly name: string,
    public readonly lastName: string,
    public readonly categories: string [],
    public readonly awards: string [],
    public readonly events: string [],
    public readonly followers: string [],
    public readonly following: string [],
    public readonly posts: string [],
    public readonly reviews: string [],
  ){
    super();
  }
  
  getId(): string {
    return this._id;
  }

  getUsername(): string {
    return this.username;
  }

  getName(): string{
    return this.name;
  }

  getLastName(): string{
    return this.lastName;
  }

  getCategories(): string []{
    return this.categories;
  }

  getAwards(): string []{
    return this.awards;
  }

  getEvents(): string []{
    return this.events;
  }

  getFollowers(): string []{
    return this.followers;
  }

  getFollowing(): string []{
    return this.following;
  }

  getPosts(): string []{
    return this.posts;
  }

  getReviews(): string []{
    return this.reviews;
  }
}