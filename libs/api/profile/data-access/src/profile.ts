import { AggregateRoot } from "@nestjs/cqrs";
import { UpdateProfileRequest } from "./dto/update-profile-request.dto";

export class Profile extends AggregateRoot{
  constructor(
    public readonly _id: string ,
    public username: string,
    public name: string | null,
    public lastName: string | null,
    public categories: {
      category: string;
      score: number;
    } [] | null,
    public communities: string [] | null,
    public awards: string [] | null,
    public events: string [] | null,
    public followers: string [] | null,
    public following: string [] | null,
    public posts: string [] | null,
    public reviews: string [] | null,
    public profileImage: string | null,
    public profileBanner: string | null,
    public bio: string | null,
    public ep: number
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

  getCategories(): {
    category: string;
    score: number;
  } [] | null{
    return this.categories;
  }

  getCommunities(): string [] | null{
    return this.communities;
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

  getProfileImage(): string | null{
    return this.profileImage;
  }

  getProfileBanner(): string | null{
    return this.profileBanner;
  }
  getBio(): string | null{
    return this.bio;
  }

  getEP(): number{
    return this.ep;
  }

  updateProfile(updateProfileRequest: UpdateProfileRequest){
    this.username = updateProfileRequest.username;
    this.name = updateProfileRequest.name;
    this.lastName = updateProfileRequest.lastName;
    this.categories = updateProfileRequest.categories;
    this.communities = updateProfileRequest.communities;
    this.awards = updateProfileRequest.awards;
    this.events = updateProfileRequest.events;
    this.followers = updateProfileRequest.followers;
    this.following = updateProfileRequest.following;
    this.posts = updateProfileRequest.posts;
    this.reviews = updateProfileRequest.reviews;
    this.profileImage = updateProfileRequest.profileImage;
    this.profileBanner = updateProfileRequest.profileBanner;
    this.bio = updateProfileRequest.bio;
  }

  removePost(postId: string){
    if(this.posts) 
      this.posts = this.posts.filter(post => post !== postId);
  }

  removeCommunity(communityName: string){
    if(this.communities)
      this.communities = this.communities.filter(community => community !== communityName);
  }

  addFollower(followerId: string){
    if(this.followers){
      this.followers = [...this.followers, followerId];
    }

    else{
      this.followers = [followerId];
    }
  }

  addFollowing(followingId: string){
    if(this.following){
      this.following = [...this.following, followingId]
    }

    else{
      this.following = [followingId]
    }
  }

  removeFollower(followerId: string){
    if(this.followers)
      this.followers = this.followers.filter(follower => follower !== followerId);
  }

  removeFollowing(followingId: string){
    if(this.following)
      this.following = this.following.filter(follow => follow !== followingId);
  }

  addCommunity(communityName: string){
    if(this.communities){
      if(this.communities.includes(communityName)) return;
      this.communities = [...this.communities, communityName];
    }

    else{
      this.communities = [communityName];
    }
  }

  removeCoins(amount:number){
    this.ep = Number(this.ep) - Number(amount);

    if(this.ep < 0){
      this.ep = 0;
    }
  }
  
  addCoins(amount: number){
    this.ep = Number(this.ep) + Number(amount);
  }

  addAward(awardName: string){
    if(this.awards){
      if(this.awards.includes(awardName)) return;
      this.awards = [...this.awards, awardName];
    }

    else{
      this.awards = [awardName];
    }
  }

  removeAward(awardName: string){
    if(this.awards)
      this.awards = this.awards.filter(award => award !== awardName);
  }

  addEvent(eventId: string){
    if(this.events){
      if(this.events.includes(eventId)) return;
      this.events = [...this.events, eventId];
    }

    else{
      this.events = [eventId];
    }
  }
}