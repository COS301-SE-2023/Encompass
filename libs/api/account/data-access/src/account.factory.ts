/*
FILENAME: account.factory.ts

AUTHOR: Sameet Keshav

CREATION DATE: 27 May 2023

DESCRIPTION: This file initiates the creation of an account.
*/

import { Injectable } from "@nestjs/common";
import { Account } from "./account";
import { EntityFactory } from "@encompass/api/database/data-access";
import { ObjectId } from "mongodb";
import { AccountCreatedEvent } from "./events";
import { AccountEntityRepository } from "./db/account-entity.repository";

@Injectable()
export class AccountFactory implements EntityFactory<Account>{
  constructor(
    private readonly accountEntityRepository: AccountEntityRepository,
  ){}

  async create(
    email: string,
    password: string,
  ) : Promise<Account>{
    const account = new Account(
      new ObjectId().toHexString(),
      email,
      password,
    );
    await this.accountEntityRepository.create(account);
    account.apply(new AccountCreatedEvent(account.getId()))
    return account;
  }
}