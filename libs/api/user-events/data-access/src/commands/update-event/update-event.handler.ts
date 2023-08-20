import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { UpdateEventCommand } from "./update-event.command";
import { UserEventsEntityRepository } from "../../db/user-events-entity.repository";

@CommandHandler(UpdateEventCommand)
export class UpdateEventHandler implements ICommandHandler<UpdateEventCommand>{
  constructor(
    private userEventsEntityRepository: UserEventsEntityRepository,
    private eventPublisher: EventPublisher
  ){}

  async execute({userId, updateEventRequest}: UpdateEventCommand) {
    const userEvent = this.eventPublisher.mergeObjectContext(
      await this.userEventsEntityRepository.findOneById(userId)
    )

    userEvent.updateEvent(updateEventRequest);
    this.userEventsEntityRepository.findOneAndReplaceById(userEvent._id, userEvent);
    userEvent.commit();

    return userEvent;
  }
}