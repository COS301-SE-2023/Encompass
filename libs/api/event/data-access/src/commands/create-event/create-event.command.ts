import { CreateEventRequest } from '../../dto/create-event-request.dto';

export class CreateEventCommand {
    constructor(public readonly createEventRequest: CreateEventRequest) {}
}