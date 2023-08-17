import { UpdatePostRequest } from "@encompass/api/post/data-access";

export class UpdatePost{
  static readonly type = '[Comments] Update Post';
  constructor(public readonly postId: string, public readonly postUpdateRequest: UpdatePostRequest){}
}

export class UpdatePostArray{
  static readonly type = '[Comments] Update Post Array';
  constructor(public readonly postId: string, public readonly postUpdateRequest: UpdatePostRequest){}
}

export class UpdateProfilePost{
  static readonly type = '[Post] Update Profile Post';
  constructor(public readonly postId: string, public readonly postUpdateRequest: UpdatePostRequest){}
}

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
  constructor(public username: string){}
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