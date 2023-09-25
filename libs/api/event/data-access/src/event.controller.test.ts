import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateEventRequest } from './dto';
import { EventDto } from './event.dto';
import { GetByUsernameQuery } from './queries/get-by-username/get-by-username.query';
import { GetByIdQuery } from './queries/get-by-id/get-by-id.query';
import { GetByCommunityQuery } from './queries/get-by-community/get-by-community.query';
import { CreateEventCommand } from './commands/create-event/create-event.command';
import { AddUserCommand } from './commands/add-user/add-user.command';
import { EventController } from './event.controller';

describe('EventController', () => {
  let controller: EventController;
  let commandBus: CommandBus;
  let queryBus: QueryBus;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventController],
      providers: [
        {
          provide: CommandBus,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: QueryBus,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<EventController>(EventController);
    commandBus = module.get<CommandBus>(CommandBus);
    queryBus = module.get<QueryBus>(QueryBus);
  });

  describe('createEvent', () => {
    it('should call commandBus.execute with a CreateEventCommand', async () => {
      const createEventRequest: CreateEventRequest = {
        name: 'Test Event',
        host: 'Test User',
        community: 'Test Community',
        description: 'This is a test event',
        startDate: new Date(),
        endDate: new Date(),
        members: [],
        prompt: [],
        categories: [],
        numberOfQuestions: 0,
        quizDescription: ['This is a test quiz'],
      };

      await controller.createEvent(createEventRequest);

      expect(commandBus.execute).toHaveBeenCalledWith(
        expect.any(CreateEventCommand)
      );
    });
  });

  describe('getEventsByUserId', () => {
    it('should call queryBus.execute with a GetByUsernameQuery', async () => {
      const username = 'testuser';

      await controller.getEventsByUserId(username);

      expect(queryBus.execute).toHaveBeenCalledWith(
        expect.any(GetByUsernameQuery)
      );
    });
  });

  describe('getEventsByCommunity', () => {
    it('should call queryBus.execute with a GetByCommunityQuery', async () => {
      const communityName = 'testcommunity';

      await controller.getEventsByCommunity(communityName);

      expect(queryBus.execute).toHaveBeenCalledWith(
        expect.any(GetByCommunityQuery)
      );
    });
  });

  describe('getEventById', () => {
    it('should call queryBus.execute with a GetByIdQuery', async () => {
      const id = 'testid';

      await controller.getEventById(id);

      expect(queryBus.execute).toHaveBeenCalledWith(expect.any(GetByIdQuery));
    });
  });

  describe('addUserToEvent', () => {
    it('should call commandBus.execute with an AddUserCommand', async () => {
      const eventId = 'testeventid';
      const username = 'testuser';

      await controller.addUserToEvent(eventId, username);

      expect(commandBus.execute).toHaveBeenCalledWith(
        expect.any(AddUserCommand)
      );
    });
  });
});