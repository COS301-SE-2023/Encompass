import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { AccountSchema } from "./account.schema";
import { Model } from "mongoose";
import { AccountDto } from "../account.dto";

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