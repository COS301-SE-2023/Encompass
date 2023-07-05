import { CommandHandler, ICommandHandler, EventPublisher } from "@nestjs/cqrs";
import { RemovePostCommand } from "./remove-post.command";
import { CommunityEntityRepository } from "../../db/community-entity.repository";

@CommandHandler(RemovePostCommand)
export class RemovePostHandler implements ICommandHandler<RemovePostCommand>{
  constructor(
    private readonly communityEntityRepository: CommunityEntityRepository,
    private readonly eventPublisher: EventPublisher
    ){}

  async execute({ communityName, postId }: RemovePostCommand){
    const community = this.eventPublisher.mergeObjectContext(
      await this.communityEntityRepository.findOneByName(communityName)
    )  

    community.removePost(postId);
    await this.communityEntityRepository.findOneAndReplaceById(community._id, community);
    community.commit();

    return community
  }
}