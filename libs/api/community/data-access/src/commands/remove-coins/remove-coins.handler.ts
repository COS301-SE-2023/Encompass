import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { RemoveCoinsCommand } from './remove-coins.command';
import { CommunityEntityRepository } from '../../db/community-entity.repository';
import { HttpService } from '@nestjs/axios';

@CommandHandler(RemoveCoinsCommand)
export class RemoveCoinsHandler implements ICommandHandler<RemoveCoinsCommand> {
  constructor(
    private communityEntityRepository: CommunityEntityRepository,
    private eventPublisher: EventPublisher,
    private httpService: HttpService
  ){}

  async execute({ communityName, removeCoinsAmount }: RemoveCoinsCommand) {
    const url = process.env["BASE_URL"];
    const community = this.eventPublisher.mergeObjectContext(
      await this.communityEntityRepository.findOneByName(communityName)
    );

    community.removeCoins(removeCoinsAmount);
    this.communityEntityRepository.findOneAndReplaceById(community._id, community);
    community.commit();

    try{
      this.httpService.patch(url + '/api/community/leaderboard').toPromise();
    }

    catch(error){
      console.log(error)
    }

    return community;
  }
}