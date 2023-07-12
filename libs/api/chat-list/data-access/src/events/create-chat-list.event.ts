export class ChatListCreatedEvent {
  constructor(
    public readonly chatListId: string | null | undefined,
  ) {}
}