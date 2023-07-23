import { AggregateRoot } from "@nestjs/cqrs";
import { NotificationsSettingsDto, ProfileSettingsDto, ThemesSettingsDto } from "./dto";


export class Settings extends AggregateRoot{
  constructor(
    public readonly _id: string,
    public profile: ProfileSettingsDto,
    public notifications: NotificationsSettingsDto,
    public messagePermissions: string,
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

  getThemes(): ThemesSettingsDto {
    return this.themes;
  }

  updateNotifications(notifications: NotificationsSettingsDto){
    this.notifications = notifications;
  }

  updateProfile(profile: ProfileSettingsDto){
    this.profile = profile
  }

  updateMessagePermissions(messagePermissions: string){
    this.messagePermissions = messagePermissions
  }

  updateThemes(themes: ThemesSettingsDto){
    this.themes = themes
  }
}