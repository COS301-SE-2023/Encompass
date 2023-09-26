import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { CreateUserEventsCommand } from "./create-user-events.command";
import { UserEventsFactory } from "../../user-events.factory";

@CommandHandler(CreateUserEventsCommand)
export class CreateUserEventsHandler implements ICommandHandler<CreateUserEventsCommand>{
  constructor(
    private readonly userEventsFactory: UserEventsFactory,
    private readonly eventPublisher: EventPublisher
  ){}

  async execute({userId}: CreateUserEventsCommand){
    const userEvents = this.eventPublisher.mergeObjectContext(
      await this.userEventsFactory.create(userId)
    )

    userEvents.commit()
    return userEvents
  }
}