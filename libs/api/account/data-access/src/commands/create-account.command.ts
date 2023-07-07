/*
FILENAME: create-account.command.ts

AUTHOR: Sameet Keshav

CREATION DATE: 27 May 2023

DESCRIPTION: This file handles the create account command
*/

import { CreateAccountRequest } from "../dto/create-account-request.dto";

export class CreateAccountCommand{
  constructor(public readonly createAccountRequest: CreateAccountRequest){}
}