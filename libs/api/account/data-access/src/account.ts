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
    public email: string,
    public password: string,
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

  updateEmail(email: string){
    this.email = email;
  }

  updatePassword(password: string){
    this.password = password;
  }
}