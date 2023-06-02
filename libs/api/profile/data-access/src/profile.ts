import { AggregateRoot } from "@nestjs/cqrs";
import { UpdateProfileRequest } from "./dto/update-profile-request.dto";

export class Profile extends AggregateRoot{
  constructor(
    public readonly _id: string ,
    public username: string,
    public name: string,
    public lastName: string,
    public categories: string [],
    public awards: string [],
    public events: string [],
    public followers: string [],
    public following: string [],
    public posts: string [],
    public reviews: string [],
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

  updateProfile(updateProfileRequest: UpdateProfileRequest){
    this.username = updateProfileRequest.username;
    this.name = updateProfileRequest.name;
    this.lastName = updateProfileRequest.lastName;
    this.categories = updateProfileRequest.categories;
    this.awards = updateProfileRequest.awards;
    this.events = updateProfileRequest.events;
    this.followers = updateProfileRequest.followers;
    this.following = updateProfileRequest.following;
    this.posts = updateProfileRequest.posts;
    this.reviews = updateProfileRequest.reviews;
  }
}