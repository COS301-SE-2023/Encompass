export class AccountCreatedEvent{
  constructor(public readonly accountId: string | null | undefined){}
}