import { Controller, Post, Body } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { CreateAccountCommand } from "./commands/create-account.command";
import { CreateAccountRequest } from "./dto/create-account-request.dto";

@Controller('account')
export class SignUpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async createAccount(
    @Body() createAccountRequest: CreateAccountRequest,
  ) {
    await this.commandBus.execute<CreateAccountCommand, void>(
      new CreateAccountCommand(createAccountRequest),
    );
  }
}