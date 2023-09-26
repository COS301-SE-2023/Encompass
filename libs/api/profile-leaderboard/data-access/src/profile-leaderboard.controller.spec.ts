import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ProfileLeaderboardController } from './profile-leaderboard.controller';
import { GetLeaderboardQuery } from './queries/get-leaderboard/get-leaderboard.query';
import { SetLeaderboardCommand } from './commands/set-leaderboard/set-leaderboard.command';
import { ProfileLeaderboardDto } from './profile-leaderboard.dto';

describe('ProfileLeaderboardController', () => {
  let controller: ProfileLeaderboardController;
  let queryBus: QueryBus;
  let commandBus: CommandBus;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileLeaderboardController],
      providers: [
        {
          provide: QueryBus,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: CommandBus,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProfileLeaderboardController>(
      ProfileLeaderboardController,
    );
    queryBus = module.get<QueryBus>(QueryBus);
    commandBus = module.get<CommandBus>(CommandBus);
  });

  describe('getLeaderboard', () => {
    it('should return an array of ProfileLeaderboardDto', async () => {
      const result: ProfileLeaderboardDto[] = [
        {
          _id: '1',
          name: 'John Doe',
          lastName: 'Doe',
          ep: 100,
          username: 'johndoe',
          profileImage: 'https://i.imgur.com/1.jpg',
        },
        {
          _id: '2',
          name: 'Jane Doe',
          lastName: 'Doe',
          ep: 50,
          username: 'janedoe',
          profileImage: 'https://i.imgur.com/2.jpg',
        },
      ];
      jest.spyOn(queryBus, 'execute').mockResolvedValue(result);

      expect(await controller.getLeaderboard()).toBe(result);
      expect(queryBus.execute).toHaveBeenCalledWith(new GetLeaderboardQuery());
    });
  });

  describe('setLeaderboard', () => {
    it('should return an array of ProfileLeaderboardDto', async () => {
      const result: ProfileLeaderboardDto[] = [
        {
          _id: '1',
          name: 'John Doe',
          lastName: 'Doe',
          ep: 100,
          username: 'johndoe',
          profileImage: 'https://i.imgur.com/1.jpg',
        },
        {
          _id: '2',
          name: 'Jane Doe',
          lastName: 'Doe',
          ep: 50,
          username: 'janedoe',
          profileImage: 'https://i.imgur.com/2.jpg',
        },
      ];
      jest.spyOn(commandBus, 'execute').mockResolvedValue(result);

      expect(await controller.setLeaderboard()).toBe(result);
      expect(commandBus.execute).toHaveBeenCalledWith(new SetLeaderboardCommand());
    });
  });
});