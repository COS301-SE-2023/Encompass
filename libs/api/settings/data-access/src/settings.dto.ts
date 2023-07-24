import { NotificationsSettingsDto, ProfileSettingsDto, ThemesSettingsDto } from "./dto";

export class SettingsDto{
  readonly profile!: ProfileSettingsDto 
  readonly notifications!: NotificationsSettingsDto
  readonly messagePermissions!: string
  readonly themes!: ThemesSettingsDto
}