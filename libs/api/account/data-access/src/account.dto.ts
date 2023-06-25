/*
FILENAME: account.dto.ts

AUTHOR: Sameet Keshav

CREATION DATE: 29 May 2023

DESCRIPTION: This file exports an account details as an object.
*/

import { ObjectId } from "mongoose";

export class AccountDto{
  readonly _id!: string;
  readonly email!: string;
  readonly password!: string;
}