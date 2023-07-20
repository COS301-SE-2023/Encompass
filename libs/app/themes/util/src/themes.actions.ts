import { ThemesSettingsDto } from "@encompass/api/settings/data-access";

export class GetUserSettings{
  static readonly type = '[Themes] Get User Settings';
  constructor(public readonly userId: string){}
}

export class UpdateThemes{
  static readonly type = '[Themes] Update Themes';
  constructor(public readonly userId: string, public readonly settings: ThemesSettingsDto){}
}