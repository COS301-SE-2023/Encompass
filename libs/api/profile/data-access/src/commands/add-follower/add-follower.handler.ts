import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { AddFollowerCommand } from "./add-follower.command";
import { ProfileEntityRepository } from "../../db/profile-entity.repository";

@CommandHandler(AddFollowerCommand)
export class AddFollowerHandler implements ICommandHandler<AddFollowerCommand>{
  constructor(private profileEntityRepository: ProfileEntityRepository, private eventPublisher: EventPublisher){}

  async execute({userId, followerId}: AddFollowerCommand) {
    const profile = this.eventPublisher.mergeObjectContext(
      await this.profileEntityRepository.findOneByUsername(userId),
    );

    profile.addFollower(followerId);
    await this.profileEntityRepository.findOneAndReplaceById(profile._id, profile);
    profile.commit();

    return profile;
  }
}