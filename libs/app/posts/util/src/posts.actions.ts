import { CreatePostRequest, UpdatePostRequest } from "@encompass/api/post/data-access";
import { ProfileDto } from "@encompass/api/profile/data-access";

export class UpdatePost{
  static readonly type = '[Post] Update Post';
  constructor(public readonly postId: string, public readonly postUpdateRequest: UpdatePostRequest){}
}

export class DislikePost{
  static readonly type = '[Post] Dislike Post';
  constructor(public readonly postId: string, public readonly userId: string){}
}

export class LikePost{
  static readonly type = '[Post] Like Post';
  constructor(public readonly postId: string, public readonly userId: string){}
}

export class UpdatePostArray{
  static readonly type = '[Post] Update Post Array';
  constructor(public readonly postId: string, public readonly postUpdateRequest: UpdatePostRequest){}
}

export class LikePostArray{
  static readonly type = '[Post] Like Post Array';
  constructor(public readonly postId: string, public readonly userId: string){}
}

export class DislikePostArray{
  static readonly type = '[Post] Dislike Post Array';
  constructor(public readonly postId: string, public readonly userId: string){}
}

export class UpdateProfilePost{
  static readonly type = '[Post] Update Profile Post';
  constructor(public readonly postId: string, public readonly postUpdateRequest: UpdatePostRequest){}
}

// export class LikeProfilePost{
//   static readonly type = '[Post] Like Profile Post';
//   constructor(public readonly postId: string, public readonly userId: string){}
// }

// export class DislikeProfilePost{
//   static readonly type = '[Post] Dislike Profile Post';
//   constructor(public readonly postId: string, public readonly userId: string){}
// }

export class GetPost{
  static readonly type = '[Comments] Get Post';
  constructor(public readonly postId: string){}
}

// export class GetCommunityPosts{
//   static readonly type = '[Community] Get Community Posts';
//   constructor(public name: string){}
// }

export class GetUserPosts{
  static readonly type = '[Profile] GetUserPosts';
  constructor(public username: string, public userId: string){}
}

export class GetLatestPosts{
  static readonly type = '[Home] Get Latest Posts';
  constructor(public readonly username: string){}
}

export class GetPopularPosts{
  static readonly type = '[Home] Get Popular Posts';
  constructor(public readonly userId: string){}
}

export class GetAllPosts{
  static readonly type = '[Home] Get All Posts';
  constructor(public readonly username: string){}
}

export class CreatePost{
  static readonly type = '[Post] Create Post';
  constructor(public readonly createPostRequest: CreatePostRequest, public readonly profile: ProfileDto){}
}