import { UpdatePostRequest } from "@encompass/api/post/data-access"

export class GetUserProfile{
  static readonly type = '[User-Profile] Get User Profile'
  constructor(public readonly username: string){}
}

export class GetUserProfilePosts{
  static readonly type = '[User-Profile] Get User Profile Posts'
  constructor(public readonly username: string){}
}

export class GetUserSettings{
  static readonly type = '[User-Profile] Get User Settings'
  constructor(public readonly userId: string){}
}

export class UpdateUserPost{
  static readonly type = '[User-Profile] Update Post'
  constructor(public readonly postId: string, public readonly updateRequest: UpdatePostRequest, public readonly username: string){}
}