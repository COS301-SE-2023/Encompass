import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { RemoveFollowerCommand } from "./remove-follower.command";
import { ProfileEntityRepository } from "../../db/profile-entity.repository";

@CommandHandler(RemoveFollowerCommand)
export class RemoveFollowerHandler implements ICommandHandler<RemoveFollowerCommand>{
  constructor(private profileEntityRepository: ProfileEntityRepository, private eventPublisher: EventPublisher){}

  async execute({userId, followerId}: RemoveFollowerCommand) {
    const profile = this.eventPublisher.mergeObjectContext(
      await this.profileEntityRepository.findOneByUsername(userId),
    );

    profile.removeFollower(followerId);
    await this.profileEntityRepository.findOneAndReplaceById(profile._id, profile);
    profile.commit();

    return profile;
  }
}