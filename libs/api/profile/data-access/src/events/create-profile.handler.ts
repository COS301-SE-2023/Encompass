import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { ProfileCreatedEvent } from "./create-profile.event";

@EventsHandler(ProfileCreatedEvent)
export class ProfileCreatedHandler implements IEventHandler<ProfileCreatedEvent>{
  async handle({ profileId }: ProfileCreatedEvent): Promise<void>{
    console.log("Profile created event handled")
  }
}