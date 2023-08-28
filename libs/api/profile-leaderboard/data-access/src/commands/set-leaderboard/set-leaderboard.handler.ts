import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SetLeaderboardCommand } from './set-leaderboard.command';
import { ProfileLeaderboardDto } from '../../profile-leaderboard.dto';
import { HttpService } from '@nestjs/axios';
import { ProfileLeaderboardDtoRepository } from '../../db/profile-leaderboard-dto.repository';

@CommandHandler(SetLeaderboardCommand)
export class SetLeaderboardCommandHandler
  implements ICommandHandler<SetLeaderboardCommand>
{
  constructor(
    private httpService: HttpService,
    private profileLeaderboardDtoRepository: ProfileLeaderboardDtoRepository
  ) {}

  async execute() {
    const url = process.env['BASE_URL'];

    const leaderboard: ProfileLeaderboardDto[] =
      await this.profileLeaderboardDtoRepository.getLeaderboard();
    const newLeaderboard: ProfileLeaderboardDto[] = [];

    try {
      if (leaderboard.length > 0) {
        this.httpService
          .patch(
            url +
              '/api/profile/remove-award/' +
              leaderboard[0].username +
              '/topLeader'
          )
          .toPromise();
      }

      if (leaderboard.length > 1) {
        this.httpService
          .patch(
            url +
              '/api/profile/remove-award/' +
              leaderboard[1].username +
              '/secondLeader'
          )
          .toPromise();
      }

      if (leaderboard.length > 2) {
        this.httpService
          .patch(
            url +
              '/api/profile/remove-award/' +
              leaderboard[2].username +
              '/thirdLeader'
          )
          .toPromise();
      }
    } catch (error) {
      console.log(error);
    }
    const profilesPromise = await this.httpService
      .get(url + '/api/profile/leaderboard')
      .toPromise();
    const profiles: ProfileLeaderboardDto[] = profilesPromise?.data;

    profiles.forEach((profile) => {
      newLeaderboard.push({
        _id: profile._id,
        name: profile.name,
        lastName: profile.lastName,
        ep: profile.ep,
        username: profile.username,
      });
    });

    try {
      this.httpService
        .patch(
          url +
            '/api/profile/add-award/' +
            newLeaderboard[0].username +
            '/topLeader'
        )
        .toPromise();
      this.httpService
        .patch(
          url +
            '/api/profile/add-award/' +
            newLeaderboard[1].username +
            '/secondLeader'
        )
        .toPromise();
      this.httpService
        .patch(
          url +
            '/api/profile/add-award/' +
            newLeaderboard[2].username +
            '/thirdLeader'
        )
        .toPromise();
    } catch (error) {
      console.log(error);
    }

    try {
      await this.profileLeaderboardDtoRepository.removeAll();
      await this.profileLeaderboardDtoRepository.insertMany(newLeaderboard);
    } catch (error) {
      console.log(error);
    }

    return newLeaderboard;
  }
}
