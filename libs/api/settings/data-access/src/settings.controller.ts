import { Body, Controller, Get, Param, Post, Patch } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { CreateSettingsCommand } from "./commands/create-settings/create-settings.command";
import { GetSettingsQuery } from "./queries/get-settings/get-settings.query";
import { SettingsDto } from "./settings.dto";
import { NotificationsSettingsDto, ProfileSettingsDto, ThemesSettingsDto } from "./dto";
import { UpdateProfileCommand } from "./commands/update-profile/update-profile.command";
import { UpdateMessagePermissionsCommand } from "./commands/update-message-permissions/update-message-permissions.command";
import { UpdateNotificationsCommand } from "./commands/update-notifications/update-notifications.command";
import { UpdateThemesCommand } from "./commands/update-themes/update-themes.command";

@Controller('settings')
export class SettingsController{
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ){}

  @Post('create/:userId')
  async createSettings(
    @Param('userId') userId: string
  ){
    return await this.commandBus.execute<CreateSettingsCommand, SettingsDto>(
      new CreateSettingsCommand(userId)
    );
  }

  @Get('get/:userId')
  async getSettings(
    @Param('userId') userId: string
  ){
    return await this.queryBus.execute<GetSettingsQuery, SettingsDto>(
      new GetSettingsQuery(userId)
    )
  }

  @Patch('/update-profile/:userId')
  async updateProfile(
    @Param('userId') userId: string,
    @Body() profile: ProfileSettingsDto
  ){
    return await this.commandBus.execute<UpdateProfileCommand, SettingsDto>(
      new UpdateProfileCommand(userId, profile)
    )
  }

  @Patch('/update-message/:userId')
  async updateMessage(
    @Param('userId') userId: string,
    @Body('messagePermissions') message: string
  ){
    return await this.commandBus.execute<UpdateMessagePermissionsCommand, SettingsDto>(
      new UpdateMessagePermissionsCommand(userId, message)
    )
  }

  @Patch('/update-notifications/:userId')
  async updateNotifications(
    @Param('userId') userId: string,
    @Body() notifications: NotificationsSettingsDto
  ){
    return await this.commandBus.execute<UpdateNotificationsCommand, SettingsDto>(
      new UpdateNotificationsCommand(userId, notifications)
    )
  }

  @Patch('/update-themes/:userId')
  async updateThemes(
    @Param('userId') userId: string,
    @Body() themes: ThemesSettingsDto
  ){
    return await this.commandBus.execute<UpdateThemesCommand, SettingsDto>(
      new UpdateThemesCommand(userId, themes)
    )
  }
}