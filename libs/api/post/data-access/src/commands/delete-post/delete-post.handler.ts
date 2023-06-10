import { CommandHandler, ICommandHandler, EventPublisher } from "@nestjs/cqrs";
import { DeletePostCommand } from "./delete-post.command";
import { PostEntityRepository } from "../../db/post-entity.repository";


@CommandHandler(DeletePostCommand)
export class DeletePostHandler 
  implements ICommandHandler<DeletePostCommand>{
  constructor(
    private readonly postEntityRepository: PostEntityRepository,
    private readonly eventPublisher: EventPublisher,
  ){}

  async execute({ id }: DeletePostCommand){
    

    // post.deletePost();
    await this.postEntityRepository.findAndDelete(id);

    return id;
  }
}