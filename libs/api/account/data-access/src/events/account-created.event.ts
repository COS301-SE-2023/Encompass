/*
FILENAME: account-created.event.ts

AUTHOR: Sameet Keshav

CREATION DATE: 27 May 2023

DESCRIPTION: This file calls the account create function.
*/

export class AccountCreatedEvent{
  constructor(public readonly accountId: string | null | undefined){}
}