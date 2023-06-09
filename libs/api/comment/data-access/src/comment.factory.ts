import { EntityFactory } from "@encompass/api/database/data-access";
import { Injectable } from "@nestjs/common";
import { Comment } from "./comment";
import { CommentEntityRepository } from "./db/comment-entity.repository";
import { CommentCreatedEvent } from "./events";
import { ObjectId } from "mongodb";

@Injectable()
export class CommentFactory implements EntityFactory<Comment>{
  constructor(
    private readonly commentEntityRepository: CommentEntityRepository,
  ){}

  async create(
    postId: string,
    username: string,
    text: string,
  ) : Promise<Comment>{
    const comment = new Comment(
      new ObjectId().toHexString(),
      postId,
      username,
      text,
      [],
      new Date(),
    );
    await this.commentEntityRepository.create(comment);
    comment.apply(new CommentCreatedEvent(comment.getId()))
    return comment;
  }
}