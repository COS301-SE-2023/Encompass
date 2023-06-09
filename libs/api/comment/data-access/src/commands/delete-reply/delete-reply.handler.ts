import { CommandHandler, ICommandHandler, EventPublisher } from "@nestjs/cqrs";
import { DeleteReplyCommand } from "./delete-reply.command";
import { CommentEntityRepository } from "../../db/comment-entity.repository";

@CommandHandler(DeleteReplyCommand)
export class DeleteReplyHandler 
  implements ICommandHandler<DeleteReplyCommand>{
  constructor(
    private readonly commentEntityRepository: CommentEntityRepository,
    private readonly eventPublisher: EventPublisher,
  ){}

  async execute({ commentId, replyId }: DeleteReplyCommand){
    const post = await this.commentEntityRepository.findOneById(commentId);

    post.deleteReply(replyId);
    
    await this.commentEntityRepository.findOneAndReplaceById(commentId, post);

    return replyId;
  }
}