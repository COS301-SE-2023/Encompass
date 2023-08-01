import { AddNotificationRequest } from "@encompass/api/notifications/data-access";
import { UpdatePostRequest } from "@encompass/api/post/data-access";

export class getHome{
  static readonly type = '[Home] Get Home';
}

export class GetLatestPosts{
  static readonly type = '[Home] Get Latest Posts';
  constructor(public readonly username: string){}
}

export class GetPopularPosts{
  static readonly type = '[Home] Get Popular Posts';
}

export class GetAllPosts{
  static readonly type = '[Home] Get All Posts';
  constructor(public readonly username: string){}
}

export class UpdatePost{
  static readonly type = '[Home] Update Post';
  constructor(public readonly postId: string, public readonly updateRequest: UpdatePostRequest){}
}

export class UpdatePostWithType{
  static readonly type = '[Home] Update Post';
  constructor(public readonly postId: string, public readonly updateRequest: UpdatePostRequest, public readonly type: string, public readonly username: string){}
}

export class GetNotifications{
  static readonly type = '[Home] Get Notifications';
  constructor(public readonly userId: string){}
}

export class SendNotification{
  static readonly type = '[Home] Send Notifications'
  constructor(public readonly userId: string, public readonly notification: AddNotificationRequest){}
}

export class ClearNotification{
  static readonly type = '[Home] Clear Notifications'
  constructor(public readonly userId: string, public readonly id : string){}
}

export class ClearAllNotifications{
  static readonly type = '[Home] Clear All Notifications'
  constructor(public readonly userId: string){}
}

export class GetRecommendedCommunities{
  static readonly type = '[Home] Get Recommended Communities';
  constructor(public readonly userId: string, public readonly username: string){}
}

export class GetRecommendedMovies{
  static readonly type = '[Home] Get Recommended Movies';
  constructor(public readonly userId: string){}
}

export class GetRecommendedBooks{
  static readonly type = '[Home] Get Recommended Books';
  constructor(public readonly userId: string){}
}