export class GetMessages {
  static readonly type = '[Messages] Get';
  constructor(public chatId: string) { }
}