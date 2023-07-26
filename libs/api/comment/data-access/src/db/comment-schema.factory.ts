import { EntitySchemaFactory } from "@encompass/api/database/data-access";
import { Injectable } from "@nestjs/common";
import { CommentSchema } from "./comment.schema";
import { Comment } from "../comment";
import { ObjectId } from "mongodb";

@Injectable()
export class CommentSchemaFactory
  implements EntitySchemaFactory<CommentSchema, Comment>{
    create(comment: Comment): CommentSchema {
        return{
          _id: new ObjectId(comment.getId()),
          postId: comment.getPostId(),
          username: comment.getUsername(),
          text: comment.getText(),
          replies: comment.getReplies(),
          dateAdded: comment.getDateAdded(),
          profileImage: comment.getProfileImage(),
        }
    }

    createFromSchema(entitySchema: CommentSchema): Comment{
      return new Comment(
        entitySchema._id.toHexString(),
        entitySchema.postId,
        entitySchema.username,
        entitySchema.text,
        entitySchema.replies,
        entitySchema.dateAdded,
        entitySchema.profileImage,
      )
    }
  }