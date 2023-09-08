export class EventCreatedEvent {
    constructor(
      public readonly eventId: string | null | undefined,
    ) {}
  }