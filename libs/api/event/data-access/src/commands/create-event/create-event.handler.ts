import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { CreateEventCommand } from './create-event.command';
import { EventFactory } from '../../event.factory';
import { HttpService } from '@nestjs/axios';

@CommandHandler(CreateEventCommand)
export class CreateEventHandler implements ICommandHandler<CreateEventCommand> {
  constructor(
    private readonly eventFactory: EventFactory,
    private readonly eventPublisher: EventPublisher,
    private readonly httpService: HttpService
  ) {}

  async execute({ createEventRequest }: CreateEventCommand) {
    const url = process.env['BASE_URL'];

    const {
      name,
      host,
      community,
      description,
      startDate,
      endDate,
      members,
      prompt,
      categories,
    } = createEventRequest;

    const event = this.eventPublisher.mergeObjectContext(
      await this.eventFactory.create(
        name,
        host,
        community,
        description,
        startDate,
        endDate,
        members,
        prompt,
        categories
      )
    );

    event.commit();

    try {
      this.httpService
        .patch(
          url + '/api/community/add-event/' + event.community + '/' + event._id
        )
        .toPromise();
    } catch (error) {
      console.log(error);
    }

    return event;
  }
}
