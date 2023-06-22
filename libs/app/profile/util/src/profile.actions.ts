import { ProfileDto, UpdateProfileRequest } from '@encompass/api/profile/data-access'

export class SubscribeToProfile{
  static readonly type = '[Profile] SubscribeToProfile';
}

export class SetProfile{
  static readonly type = '[Profile] SetProfile';
  constructor(public profile: ProfileDto){}
}

export class UpdateProfile{
  static readonly type = '[Profile] UpdateProfile';
  constructor(public updateProfileRequest: UpdateProfileRequest, public userId: string){}
}