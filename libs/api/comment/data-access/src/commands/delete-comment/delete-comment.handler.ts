import { CommandHandler, ICommandHandler, EventPublisher } from "@nestjs/cqrs";
import { DeleteCommentCommand } from "./delete-comment.command";
import { CommentEntityRepository } from "../../db/comment-entity.repository";

@CommandHandler(DeleteCommentCommand)
export class DeleteCommandHandler 
  implements ICommandHandler<DeleteCommentCommand>{
  constructor(
    private readonly commentEntityRepository: CommentEntityRepository,
    private readonly eventPublisher: EventPublisher,
  ){}

  async execute({ id }: DeleteCommentCommand){
    const comment = this.commentEntityRepository.findOneById(id);
    await this.commentEntityRepository.findAndDelete(id);

    return comment;
  }
}