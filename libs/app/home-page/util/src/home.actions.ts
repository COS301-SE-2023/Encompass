import { AddNotificationRequest } from "@encompass/api/notifications/data-access";
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
  constructor(public readonly userId: string){}
}

export class UpdatePost{
  static readonly type = '[Home] Update Post';
  constructor(public readonly postId: string, public readonly updateRequest: UpdatePostRequest){}
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