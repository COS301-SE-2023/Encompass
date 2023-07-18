import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { RemoveFollowingCommand } from "./remove-following.command";
import { ProfileEntityRepository } from "../../db/profile-entity.repository";

@CommandHandler(RemoveFollowingCommand)
export class RemoveFollowingHandler implements ICommandHandler<RemoveFollowingCommand>{
  constructor(private profileEntityRepository: ProfileEntityRepository, private eventPublisher: EventPublisher){}

  async execute({userId, followingId}: RemoveFollowingCommand) {
    const profile = this.eventPublisher.mergeObjectContext(
      await this.profileEntityRepository.findOneByUsername(userId),
    );

    profile.removeFollowing(followingId);
    await this.profileEntityRepository.findOneAndReplaceById(profile._id, profile);
    profile.commit();

    return profile;
  }
}