import { AddReplyRequest, CreateCommentRequest } from "@encompass/api/comment/data-access";
import { AddNotificationRequest } from "@encompass/api/notifications/data-access";
import { UpdatePostRequest } from "@encompass/api/post/data-access";

export class GetComments{
  static readonly type = '[Comments] Get Comments';
  constructor(public readonly postId: string){}
}

export class AddComment{
  static readonly type = '[Comments] Add Comment';
  constructor(public readonly comment: CreateCommentRequest){}
}

export class AddReply{
  static readonly type = '[Comments] Add Reply';
  constructor(public readonly comment: AddReplyRequest, public readonly commentId: string){}
}

// export class GetPost{
//   static readonly type = '[Comments] Get Post';
//   constructor(public readonly postId: string){}
// }

// export class UpdatePost{
//   static readonly type = '[Comments] Update Post';
//   constructor(public readonly postId: string, public readonly postUpdateRequest: UpdatePostRequest){}
// }

export class SendNotification{
  static readonly type = '[Messages] Send Notification'
  constructor(public username: string, public notification: AddNotificationRequest){}
}