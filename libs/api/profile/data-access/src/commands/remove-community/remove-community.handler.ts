import { CommandHandler, ICommandHandler, EventPublisher } from "@nestjs/cqrs";
import { RemoveCommunityCommand } from "./remove-community.command";
import { ProfileEntityRepository } from "../../db/profile-entity.repository";

@CommandHandler(RemoveCommunityCommand)
export class RemoveCommunityHandler implements ICommandHandler<RemoveCommunityCommand>{
  constructor(
    private readonly profileEntityRepository: ProfileEntityRepository,
    private readonly eventPublisher: EventPublisher
  ){}

  async execute({ username, communityName }: RemoveCommunityCommand){
    const profile = this.eventPublisher.mergeObjectContext(
      await this.profileEntityRepository.findOneByUsername(username),
    );

    profile.removeCommunity(communityName);
    await this.profileEntityRepository.findOneAndReplaceById(profile._id, profile);
    profile.commit();

    return profile;
  }
}