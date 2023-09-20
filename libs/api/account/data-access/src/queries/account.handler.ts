/*
FILENAME: account.handler.ts

AUTHOR: Sameet Keshav

CREATION DATE: 27 May 2023

DESCRIPTION: This file ensures that an account login is valid.
*/

import { CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import { GetAccountCommand } from "./account.command"
import { AccountEntityRepository } from "../db/account-entity.repository";
import { EventPublisher } from "@nestjs/cqrs";
import * as bcrypt from "bcrypt";

@CommandHandler(GetAccountCommand)
export class GetAccountHandler implements ICommandHandler<GetAccountCommand>{
  constructor(
    private readonly accountEntityRepository: AccountEntityRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute({email, password}: GetAccountCommand)
  {
    email = email.toLowerCase();

    const account = this.eventPublisher.mergeObjectContext(
      await this.accountEntityRepository.findOneByEmail(email),
    );

    const isPasswordValid = await bcrypt.compare(password, account.getPassword());

    if(isPasswordValid){
      return account;
    }

    return null;
  } 
}