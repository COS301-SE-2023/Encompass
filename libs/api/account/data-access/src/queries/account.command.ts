/*
FILENAME: account.command.ts

AUTHOR: Sameet Keshav

CREATION DATE: 27 May 2023

DESCRIPTION: This file fetches the email and password of an account.
*/

export class GetAccountCommand{
  constructor(
    public readonly email: string,
    public readonly password: string
    ){}
}