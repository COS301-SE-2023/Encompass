import { UpdateEventRequest } from "../../dto";

export class UpdateEventCommand{
  constructor(public readonly userId: string, public readonly updateEventRequest: UpdateEventRequest){}
}