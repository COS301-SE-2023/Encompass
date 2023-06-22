import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { MongooseModule } from "@nestjs/mongoose";
import { PostSchema } from "./db/post.schema";
import { SchemaFactory } from "@nestjs/mongoose";
import { PostController } from "./post.controller";
import { PostEntityRepository } from "./db/post-entity.repository";
import { PostDtoRepository } from "./db/post-dto.repository";
import { PostSchemaFactory } from "./db/post-schema.factory";
import { PostFactory } from "./post.factory";
import { CreatePostHandler, UpdatePostHandler, DeletePostHandler, UploadImageHandler } from "./commands";
import { UploadImage } from "./upload-image.service";

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      {
        name: PostSchema.name,
        schema: SchemaFactory.createForClass(PostSchema),
      }
    ]),
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
    UploadImageHandler,
    UploadImage,
  ],
})

export class PostModule{}