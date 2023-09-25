import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { UserEventsController } from './user-events.controller';
import { CreateUserEventsCommand } from './commands/create-events/create-user-events.command';
import { AddEventCommand } from './commands/add-event/add-event.command';
import { UpdateEventCommand } from './commands/update-event/update-event.command';
import { GetUserEventsQuery } from './queries/get-user-events/get-user-events.query';
import { UserEventsDto } from './user-events.dto';
import { UpdateEventRequest } from './dto';

describe('UserEventsController', () => {
  let controller: UserEventsController;
  let commandBus: CommandBus;
  let queryBus: QueryBus;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserEventsController],
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

    controller = module.get<UserEventsController>(UserEventsController);
    commandBus = module.get<CommandBus>(CommandBus);
    queryBus = module.get<QueryBus>(QueryBus);
  });

  /*UserEventsDto{
  readonly _id!: string;
  readonly events!: {
    eventId: string,
    userAnswers: string[],
    numCorrect: number,
    quizComplete: boolean
  }[];*/

  describe('create', () => {
    it('should call commandBus.execute with CreateUserEventsCommand', async () => {
      const userId = '123';
      const expectedCommand = new CreateUserEventsCommand(userId);

      await controller.create(userId);

      expect(commandBus.execute).toHaveBeenCalledWith(expectedCommand);
    });

    it('should return the result of commandBus.execute', async () => {
      const userId = '123';
      const expectedResult: UserEventsDto = {
        _id: userId,
        events: [
          {
            eventId: '789',
            userAnswers: ['1', '2', '3'],
            numCorrect: 2,
            quizComplete: true,
          },
        ],
      };
      jest.spyOn(commandBus, 'execute').mockResolvedValue(expectedResult);

      const result = await controller.create(userId);

      expect(result).toBe(expectedResult);
    });
  });

  describe('addEvent', () => {
    it('should call commandBus.execute with AddEventCommand', async () => {
      const userId = '123';
      const eventId = '456';
      const expectedCommand = new AddEventCommand(userId, eventId);

      await controller.addEvent(userId, eventId);

      expect(commandBus.execute).toHaveBeenCalledWith(expectedCommand);
    });

    it('should return the result of commandBus.execute', async () => {
      const userId = '123';
      const eventId = '456';
      const expectedResult: UserEventsDto = {
        _id: userId,
        events: [
          {
            eventId: '789',
            userAnswers: ['1', '2', '3'],
            numCorrect: 2,
            quizComplete: true,
          },
        ],
      };
      jest.spyOn(commandBus, 'execute').mockResolvedValue(expectedResult);

      const result = await controller.addEvent(userId, eventId);

      expect(result).toBe(expectedResult);
    });
  });

  describe('updateEvent', () => {
    it('should call commandBus.execute with UpdateEventCommand', async () => {
      const userId = '123';
      const updateEventRequest: UpdateEventRequest = {
        eventId: '456',
        userAnswers: ['1', '2', '3'],
        numCorrect: 2,
        quizComplete: true,
      };
      const expectedCommand = new UpdateEventCommand(userId, updateEventRequest);

      await controller.updateEvent(userId, updateEventRequest);

      expect(commandBus.execute).toHaveBeenCalledWith(expectedCommand);
    });

    it('should return the result of commandBus.execute', async () => {
      const userId = '123';
      const updateEventRequest: UpdateEventRequest = {
        eventId: '456',
        userAnswers: ['1', '2', '3'],
        numCorrect: 2,
        quizComplete: true,
      };
      const expectedResult: UserEventsDto = {
        _id: userId,
        events: [updateEventRequest],
      };
      jest.spyOn(commandBus, 'execute').mockResolvedValue(expectedResult);

      const result = await controller.updateEvent(userId, updateEventRequest);

      expect(result).toBe(expectedResult);
    });
  });

  describe('find', () => {
    it('should call queryBus.execute with GetUserEventsQuery', async () => {
      const userId = '123';
      const expectedQuery = new GetUserEventsQuery(userId);

      await controller.find(userId);

      expect(queryBus.execute).toHaveBeenCalledWith(expectedQuery);
    });

    it('should return the result of queryBus.execute', async () => {
      const userId = '123';
      const expectedResult: UserEventsDto = {
        _id: userId,
        events: [{
          eventId: '456',
          userAnswers: ['1', '2', '3'],
          numCorrect: 2,
          quizComplete: true,
        }],
      };
      jest.spyOn(queryBus, 'execute').mockResolvedValue(expectedResult);

      const result = await controller.find(userId);

      expect(result).toBe(expectedResult);
    });
  });
});