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
    firstName: string,
    lastName: string,
    username: string,
    categories: string[],
    awards: string[],
    events: string[],
    followers: string[],
    following: string[],
    posts: string[],
    reviews: string[],
  ) : Promise<Profile>{
    const profile = new Profile(
      new ObjectId(_id).toHexString(),
      firstName,
      lastName,
      username,
      categories,
      awards,
      events,
      followers,
      following,
      posts,
      reviews,
    );
    await this.profileEntityRepository.create(profile);
    profile.apply(new ProfileCreatedEvent(profile.getId()))
    return profile;
  }
}