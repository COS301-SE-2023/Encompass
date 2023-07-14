import { EntityFactory } from "@encompass/api/database/data-access";
import { Injectable } from "@nestjs/common";
import { ProfileEntityRepository } from "./db/profile-entity.repository";
import { ObjectId } from "mongodb";
import { ProfileCreatedEvent } from "./events";
import { Profile } from "./profile";

@Injectable()
export class ProfileFactory implements EntityFactory<Profile>{
  constructor(
    private readonly profileEntityRepository: ProfileEntityRepository,
  ){}

  async create(
    _id: string,
    username: string,
    name: string | null,
    lastName: string | null,
    categories: string[] | null,
    communities: string[] | null,
    awards: string[] | null,
    events: string[] | null,
    followers: string[] | null,
    following: string[] | null,
    posts: string[] | null,
    reviews: string[] | null,
    profileImage: string | null,
    profileBanner: string | null,
    bio: string | null,
  ) : Promise<Profile>{
    const profile = new Profile(
      new ObjectId(_id).toHexString(),
      username,
      name,
      lastName,
      categories,
      communities,
      awards,
      events,
      followers,
      following,
      posts,
      reviews,
      profileImage,
      profileBanner,
      bio,
    );
    await this.profileEntityRepository.create(profile);
    profile.apply(new ProfileCreatedEvent(profile.getId()))
    return profile;
  }
}