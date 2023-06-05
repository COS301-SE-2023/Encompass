import { ProfileDto } from '@encompass/api/profile/data-access'

export class SubscribeToProfile{
  static readonly type = '[Profile] SubscribeToProfile';
}

export class SetProfile{
  static readonly type = '[Profile] SetProfile';
  constructor(public profile: ProfileDto){}
}