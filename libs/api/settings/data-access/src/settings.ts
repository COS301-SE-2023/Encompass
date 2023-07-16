import { AggregateRoot } from "@nestjs/cqrs";
import { NotificationsSettingsDto, PrivacySettingsDto, ProfileSettingsDto, ThemesSettingsDto } from "./dto";


export class Settings extends AggregateRoot{
  constructor(
    public readonly _id: string,
    public profile: ProfileSettingsDto,
    public notifications: NotificationsSettingsDto,
    public messagePermissions: string,
    public privacy: PrivacySettingsDto,
    public themes: ThemesSettingsDto,
  ){
    super();
  }

  getId(): string {
    return this._id;
  }

  getProfile(): ProfileSettingsDto {
    return this.profile;
  }

  getNotifications(): NotificationsSettingsDto {
    return this.notifications;
  }

  getMessagePermissions(): string {
    return this.messagePermissions;
  }

  getPrivacy(): PrivacySettingsDto {
    return this.privacy;
  }

  getThemes(): ThemesSettingsDto {
    return this.themes;
  }
}