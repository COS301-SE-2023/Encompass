import { EntitySchemaFactory } from "@encompass/api/database/data-access";
import { Injectable } from "@nestjs/common";
import { Post } from "../post";
import { PostSchema } from "./post.schema";
import { ObjectId } from "mongodb";


@Injectable()
export class PostSchemaFactory
  implements EntitySchemaFactory<PostSchema, Post> {
    create(post: Post): PostSchema {
      return{
        _id: new ObjectId(post.getId()),
        community: post.getCommunity(),
        title: post.getTitle(),
        text: post.getText(),
        username: post.getUsername(),
        imageUrl: post.getImageUrl(),
        communityImageUrl: post.getCommunityImageUrl(),
        categories: post.getCategories(),
        likes: post.getLikes(),
        dateAdded: post.getDateAdded(),
        spoiler: post.getSpoiler(),
        ageRestricted: post.getAgeRestricted(),
        shares: post.getShares(),
        comments: post.getComments(),
        reported: post.getReported()
      };
    }

    createFromSchema(entitySchema: PostSchema): Post{
      return new Post(
        entitySchema._id.toHexString(),
        entitySchema.community,
        entitySchema.title,
        entitySchema.text,
        entitySchema.username,
        entitySchema.imageUrl,
        entitySchema.communityImageUrl,
        entitySchema.categories,
        entitySchema.likes,
        entitySchema.dateAdded,
        entitySchema.spoiler,
        entitySchema.ageRestricted,
        entitySchema.shares,
        entitySchema.comments,
        entitySchema.reported
      )
    }
  }