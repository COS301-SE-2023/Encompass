import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { NotificationController } from './notification.controller';
import { CreateNotificationCommand } from './commands/create-notification/create-notification.command';
import { GetNotificationQuery } from './queries/get-notification/get-notification.query';
import { AddNotificationCommand } from './commands/add-notification/add-notification.command';
import { RemoveNotificationCommand } from './commands/remove-notification/remove-notification.command';
import { ClearNotificationsCommand } from './commands/clear-notifications/clear-notifications.command';

describe('NotificationController', () => {
  let controller: NotificationController;
  let commandBus: CommandBus;
  let queryBus: QueryBus;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationController],
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

    controller = module.get<NotificationController>(NotificationController);
    commandBus = module.get<CommandBus>(CommandBus);
    queryBus = module.get<QueryBus>(QueryBus);
  });

  describe('createNotification', () => {
    it('should call commandBus.execute with CreateNotificationCommand', async () => {
      const id = '123';
      const result = {};
      jest.spyOn(commandBus, 'execute').mockResolvedValue(result);

      const response = await controller.createNotification(id);

      expect(commandBus.execute).toHaveBeenCalledWith(
        new CreateNotificationCommand(id),
      );
      expect(response).toBe(result);
    });
  });

  describe('getNotification', () => {
    it('should call queryBus.execute with GetNotificationQuery', async () => {
      const id = '123';
      const result = {};
      jest.spyOn(queryBus, 'execute').mockResolvedValue(result);

      const response = await controller.getNotification(id);

      expect(queryBus.execute).toHaveBeenCalledWith(
        new GetNotificationQuery(id),
      );
      expect(response).toBe(result);
    });
  });

  describe('addNotification', () => {
    it('should call commandBus.execute with AddNotificationCommand', async () => {
      const id = '123';
      const addNotificationRequest = {
        sentBy: '456',
        picture: '789',
        title: 'title',
        description: 'description',
      }
      const result = {};
      jest.spyOn(commandBus, 'execute').mockResolvedValue(result);

      const response = await controller.addNotification(
        id,
        addNotificationRequest,
      );

      expect(commandBus.execute).toHaveBeenCalledWith(
        new AddNotificationCommand(id, addNotificationRequest),
      );
      expect(response).toBe(result);
    });
  });

  describe('removeNotification', () => {
    it('should call commandBus.execute with RemoveNotificationCommand', async () => {
      const id = '123';
      const notificationId = '456';
      const result = {};
      jest.spyOn(commandBus, 'execute').mockResolvedValue(result);

      const response = await controller.removeNotification(id, notificationId);

      expect(commandBus.execute).toHaveBeenCalledWith(
        new RemoveNotificationCommand(id, notificationId),
      );
      expect(response).toBe(result);
    });
  });

  describe('clearAllNotifications', () => {
    it('should call commandBus.execute with ClearNotificationsCommand', async () => {
      const id = '123';
      const result = {};
      jest.spyOn(commandBus, 'execute').mockResolvedValue(result);

      const response = await controller.clearAllNotifications(id);

      expect(commandBus.execute).toHaveBeenCalledWith(
        new ClearNotificationsCommand(id),
      );
      expect(response).toBe(result);
    });
  });
});