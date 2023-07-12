import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { CommunityRequestCreatedEvent } from "./create-community-request.event";

@EventsHandler(CommunityRequestCreatedEvent)
export class CommunityRequestCreatedHandler implements IEventHandler<CommunityRequestCreatedEvent>{
  async handle({communityId}: CommunityRequestCreatedEvent){
    console.log("CommunityRequestCreatedEvent handled");
  }
}