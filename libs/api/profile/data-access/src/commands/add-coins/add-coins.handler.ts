import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { AddCoinsCommand } from './add-coins.command';
import { ProfileEntityRepository } from '../../db/profile-entity.repository';

@CommandHandler(AddCoinsCommand)
export class AddCoinsHandler implements ICommandHandler<AddCoinsCommand> {
  constructor(
    private eventPublisher: EventPublisher,
    private profileEntityRepository: ProfileEntityRepository
  ) {}

  async execute({username, addCoinsAmount}: AddCoinsCommand) {
    const profile = this.eventPublisher.mergeObjectContext(
      await this.profileEntityRepository.findOneByUsername(username)
    );

    profile.addCoins(addCoinsAmount);
    this.profileEntityRepository.findOneAndReplaceById(profile._id, profile);
    profile.commit();

    return profile;
  }
}
