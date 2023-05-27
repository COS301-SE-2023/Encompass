import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { AccountCreatedEvent } from "./account-created.event";

@EventsHandler(AccountCreatedEvent)
export class AccountCreatedHandler implements IEventHandler<AccountCreatedEvent>{
  async handle({ accountId } : AccountCreatedEvent): Promise<void>{
    console.log("Account created event handled")
  }
}