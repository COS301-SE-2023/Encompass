import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { AddCoinsCommand } from './add-coins.command';
import { CommunityEntityRepository } from '../../db/community-entity.repository';

@CommandHandler(AddCoinsCommand)
export class AddCoinsHandler implements ICommandHandler<AddCoinsCommand> {
  constructor(
    private communityEntityRepository: CommunityEntityRepository,
    private eventPublisher: EventPublisher
  ) {}

  async execute({ communityName, addCoinsAmount }: AddCoinsCommand) {
    const community = this.eventPublisher.mergeObjectContext(
      await this.communityEntityRepository.findOneByName(communityName)
    );

    community.addCoins(addCoinsAmount);
    this.communityEntityRepository.findOneAndReplaceById(community._id, community);
    community.commit();

    return community;
  }
}