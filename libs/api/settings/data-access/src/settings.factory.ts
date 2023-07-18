import { EntityFactory } from "@encompass/api/database/data-access";
import { Injectable } from "@nestjs/common";
import { Settings } from "./settings";
import { SettingsEntityRepository } from "./db/settings-entity.repository";
import { NotificationsSettingsDto, PrivacySettingsDto, ProfileSettingsDto, ThemesSettingsDto } from "./dto";
import { ObjectId } from "mongodb";

@Injectable()
export class SettingsFactory implements EntityFactory<Settings>{
  constructor(
    private readonly settingsEntityRepository: SettingsEntityRepository,
  ){}

  async create(
    _id: string,
    profile: ProfileSettingsDto,
    notifications: NotificationsSettingsDto,
    messagePermissions: string,
    privacy: PrivacySettingsDto,
    themes: ThemesSettingsDto,
  ): Promise<Settings>{
    const settings = new Settings(
      new ObjectId(_id).toHexString(),
      profile,
      notifications,
      messagePermissions,
      privacy,
      themes,
    );
    await this.settingsEntityRepository.create(settings);
    return settings;
  }
}