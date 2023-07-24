export class ChatCreatedEvent {
  constructor(public readonly chatId: string | null | undefined) {}
}