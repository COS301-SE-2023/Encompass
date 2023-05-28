import { Injectable } from "@nestjs/common";
import { Account } from "../account";
import { AccountSchema } from "./account.schema";
import { EntitySchemaFactory } from "@encompass/api/database/data-access";
import { ObjectId } from "mongodb";

@Injectable()
export class AccountSchemaFactory
  implements EntitySchemaFactory<AccountSchema, Account> {
  create(account: Account): AccountSchema {
    return {
      _id: new ObjectId(account.getId()),
      email: account.getEmail(),
      password: account.getPassword(),
    };
  }

  createFromSchema(entitySchema: AccountSchema): Account{
    return new Account(
      entitySchema._id?.toHexString(),
      entitySchema.email,
      entitySchema.password
    );
  }
}