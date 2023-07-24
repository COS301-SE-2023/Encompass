import { ChatListDto } from "@encompass/api/chat-list/data-access";
import { ChatDto, GateWayAddMessageRequest } from "@encompass/api/chat/data-access";
import { AddNotificationRequest } from "@encompass/api/notifications/data-access";

export class GetMessages {
  static readonly type = '[Messages] Get';
  constructor(public chatId: string) { }
}

export class SendMessage {
  static readonly type = '[Messages] Send';
  constructor(public addMessageRequest: GateWayAddMessageRequest) { }
}

export class SetMessages {
  static readonly type = '[Messages] Set';
  constructor(public messages: ChatDto) { }
}

export class GetChatList{
  static readonly type = '[Messages] Get Chat List'
  constructor(public username: string){}
}

export class GetUserInformation{
  static readonly type = '[Messages] Get User Information'
  constructor(public messageList: ChatListDto){}
}

export class GetNewChats{
  static readonly type = '[Messages] Get New Chats'
  constructor(public followingList: string[]){}
}

export class CreateChat{
  static readonly type = '[Messages] Create Chat'
  constructor(public usernames: string[]){}
}

export class SendingNotification{
  static readonly type = '[Messages] Sending Notification'
  constructor(public username: string, public notification: AddNotificationRequest){}
}