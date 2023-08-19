import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { UserEventsCreatedEvent } from "./create-user-events.event";

@EventsHandler(UserEventsCreatedEvent)
export class UserEventsCreatedHandler implements IEventHandler<UserEventsCreatedEvent>{
  async handle({userId}: UserEventsCreatedEvent){
    console.log("UserEventsCreatedEvent handled")
  }
}