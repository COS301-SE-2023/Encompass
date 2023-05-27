import { ObjectId } from "mongoose";

export class AccountDto{
  readonly _id: ObjectId | undefined;
  readonly email: string | undefined;
  readonly password: string | undefined;
}