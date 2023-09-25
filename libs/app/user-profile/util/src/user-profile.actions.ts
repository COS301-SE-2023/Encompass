import { UpdatePostRequest } from "@encompass/api/post/data-access"

export class GetUserProfile{
  static readonly type = '[User-Profile] Get User Profile'
  constructor(public readonly username: string){}
}

export class GetUserProfilePosts{
  static readonly type = '[User-Profile] Get User Profile Posts'
  constructor(public readonly username: string, public readonly userId: string){}
}

export class GetUserSettings{
  static readonly type = '[User-Profile] Get User Settings'
  constructor(public readonly userId: string){}
}

export class UpdateUserPost{
  static readonly type = '[User-Profile] Update Post'
  constructor(public readonly postId: string, public readonly updateRequest: UpdatePostRequest, public readonly username: string){}
}

export class UpdateUserProfilePost{
  static readonly type = '[User-Profile] Update Profile Post';
  constructor(public readonly postId: string, public readonly postUpdateRequest: UpdatePostRequest){}
}

export class LikeUserProfilePost{
  static readonly type = '[User-Profile] Like Profile Post';
  constructor(public readonly postId: string, public readonly userId: string){}
}

export class DislikeUserProfilePost{
  static readonly type = '[User-Profile] Dislike Profile Post';
  constructor(public readonly postId: string, public readonly userId: string){}
}