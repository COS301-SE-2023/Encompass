import { CommandHandler, ICommandHandler, EventPublisher } from "@nestjs/cqrs";
import { RemovePostCommand } from "./remove-post.command";
import { ProfileEntityRepository } from "../../db/profile-entity.repository";

@CommandHandler(RemovePostCommand)
export class RemovePostHandler implements ICommandHandler<RemovePostCommand>{
  constructor( 
    private readonly profileEntityRepository: ProfileEntityRepository,
    private readonly eventPublisher: EventPublisher
    ){}

  async execute({ username, postId }: RemovePostCommand){
    const profile = this.eventPublisher.mergeObjectContext(
      await this.profileEntityRepository.findOneByUsername(username),
    );

    profile.removePost(postId);
    await this.profileEntityRepository.findOneAndReplaceById(profile._id, profile);
    profile.commit();

    return profile;
  }
}