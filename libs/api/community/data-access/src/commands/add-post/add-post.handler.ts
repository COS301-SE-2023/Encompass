import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { AddPostCommand } from "./add-post.command";
import { CommunityEntityRepository } from "../../db/community-entity.repository";

@CommandHandler(AddPostCommand)
export class AddPostHandler implements ICommandHandler<AddPostCommand>{
  constructor(
    private readonly communityEntityRepository: CommunityEntityRepository,
    private readonly eventPublisher: EventPublisher
  ){}

  async execute({communityName, postName}: AddPostCommand) {
    const community = this.eventPublisher.mergeObjectContext(
      await this.communityEntityRepository.findOneByName(communityName)
    )  

    community.addPost(postName);
    await this.communityEntityRepository.findOneAndReplaceById(community._id, community);
    community.commit();

    return community
  }
}