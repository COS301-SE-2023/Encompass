import { CommandHandler, ICommandHandler, EventPublisher } from "@nestjs/cqrs";
import { AddReplyCommand } from "./add-reply.command";
import { CommentEntityRepository } from "../../db/comment-entity.repository";

@CommandHandler(AddReplyCommand)
export class AddReplyHandler 
  implements ICommandHandler<AddReplyCommand>{
    constructor(
      private readonly commentEntityRepository: CommentEntityRepository,
      private readonly eventPublisher: EventPublisher,
    ){}

    async execute({ commentId, reply }: AddReplyCommand){
      const comment = this.eventPublisher.mergeObjectContext(
        await this.commentEntityRepository.findOneById(commentId),
      );

      comment.addReply(reply);
      await this.commentEntityRepository.findOneAndReplaceById(commentId, comment);
      comment.commit();

      return comment;
    }
  }