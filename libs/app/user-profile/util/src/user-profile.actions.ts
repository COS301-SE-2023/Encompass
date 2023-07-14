export class GetUserProfile{
  static readonly type = '[User-Profile] Get User Profile'
  constructor(public readonly username: string){}
}