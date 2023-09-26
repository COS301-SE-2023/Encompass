import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { AddUserCommand } from "./add-user.command";
import { EventEntityRepository } from "../../db/event-entity.repository";
import { EventDto } from "../../event.dto";

@CommandHandler(AddUserCommand)
export class AddUserHandler implements ICommandHandler<AddUserCommand>{
  constructor(
    private eventPublisher: EventPublisher,
    private readonly eventEntityRepository: EventEntityRepository,
  ){}

  async execute({username, eventId}: AddUserCommand) {
    const event = this.eventPublisher.mergeObjectContext(
      await this.eventEntityRepository.findOneById(eventId),
    );

    event.addUser(username);
    event.commit();
    this.eventEntityRepository.findOneAndReplaceById(eventId, event);

    return event;
  }
}