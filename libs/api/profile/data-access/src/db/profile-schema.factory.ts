import { Injectable } from "@nestjs/common";
import { Profile } from "../profile";
import { ProfileSchema } from "./profile.schema";
import { EntitySchemaFactory } from "@encompass/api/database/data-access";
import { ObjectId } from "mongodb";

@Injectable()
export class ProfileSchemaFactory
  implements EntitySchemaFactory<ProfileSchema, Profile> {
    create(profile: Profile): ProfileSchema {
      return {
        _id: new ObjectId(profile.getId()),
        name: profile.getName(),
        lastName: profile.getLastName(),
        username: profile.getUsername(),
        categories: profile.getCategories(),
        awards: profile.getAwards(),
        events: profile.getEvents(),
        followers: profile.getFollowers(),
        following: profile.getFollowing(),
        posts: profile.getPosts(),
        reviews: profile.getReviews(),
      };
    }

    createFromSchema(entitySchema: ProfileSchema): Profile{
      return new Profile(
        entitySchema._id.toHexString(),
        entitySchema.name,
        entitySchema.lastName,
        entitySchema.username,
        entitySchema.categories,
        entitySchema.awards,
        entitySchema.events,
        entitySchema.followers,
        entitySchema.following,
        entitySchema.posts,
        entitySchema.reviews
      )
    }
  }