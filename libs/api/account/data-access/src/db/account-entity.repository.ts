
/*
FILENAME: account-entity.repository.ts

AUTHOR: Sameet Keshav

CREATION DATE: 27 May 2023

DESCRIPTION: This file handles the create account command
*/import { BaseEntityRepository } from "@encompass/api/database/data-access";
import { Injectable } from "@nestjs/common";
import { AccountSchema } from "./account.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AccountSchemaFactory } from "./account-schema.factory";
import { Account } from "../account";

@Injectable()
export class AccountEntityRepository extends BaseEntityRepository<
AccountSchema,
Account
>{
  constructor(
    @InjectModel(AccountSchema.name)
    accountModel: Model<AccountSchema>,
    accountSchemaFactory: AccountSchemaFactory,
  ){
    super(accountModel, accountSchemaFactory);
  }
}