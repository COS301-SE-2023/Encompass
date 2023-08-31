import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SetLeaderboardCommand } from './set-leaderboard.command';
import { HttpService } from '@nestjs/axios';
import { CommunityLeaderboardDtoRepository } from '../../db/community-leaderboard-dto.repository';
import { CommunityLeaderboardDto } from '../../community-leaderboard.dto';

@CommandHandler(SetLeaderboardCommand)
export class SetLeaderboardHandler
  implements ICommandHandler<SetLeaderboardCommand>
{
  constructor(
    private httpService: HttpService,
    private communityLeaderboardDtoRepository: CommunityLeaderboardDtoRepository
  ) {}

  async execute() {
    const url = process.env['BASE_URL'];

    const newLeaderboard: CommunityLeaderboardDto[] = [];

    const communitiesPromise = await this.httpService
      .get(url + '/api/community/leaderboard')
      .toPromise();
    const communities: CommunityLeaderboardDto[] = communitiesPromise?.data;

    await this.communityLeaderboardDtoRepository.removeAll();

    communities.forEach((community) => {
      newLeaderboard.push({
        _id: community._id,
        name: community.name,
        communityEP: community.communityEP,
        position: community.position,
      });
    });

    try {
      await this.communityLeaderboardDtoRepository.insertMany(newLeaderboard);
    } catch (error) {
      console.log(error);
    }

    return newLeaderboard;
  }
}
