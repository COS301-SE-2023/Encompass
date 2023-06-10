import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { PostSchema } from "./post.schema";
import { Post } from "../post";
import { BaseEntityRepository } from "@encompass/api/database/data-access";
import { PostSchemaFactory } from "./post-schema.factory";

@Injectable()
export class PostEntityRepository extends BaseEntityRepository<
  PostSchema,
  Post
> {
  constructor(
    @InjectModel(PostSchema.name)
    postModel: Model<PostSchema>,
    postSchemaFactory: PostSchemaFactory,
  ) {
    super(postModel, postSchemaFactory);
  }
}