/*
FILENAME: account.module.ts

AUTHOR: Sameet Keshav

CREATION DATE: 28 May 2023

DESCRIPTION: This file completes the process of account creation.
*/

import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { AccountSchema } from "./db/account.schema";
import { SchemaFactory } from "@nestjs/mongoose";
import { MongooseModule } from "@nestjs/mongoose";
import { AccountController } from "./account.controller";
import { AccountEntityRepository } from "./db/account-entity.repository";
import { AccountDtoRepository } from "./db/account-dto.repository";
import { AccountSchemaFactory } from "./db/account-schema.factory";
import { AccountFactory } from "./account.factory";
import { CreateAccountHandler, UpdateEmailHandler, UpdatePasswordHandler } from "./commands";
import { AccountCreatedHandler } from "./events";
import { DoesExistHandler, GetAccountHandler, GetByIdHandler } from "./queries";

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      {
        name: AccountSchema.name,
        schema: SchemaFactory.createForClass(AccountSchema),
      },
    ]),
  ],

  controllers: [AccountController],
  providers: [
    AccountEntityRepository,
    AccountDtoRepository,
    AccountSchemaFactory,
    AccountFactory,
    CreateAccountHandler,
    AccountCreatedHandler,
    GetAccountHandler,
    DoesExistHandler,
    UpdateEmailHandler,
    UpdatePasswordHandler,
    GetByIdHandler
  ],
})

export class AccountModule{}