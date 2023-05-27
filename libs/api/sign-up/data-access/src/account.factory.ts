import { Injectable } from "@nestjs/common";
import { EntityFactory } from "@encompass/api/database/data-access";
import { ObjectId } from "mongodb";
import { Account } from "./Account";

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