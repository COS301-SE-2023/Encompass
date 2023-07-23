import { UpdateProfileRequest } from '@encompass/api/profile/data-access';
import { NotificationsSettingsDto, ProfileSettingsDto } from '@encompass/api/settings/data-access';

export class GetUserSettings{
  static readonly type = '[Settings] Get User Settings';
  constructor(public userId: string){}
}

export class UpdateProfileSettings{
  static readonly type = '[Settings] Update Profile Settings';
  constructor(public userId: string, public settings: ProfileSettingsDto){}
}

export class UpdateNotificationSettings{
  static readonly type = '[Settings] Update Notification Settings';
  constructor(public userId: string, public settings: NotificationsSettingsDto){}
}

export class UpdateMessageSettings{
  static readonly type = '[Settings] Update Message Settings';
  constructor(public userId: string, public settings: string){}
}

export class GetAccount{
  static readonly type = '[Settings] Get Account';
  constructor(public userId: string){}
}

export class UpdateEmail{
  static readonly type = '[Settings] Update Email';
  constructor(public userId: string, public email: string){}
}

export class UpdatePassword{
  static readonly type = '[Settings] Update Password';
  constructor(public userId: string, public password: string){}
}