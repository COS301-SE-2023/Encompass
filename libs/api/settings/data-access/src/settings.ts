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

  updateNotifications(notifications: NotificationsSettingsDto){
    this.notifications = notifications;
  }

  updateProfile(profile: ProfileSettingsDto){
    this.profile = profile
  }

  updatePrivacy(privacy: PrivacySettingsDto){
    this.privacy = privacy
  }

  updateMessagePermissions(messagePermissions: string){
    this.messagePermissions = messagePermissions
  }

  updateThemes(themes: ThemesSettingsDto){
    this.themes = themes
  }
}