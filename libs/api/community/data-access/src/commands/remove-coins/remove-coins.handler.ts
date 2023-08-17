import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { RemoveCoinsCommand } from './remove-coins.command';
import { CommunityEntityRepository } from '../../db/community-entity.repository';

@CommandHandler(RemoveCoinsCommand)
export class RemoveCoinsHandler implements ICommandHandler<RemoveCoinsCommand> {
  constructor(
    private communityEntityRepository: CommunityEntityRepository,
    private eventPublisher: EventPublisher
  ){}

  async execute({ communityName, removeCoinsAmount }: RemoveCoinsCommand) {
    const community = this.eventPublisher.mergeObjectContext(
      await this.communityEntityRepository.findOneByName(communityName)
    );

    community.removeCoins(removeCoinsAmount);
    this.communityEntityRepository.findOneAndReplaceById(community._id, community);
    community.commit();

    return community;
  }
}