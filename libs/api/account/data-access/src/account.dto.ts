import { ObjectId } from "mongoose";

export class AccountDto{
  readonly _id!: string | ObjectId | null | undefined;
  readonly email!: string;
  readonly password!: string;
}