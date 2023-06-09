/*
FILENAME: account.ts

AUTHOR: Sameet Keshav

CREATION DATE: 27 May 2023

DESCRIPTION: This file defines the account object.
*/

import { AggregateRoot } from "@nestjs/cqrs";

export class Account extends AggregateRoot{
  constructor(
    public readonly _id: string ,
    public readonly email: string,
    public readonly password: string,
  ){
    super();
  }

  getId(): string {
    return this._id;
  }

  getEmail(): string {
    return this.email;
  }

  getPassword(): string{
    return this.password;
  }
}