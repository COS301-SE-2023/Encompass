import { ObjectId } from "mongoose";

export class AccountDto{
  readonly _id?: ObjectId;
  readonly email?: string;
  readonly password?: string;
}