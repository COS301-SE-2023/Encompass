/*
FILENAME: account-dto.repository.ts

AUTHOR: Sameet Keshav

CREATION DATE: 27 May 2023

DESCRIPTION: **
*/

import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { AccountSchema } from "./account.schema";
import { Model } from "mongoose";
import { AccountDto } from "../account.dto";
import { Account } from "../account";

@Injectable()
export class AccountDtoRepository{
  constructor(
    @InjectModel(AccountSchema.name)
    private readonly accountModel: Model<AccountSchema>,
  ) {}

  async findAll(): Promise<AccountDto[]>{
    return await this.accountModel.find();
   
  }
}