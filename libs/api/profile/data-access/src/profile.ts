import { AggregateRoot } from "@nestjs/cqrs";
import { UpdateProfileRequest } from "./dto/update-profile-request.dto";

export class Profile extends AggregateRoot{
  constructor(
    public readonly _id: string ,
    public username: string,
    public name: string | null,
    public lastName: string | null,
    public categories: string [] | null,
    public awards: string [] | null,
    public events: string [] | null,
    public followers: string [] | null,
    public following: string [] | null,
    public posts: string [] | null,
    public reviews: string [] | null,
  ){
    super();
  }
  
  getId(): string {
    return this._id;
  }

  getUsername(): string {
    return this.username;
  }

  getName(): string | null{
    return this.name;
  }

  getLastName(): string | null{
    return this.lastName;
  }

  getCategories(): string [] | null{
    return this.categories;
  }

  getAwards(): string [] | null{
    return this.awards;
  }

  getEvents(): string [] | null{
    return this.events;
  }

  getFollowers(): string [] | null{
    return this.followers;
  }

  getFollowing(): string [] | null{
    return this.following;
  }

  getPosts(): string [] | null{
    return this.posts;
  }

  getReviews(): string [] | null{
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