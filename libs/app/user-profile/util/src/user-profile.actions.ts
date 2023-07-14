export class GetUserProfile{
  static readonly type = '[User-Profile] Get User Profile'
  constructor(public readonly username: string){}
}

export class GetUserProfilePosts{
  static readonly type = '[User-Profile] Get User Profile Posts'
  constructor(public readonly username: string){}
}