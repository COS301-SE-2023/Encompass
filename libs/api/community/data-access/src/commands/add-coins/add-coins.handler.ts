import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { AddCoinsCommand } from './add-coins.command';
import { CommunityEntityRepository } from '../../db/community-entity.repository';
import { HttpService } from '@nestjs/axios';

@CommandHandler(AddCoinsCommand)
export class AddCoinsHandler implements ICommandHandler<AddCoinsCommand> {
  constructor(
    private communityEntityRepository: CommunityEntityRepository,
    private eventPublisher: EventPublisher,
    private httpService: HttpService
  ) {}

  async execute({ communityName, addCoinsAmount }: AddCoinsCommand) {
    const url = process.env["BASE_URL"];
    const community = this.eventPublisher.mergeObjectContext(
      await this.communityEntityRepository.findOneByName(communityName)
    );

    community.addCoins(addCoinsAmount);
    this.communityEntityRepository.findOneAndReplaceById(community._id, community);
    community.commit();

    try{
      this.httpService.patch(url + '/api/community-leaderboard/leaderboard').toPromise();
    }

    catch(error){
      console.log(error)
    }

    return community;
  }
}