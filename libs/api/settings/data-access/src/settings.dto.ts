import { NotificationsSettingsDto, PrivacySettingsDto, ProfileSettingsDto, ThemesSettingsDto } from "./dto";

export class SettingsDto{
  readonly profile!: ProfileSettingsDto 
  readonly notifications!: NotificationsSettingsDto
  readonly messagePermissions!: string
  readonly privacy!: PrivacySettingsDto
  readonly themes!: ThemesSettingsDto
}