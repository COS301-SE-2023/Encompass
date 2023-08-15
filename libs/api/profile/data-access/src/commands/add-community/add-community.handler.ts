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

    if(profile.communities !== null){
      if(profile.communities?.length >= 5){
        profile.addAward('join5');
      }
  
      if(profile.communities?.length >= 15){
        profile.addAward('join15');
      }
  
      if(profile.communities?.length >= 50){
        profile.addAward('join50');
      }
    }

    this.profileEntityRepository.findOneAndReplaceById(profile._id, profile);
    profile.commit();

    return profile;
  }
}