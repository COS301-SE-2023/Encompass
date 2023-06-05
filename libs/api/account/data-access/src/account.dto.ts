import { ObjectId } from "mongoose";

export class AccountDto{
  readonly _id!: string;
  readonly email!: string;
  readonly password!: string;
}