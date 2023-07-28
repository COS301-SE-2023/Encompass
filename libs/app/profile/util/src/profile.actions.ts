import { ProfileDto, UpdateProfileRequest } from '@encompass/api/profile/data-access'
import { UpdatePostRequest } from "@encompass/api/post/data-access";

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

export class GetPosts{
  static readonly type = '[Profile] GetPosts';
  constructor(public username: string){}
}

export class UpdatePost{
  static readonly type = '[Profile] Update Post';
  constructor(public readonly postId: string, public readonly updateRequest: UpdatePostRequest){}
}

export class GetComments{
  static readonly type = '[Profile] GetComments';
  constructor(public readonly username: string){}
}

export class DeletePost{
  static readonly type = '[Profile] Delete Post';
  constructor(public readonly postId: string){}
}

export class DeleteComment{
  static readonly type = '[Profile] Delete Comment';
  constructor(public readonly commentId: string){}
}

export class DeleteCommunity{
  static readonly type = '[Profile] Delete Community';
  constructor(public readonly communityName: string){}
}

export class AddFollowing{
  static readonly type = '[Profile] Add Following';
  constructor(public readonly username: string, public readonly followingUsername: string){}
}

export class RemoveFollowing{
  static readonly type = '[Profile] Remove Following';
  constructor(public readonly username: string, public readonly followingUsername: string){}
}

export class GetFollowers{
  static readonly type = '[Profile] Get Followers';
  constructor(public readonly followerList: string[]){}
}

export class GetFollowing{
  static readonly type = '[Profile] Get Following';
  constructor(public readonly followingList: string[]){}
}

export class RemoveCommunity{
  static readonly type = '[Profile] Remove Community';
  constructor(public readonly communityName: string, public readonly username: string){}
}

export class AddCommunity{
  static readonly type = '[Profile] Add Community';
  constructor(public readonly communityName: string, public readonly username: string){}
}