import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { CommunityCreatedEvent } from "./community-created.event";

@EventsHandler(CommunityCreatedEvent)
export class CommunityCreatedHandler implements IEventHandler<CommunityCreatedEvent> {
    async handle({ communityId }: CommunityCreatedEvent) {
        console.log("Community created event handled");
    }
}