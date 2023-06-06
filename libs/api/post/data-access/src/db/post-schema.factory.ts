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
        communityId: post.getCommunityId(),
        title: post.getTitle(),
        text: post.getText(),
        username: post.getUsername(),
        imageUrl: post.getImageUrl(),
        categories: post.getCategories(),
        likes: post.getLikes(),
        dateAdded: post.getDateAdded(),
      };
    }

    createFromSchema(entitySchema: PostSchema): Post{
      return new Post(
        entitySchema._id.toHexString(),
        entitySchema.communityId,
        entitySchema.title,
        entitySchema.text,
        entitySchema.username,
        entitySchema.imageUrl,
        entitySchema.categories,
        entitySchema.likes,
        entitySchema.dateAdded,
      )
    }
  }