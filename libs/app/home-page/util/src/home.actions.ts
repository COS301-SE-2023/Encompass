import { UpdatePostRequest } from "@encompass/api/post/data-access";

export class getHome{
  static readonly type = '[Home] Get Home';
}

export class GetLatestPosts{
  static readonly type = '[Home] Get Latest Posts';
}

export class GetPopularPosts{
  static readonly type = '[Home] Get Popular Posts';
}

export class GetAllPosts{
  static readonly type = '[Home] Get All Posts';
}

export class UpdatePost{
  static readonly type = '[Home] Update Post';
  constructor(public readonly postId: string, public readonly updateRequest: UpdatePostRequest){}
}

export class GetNotifications{
  static readonly type = '[Home] Get Notifications';
  constructor(public readonly userId: string){}
}

export class GetRecommendedCommunities{
  static readonly type = '[Home] Get Recommended Communities';
  constructor(public readonly userId: string){}
}

export class GetRecommendedMovies{
  static readonly type = '[Home] Get Recommended Movies';
  constructor(public readonly userId: string){}
}

export class GetRecommendedBooks{
  static readonly type = '[Home] Get Recommended Books';
  constructor(public readonly userId: string){}
}