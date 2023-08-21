import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { AddEventCommand } from "./add-event.command";
import { UserEventsEntityRepository } from "../../db/user-events-entity.repository";

@CommandHandler(AddEventCommand)
export class AddEventHandler implements ICommandHandler<AddEventCommand>{
  constructor(
    private eventPublisher: EventPublisher,
    private userEventsEntityRepository: UserEventsEntityRepository
  ){}

  async execute({userId, eventId}: AddEventCommand) {
    const userEvents = this.eventPublisher.mergeObjectContext(
      await this.userEventsEntityRepository.findOneById(userId)
    )

    userEvents.addEvent(eventId);
    this.userEventsEntityRepository.findOneAndReplaceById(userId, userEvents);
    userEvents.commit();

    return userEvents;
  }
}