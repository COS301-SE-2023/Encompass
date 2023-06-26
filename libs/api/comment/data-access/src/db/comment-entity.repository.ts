import { BaseEntityRepository } from "@encompass/api/database/data-access";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CommentSchema } from "./comment.schema";
import { Comment } from "../comment";
import { CommentSchemaFactory } from "./comment-schema.factory";

@Injectable()
export class CommentEntityRepository extends BaseEntityRepository<
  CommentSchema,
  Comment
> {
  constructor(
    @InjectModel(CommentSchema.name)
    commentModel: Model<CommentSchema>,
    commentSchemaFactory: CommentSchemaFactory,
  ) {
    super(commentModel, commentSchemaFactory);
  }
}