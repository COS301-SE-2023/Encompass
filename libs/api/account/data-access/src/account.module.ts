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
import { CreateAccountHandler } from "./commands";
import { AccountCreatedHandler } from "./events";

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
  ],
})

export class AccountModule{}