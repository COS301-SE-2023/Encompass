import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { SettingsController } from './settings.controller';
import { CreateSettingsCommand } from './commands/create-settings/create-settings.command';
import { GetSettingsQuery } from './queries/get-settings/get-settings.query';
import { UpdateProfileCommand } from './commands/update-profile/update-profile.command';
import { UpdateMessagePermissionsCommand } from './commands/update-message-permissions/update-message-permissions.command';
import { UpdateNotificationsCommand } from './commands/update-notifications/update-notifications.command';
import { UpdateThemesCommand } from './commands/update-themes/update-themes.command';
import { SettingsDto } from './settings.dto';
import { ProfileSettingsDto, ThemesSettingsDto, NotificationsSettingsDto } from './dto';
import { profile } from 'console';

describe('SettingsController', () => {
  let controller: SettingsController;
  let commandBus: CommandBus;
  let queryBus: QueryBus;
  const PROFILE: ProfileSettingsDto = {
    nsfw: false,
    followPermission: false,
    blocked: [],
  };
  const NOTIFICATIONS: NotificationsSettingsDto = {
    dms: false,
    follows: false,
    commentReplies: false,
    recomPosts: false,
    recomCC: false,
  };
    const THEMES: ThemesSettingsDto = {
        themeImage: '',
        themeColor: '',
    };
    const expectedResult: SettingsDto = {
        profile: PROFILE,
        notifications: NOTIFICATIONS,
        messagePermissions: '',
        themes: THEMES,
    };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SettingsController],
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

    controller = module.get<SettingsController>(SettingsController);
    commandBus = module.get<CommandBus>(CommandBus);
    queryBus = module.get<QueryBus>(QueryBus);
  });

  describe('createSettings', () => {
    it('should call commandBus.execute with CreateSettingsCommand', async () => {
      const userId = '123';
      
      jest.spyOn(commandBus, 'execute').mockResolvedValue(expectedResult);

      const result = await controller.createSettings(userId);

      expect(commandBus.execute).toHaveBeenCalledWith(
        new CreateSettingsCommand(userId),
      );
      expect(result).toBe(expectedResult);
    });
  });

  describe('getSettings', () => {
    it('should call queryBus.execute with GetSettingsQuery', async () => {
      const userId = '123';
      
      jest.spyOn(queryBus, 'execute').mockResolvedValue(expectedResult);

      const result = await controller.getSettings(userId);

      expect(queryBus.execute).toHaveBeenCalledWith(
        new GetSettingsQuery(userId),
      );
      expect(result).toBe(expectedResult);
    });
  });

  describe('updateProfile', () => {
    it('should call commandBus.execute with UpdateProfileCommand', async () => {
      const userId = '123';
      jest.spyOn(commandBus, 'execute').mockResolvedValue(expectedResult);

      const result = await controller.updateProfile(userId, PROFILE);

      expect(commandBus.execute).toHaveBeenCalledWith(
        new UpdateProfileCommand(userId, PROFILE),
      );
      expect(result).toBe(expectedResult);
    });
  });

  describe('updateMessage', () => {
    it('should call commandBus.execute with UpdateMessagePermissionsCommand', async () => {
      const userId = '123';
      const message = 'test';
      const expectedResult2: SettingsDto = {
        profile: PROFILE,
        messagePermissions: message,
        notifications: NOTIFICATIONS,
        themes: THEMES,
      };
      jest.spyOn(commandBus, 'execute').mockResolvedValue(expectedResult2);

      const result = await controller.updateMessage(userId, message);

      expect(commandBus.execute).toHaveBeenCalledWith(
        new UpdateMessagePermissionsCommand(userId, message),
      );
      expect(result).toBe(expectedResult2);
    });
  });

  describe('updateNotifications', () => {
    it('should call commandBus.execute with UpdateNotificationsCommand', async () => {
      const userId = '123';
      const notifications: NotificationsSettingsDto = {
        dms: true,
        follows: true,
        commentReplies: false,
        recomPosts: true,
        recomCC: true,
      };
      const expectedResult2: SettingsDto = {
        profile: PROFILE,
        messagePermissions: '',
        notifications: notifications,
        themes: THEMES,
      };
      jest.spyOn(commandBus, 'execute').mockResolvedValue(expectedResult2);

      const result = await controller.updateNotifications(userId, notifications);

      expect(commandBus.execute).toHaveBeenCalledWith(
        new UpdateNotificationsCommand(userId, notifications),
      );
      expect(result).toBe(expectedResult2);
    });
  });

  describe('updateThemes', () => {
    it('should call commandBus.execute with UpdateThemesCommand', async () => {
      const userId = '123';
      const themes: ThemesSettingsDto = {
        themeImage: 'test',
        themeColor: 'test',
      };
      const expectedResult2: SettingsDto = {
        profile: PROFILE,
        messagePermissions: '',
        notifications: NOTIFICATIONS,
        themes: themes,
      };
      jest.spyOn(commandBus, 'execute').mockResolvedValue(expectedResult2);

      const result = await controller.updateThemes(userId, themes);

      expect(commandBus.execute).toHaveBeenCalledWith(
        new UpdateThemesCommand(userId, themes),
      );
      expect(result).toBe(expectedResult2);
    });
  });
});