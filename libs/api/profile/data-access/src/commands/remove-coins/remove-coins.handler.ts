import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { RemoveCoinsCommand } from "./remove-coins.command";
import { ProfileEntityRepository } from "../../db/profile-entity.repository";

@CommandHandler(RemoveCoinsCommand)
export class RemoveCoinsHandler implements ICommandHandler<RemoveCoinsCommand>{
  constructor(
    private readonly profileEntityRepository: ProfileEntityRepository,
    private readonly eventPublisher: EventPublisher,
  ){}

  async execute({ username, removeCoinsAmount }: RemoveCoinsCommand){
    const profile = this.eventPublisher.mergeObjectContext(
      await this.profileEntityRepository.findOneByUsername(username),
    );

    profile.removeCoins(removeCoinsAmount);
    await this.profileEntityRepository.findOneAndReplaceById(profile._id, profile);
    profile.commit();

    return profile;
  }
}