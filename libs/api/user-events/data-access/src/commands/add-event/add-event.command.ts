export class AddEventCommand{
  constructor(
    public readonly userId: string,
    public readonly eventId: string
  ){}
}