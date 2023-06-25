/*
FILENAME: account.schema.ts

AUTHOR: Sameet Keshav

CREATION DATE: 27 May 2023

DESCRIPTION: **
*/

import { Schema, Prop } from "@nestjs/mongoose";
import { IdentifiableEntitySchema } from "@encompass/api/database/data-access";

@Schema({ versionKey: false, collection: "account" })
export class AccountSchema extends IdentifiableEntitySchema {
  @Prop()
  readonly email!: string;

  @Prop()
  readonly password!: string;
}