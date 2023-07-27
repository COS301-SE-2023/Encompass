import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateCommentCommand } from "./create-comment.command";
import { CommentFactory } from "../../comment.factory";
import { EventPublisher } from "@nestjs/cqrs";

@CommandHandler(CreateCommentCommand)
export class CreateCommentHandler
  implements ICommandHandler<CreateCommentCommand> {
    constructor(
      private readonly commentFactory: CommentFactory,
      private readonly eventPublisher: EventPublisher,
    ){}

    async execute({ createCommentRequest }: CreateCommentCommand){
      const {
        postId,
        username,
        text,
        profileImage
      } = createCommentRequest;

      const comment = this.eventPublisher.mergeObjectContext(
        await this.commentFactory.create(
          postId,
          username,
          text,
          profileImage
        )
      );

      comment.commit();

      return comment;
    }
  }