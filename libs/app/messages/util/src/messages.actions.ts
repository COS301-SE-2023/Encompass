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