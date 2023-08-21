import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { AddCoinsByUserIdCommand } from "./add-coins-by-userId.command";
import { ProfileEntityRepository } from "../../db/profile-entity.repository";

@CommandHandler(AddCoinsByUserIdCommand)
export class AddCoinsByUserIdHandler implements ICommandHandler<AddCoinsByUserIdCommand>{
  constructor(
    private readonly profileEntityRepository: ProfileEntityRepository,
    private readonly eventPublisher: EventPublisher
  ){}

  async execute({userId, coins}: AddCoinsByUserIdCommand){
    const profile = this.eventPublisher.mergeObjectContext(
      await this.profileEntityRepository.findOneById(userId)
    );

    profile.addCoins(coins);
    this.profileEntityRepository.findOneAndReplaceById(profile._id, profile);
    profile.commit();

    return profile;
  }
}