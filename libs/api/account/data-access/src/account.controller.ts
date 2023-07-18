/*
FILENAME: account.controller.ts

AUTHOR: Sameet Keshav

CREATION DATE: 28 May 2023

DESCRIPTION: This file handles the the account creation queries and commands.
*/
import { Controller, Post, Body, Get, Param, Patch } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { CreateAccountCommand } from "./commands/create-account.command";
import { CreateAccountRequest } from "./dto/create-account-request.dto";
import { GetAccountRequest } from "./dto";
import * as bcrypt from 'bcrypt';
import { GetAccountCommand } from "./queries/account.command";
import { DoesExistQuery } from "./queries/does-exist/does-exist.query";
import { AccountDto } from "./account.dto";
import { GetByIdQuery } from "./queries/get-by-id/get-by-id.query";
import { UpdateEmailCommand } from "./commands/update-email/update-email.command";
import { UpdatePasswordCommand } from "./commands/update-password/update-password.command";
@Controller('account')
export class AccountController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async createAccount(
    @Body() createAccountRequest: CreateAccountRequest,
  ) {
    const saltOrRounds = 10;
    const password = await bcrypt.hash(createAccountRequest.password, saltOrRounds);

    const data : CreateAccountRequest = {
      email: createAccountRequest.email,
      password: password,
    }

    return await this.commandBus.execute<CreateAccountCommand, string>(
      new CreateAccountCommand(data),
    );
  }

  @Post('login')
  async getAccount(
    @Body() getAccountRequest: GetAccountRequest,
  ) : Promise<AccountDto>{

      return await this.commandBus.execute<GetAccountCommand, AccountDto>(
      new GetAccountCommand(getAccountRequest.email, getAccountRequest.password),
    );
  }

  @Get(':email')
  async getAccountById(
    @Param('email') email: string
  ){
    return await this.queryBus.execute<DoesExistQuery, boolean>(
      new DoesExistQuery(email),
    );
  }

  @Get('get/:id')
  async getAccountById2(
    @Param('id') id: string
  ){
    return await this.queryBus.execute<GetByIdQuery, AccountDto>(
      new GetByIdQuery(id),
    );
  }

  @Patch('update-email/:id')
  async updateEmail(
    @Param('id') id: string,
    @Body('email') email: string,
  ){
    return await this.commandBus.execute<UpdateEmailCommand, AccountDto>(
      new UpdateEmailCommand(id, email),
    );
  }

  @Patch('update-password/:id')
  async updatePassword(
    @Param('id') id: string,
    @Body('password') password: string,
  ){
    const saltOrRounds = 10;
    const newPassword = await bcrypt.hash(password, saltOrRounds);

    return await this.commandBus.execute<UpdatePasswordCommand, AccountDto>(
      new UpdatePasswordCommand(id, newPassword),
    );
  }
}