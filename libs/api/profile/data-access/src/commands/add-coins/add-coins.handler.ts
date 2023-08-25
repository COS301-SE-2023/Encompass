import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { AddCoinsCommand } from './add-coins.command';
import { ProfileEntityRepository } from '../../db/profile-entity.repository';
import { HttpService } from '@nestjs/axios';

@CommandHandler(AddCoinsCommand)
export class AddCoinsHandler implements ICommandHandler<AddCoinsCommand> {
  constructor(
    private eventPublisher: EventPublisher,
    private profileEntityRepository: ProfileEntityRepository,
    private httpService: HttpService
  ) {}

  async execute({username, addCoinsAmount}: AddCoinsCommand) {
    const url = process.env["BASE_URL"];

    const profile = this.eventPublisher.mergeObjectContext(
      await this.profileEntityRepository.findOneByUsername(username)
    );

    if(profile.awards?.includes('ultimate')){
      addCoinsAmount *= 2;
    }
    
    profile.addCoins(addCoinsAmount);
    this.profileEntityRepository.findOneAndReplaceById(profile._id, profile);
    profile.commit();

    profile.communities?.forEach(community => {
      try{
        this.httpService.patch(url + '/api/community/add-coins/' + community + '/' + addCoinsAmount).toPromise();
        this.httpService.patch(url + '/api/profile/leaderboard').toPromise();
      }

      catch(error){
        console.log(error);
      }
    })

    return profile;
  }
}
