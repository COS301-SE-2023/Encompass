import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { EventCreatedEvent } from "./create-event.event";

@EventsHandler(EventCreatedEvent)
export class EventCreateHandler implements IEventHandler<EventCreatedEvent>{
  async handle({ eventId }: EventCreatedEvent): Promise<void>{
    console.log("Event created event handled")
  }
}