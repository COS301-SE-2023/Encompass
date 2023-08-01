import { CommandHandler, ICommandHandler, EventPublisher } from "@nestjs/cqrs";
import { AddCommunityCommand } from "./add-community.command";
import { ProfileEntityRepository } from "../../db/profile-entity.repository";
@CommandHandler(AddCommunityCommand)
export class AddCommunityHandler implements ICommandHandler<AddCommunityCommand>{
  constructor(
    private readonly eventPublisher: EventPublisher,
    private readonly profileEntityRepository: ProfileEntityRepository,
  ){}

  async execute({username, communityName}: AddCommunityCommand){
    const profile = this.eventPublisher.mergeObjectContext(
      await this.profileEntityRepository.findOneByUsername(username)
    );

    profile.addCommunity(communityName);
    this.profileEntityRepository.findOneAndReplaceById(profile._id, profile);
    profile.commit();

    return profile;
  }
}