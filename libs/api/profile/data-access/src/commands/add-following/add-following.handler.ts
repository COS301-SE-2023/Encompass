import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { AddFollowingCommand } from "./add-following.command";
import { ProfileEntityRepository } from "../../db/profile-entity.repository";

@CommandHandler(AddFollowingCommand)
export class AddFollowingHandler implements ICommandHandler<AddFollowingCommand>{
  constructor(private profileEntityRepository: ProfileEntityRepository, private eventPublisher: EventPublisher){}

  async execute({userId, followingId}: AddFollowingCommand) {
    const profile = this.eventPublisher.mergeObjectContext(
      await this.profileEntityRepository.findOneByUsername(userId),
    );

    profile.addFollowing(followingId);
    await this.profileEntityRepository.findOneAndReplaceById(profile._id, profile);
    profile.commit();

    return profile;
  }
}