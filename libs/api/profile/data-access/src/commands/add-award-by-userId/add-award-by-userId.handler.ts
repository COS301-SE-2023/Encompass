import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { AddAwardByUserIdCommand } from "./add-award-by-userId.command";
import { ProfileEntityRepository } from "../../db/profile-entity.repository";

@CommandHandler(AddAwardByUserIdCommand)
export class AddAwardByUserIdHandler implements ICommandHandler<AddAwardByUserIdCommand>{
  constructor(
    private readonly profileEntityRepository: ProfileEntityRepository,
    private readonly eventPublisher: EventPublisher
  ){}

  async execute({userId, award}: AddAwardByUserIdCommand){
    const profile = this.eventPublisher.mergeObjectContext(
      await this.profileEntityRepository.findOneById(userId)
    );

    profile.addAward(award);
    this.profileEntityRepository.findOneAndReplaceById(profile._id, profile);
    profile.commit();

    return profile;
  }
}