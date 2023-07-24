import { CommandHandler, ICommandHandler, EventPublisher } from "@nestjs/cqrs";
import { DeleteByPostIdCommand } from "./delete-by-post-id.command";
import { CommentEntityRepository } from "../../db/comment-entity.repository";

@CommandHandler(DeleteByPostIdCommand)
export class DeleteByPostIdHandler implements ICommandHandler<DeleteByPostIdCommand>{
  constructor(
    private readonly commentEntityRepository: CommentEntityRepository,
    private readonly eventPublisher: EventPublisher,
  ){}

  async execute({ postId }: DeleteByPostIdCommand){
    await this.commentEntityRepository.findAndDeleteByPostId(postId);

    return postId;
  }
}