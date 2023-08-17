import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { AddEventCommand } from "./add-event.command";
import { ProfileEntityRepository } from "../../db/profile-entity.repository";

@CommandHandler(AddEventCommand)
export class AddEventHandler implements ICommandHandler<AddEventCommand>{
  constructor(
    private readonly eventPublisher: EventPublisher,
    private readonly profileEntityRepository: ProfileEntityRepository,
  ){}

  async execute({ username, eventId }: AddEventCommand){
    const profile = this.eventPublisher.mergeObjectContext(
      await this.profileEntityRepository.findOneByUsername(username)
    );

    profile.addEvent(eventId);
    this.profileEntityRepository.findOneAndReplaceById(profile._id, profile);
    profile.commit();

    return profile;
  }
}