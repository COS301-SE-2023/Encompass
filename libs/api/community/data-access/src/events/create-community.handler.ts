import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { CommunityCreatedEvent } from "./create-community.event";

@EventsHandler(CommunityCreatedEvent)
export class CommunityCreatedHandler implements IEventHandler<CommunityCreatedEvent> {
    async handle({ communityId }: CommunityCreatedEvent): Promise<void> {
        console.log("CommunityCreatedEvent handled");
    } 
}