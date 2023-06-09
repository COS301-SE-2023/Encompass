import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { MongooseModule } from "@nestjs/mongoose";
import { CommentController } from "./comment.controller";
import { CommentSchema } from "./db/comment.schema";
import { SchemaFactory } from "@nestjs/mongoose";
import { CommentEntityRepository } from "./db/comment-entity.repository";
import { CommentDtoRepository } from "./db/comment-dto.repository";
import { CommentSchemaFactory } from "./db/comment-schema.factory";
import { CommentFactory } from "./comment.factory";
import { CreateCommentHandler } from "./commands";
import { DeleteCommandHandler } from "./commands/delete-comment/delete-comment.handler";
import { AddReplyHandler } from "./commands/add-reply/add-reply.handler";

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      {
        name: CommentSchema.name,
        schema: SchemaFactory.createForClass(CommentSchema),
      }
    ])
  ],
  controllers: [CommentController],
  providers: [
    CommentEntityRepository,
    CommentDtoRepository,
    CommentSchemaFactory,
    CommentFactory,
    CreateCommentHandler,
    DeleteCommandHandler,
    AddReplyHandler,
  ],
})

export class CommentModule{}