import { Get, Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { MongooseModule } from "@nestjs/mongoose";
import { PostSchema } from "./db/post.schema";
import { SchemaFactory } from "@nestjs/mongoose";
import { PostController } from "./post.controller";
import { PostEntityRepository } from "./db/post-entity.repository";
import { PostDtoRepository } from "./db/post-dto.repository";
import { PostSchemaFactory } from "./db/post-schema.factory";
import { PostFactory } from "./post.factory";
import { CreatePostHandler, UpdatePostHandler, DeletePostHandler } from "./commands";
import { GetAllPostsHandler, GetByCommunityHandler, GetByIdHandler, GetLatestPostHandler, GetPopularPostsHandler, GetPostsByKeywordHandler, GetRecommendedPostsHandler, UserIdGetPostHandler } from "./queries";
import { UploadImage } from "./upload-image.service";
import { HttpModule } from "@nestjs/axios";
import { DislikePostHandler } from "./commands/dislike-post/dislike-post.handler";
import { LikePostHandler } from "./commands/like-post/like-post.handler";
// import { GetPosts } from "@encompass/app/profile/util";

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      {
        name: PostSchema.name,
        schema: SchemaFactory.createForClass(PostSchema),
      }
    ]),
    HttpModule
  ],
  controllers: [PostController],
  providers: [
    PostEntityRepository,
    PostDtoRepository,
    PostSchemaFactory,
    PostFactory,
    CreatePostHandler,
    UpdatePostHandler,
    DeletePostHandler,
    GetAllPostsHandler,
    GetPopularPostsHandler,
    GetLatestPostHandler,
    UserIdGetPostHandler,
    UploadImage,
    GetByIdHandler,
    GetByCommunityHandler,
    GetPostsByKeywordHandler,
    GetRecommendedPostsHandler,
    DislikePostHandler,
    LikePostHandler,
  ],
})

export class PostModule{}