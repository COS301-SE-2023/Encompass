import { CommandHandler, ICommandHandler, EventPublisher } from "@nestjs/cqrs";
import { UpdatePostCommand } from "./update-post.command";
import { PostEntityRepository } from "../../db/post-entity.repository";

@CommandHandler(UpdatePostCommand)
export class UpdatePostHandler 
  implements ICommandHandler<UpdatePostCommand> {
    constructor(
      private readonly postEntityRepository: PostEntityRepository,
      private readonly eventPublisher: EventPublisher,
    ){}

    async execute({ id, updatePostRequest }: UpdatePostCommand){
      const post = this.eventPublisher.mergeObjectContext(
        await this.postEntityRepository.findOneById(id),
      );

      post.updatePost(updatePostRequest);
      await this.postEntityRepository.findOneAndReplaceById(id, post);
      post.commit();

      return post;
    }
  }