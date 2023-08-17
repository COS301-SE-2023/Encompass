import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { AddAwardCommand } from "./add-award.command";
import { ProfileEntityRepository } from "../../db/profile-entity.repository";

@CommandHandler(AddAwardCommand)
export class AddAwardHandler implements ICommandHandler<AddAwardCommand>{
  constructor(
    private readonly eventPublisher: EventPublisher,
    private readonly profileEntityRepository: ProfileEntityRepository,
  ){}
  async execute({username, awardName}: AddAwardCommand){
    const profile = this.eventPublisher.mergeObjectContext(
      await this.profileEntityRepository.findOneByUsername(username)
    );

    profile.addAward(awardName);
    this.profileEntityRepository.findOneAndReplaceById(profile._id, profile);
    profile.commit();

    return profile;
  }
}