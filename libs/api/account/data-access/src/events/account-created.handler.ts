/*
FILENAME: account-created.handler.ts

AUTHOR: Sameet Keshav

CREATION DATE: 27 May 2023

DESCRIPTION: This file ensures that a new account is handled properly.
*/
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { AccountCreatedEvent } from "./account-created.event";

@EventsHandler(AccountCreatedEvent)
export class AccountCreatedHandler implements IEventHandler<AccountCreatedEvent>{
  async handle({ accountId } : AccountCreatedEvent): Promise<void>{
    console.log("Account created event handled")
  }
}