import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { AddEventCommand } from "./add-event.command";
import { CommunityEntityRepository } from "../../db/community-entity.repository";

@CommandHandler(AddEventCommand)
export class AddEventHandler implements ICommandHandler<AddEventCommand>{
  constructor(
    private readonly eventPublisher: EventPublisher,
    private readonly communityEntityRepository: CommunityEntityRepository,
  ){}

  async execute({ communityName, eventId }: AddEventCommand){
    const community = await this.communityEntityRepository.findOneByName(communityName);

    community.addEvent(eventId);
    this.communityEntityRepository.findOneAndReplaceById(community._id, community);
    community.commit();

    return community;
  }
}