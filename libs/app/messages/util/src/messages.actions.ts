import { ChatListDto } from "@encompass/api/chat-list/data-access";
import { ChatDto, GateWayAddMessageRequest } from "@encompass/api/chat/data-access";

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