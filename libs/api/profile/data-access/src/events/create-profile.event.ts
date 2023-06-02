export class ProfileCreatedEvent{
  constructor(public readonly profileId: string | null | undefined){}
}
