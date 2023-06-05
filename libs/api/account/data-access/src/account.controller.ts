import { Controller, Post, Body, Get, Param } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { CreateAccountCommand } from "./commands/create-account.command";
import { CreateAccountRequest } from "./dto/create-account-request.dto";
import { GetAccountRequest } from "./dto";
import * as bcrypt from 'bcrypt';
import { GetAccountCommand } from "./queries/account.command";
import { DoesExistQuery } from "./queries/does-exist/does-exist.query";
import { AccountDto } from "./account.dto";
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
}