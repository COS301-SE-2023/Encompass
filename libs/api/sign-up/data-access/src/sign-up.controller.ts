import { Controller, Post } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";


@Controller('signup')
export class SignUpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}
  @Post()
  async createAccount(
    @Body() signupRequest: SignUpRequest,
  ) {
    await this.commandBus.execute<CreateAccountCommand, void>(
      new CreateNewAccountCommand(this.createAccountRequest),
    );
  }
}