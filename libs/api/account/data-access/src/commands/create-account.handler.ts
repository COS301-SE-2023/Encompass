import { CommandHandler, ICommandHandler, EventPublisher } from "@nestjs/cqrs";
import { CreateAccountCommand } from "./create-account.command";
import { AccountFactory } from "../account.factory";

@CommandHandler(CreateAccountCommand)
export class CreateAccountHandler
  implements ICommandHandler<CreateAccountCommand>{
  constructor(
    private readonly accountFactory: AccountFactory,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute({ createAccountRequest }: CreateAccountCommand){
    const { email, password } = createAccountRequest;
    const account = this.eventPublisher.mergeObjectContext(
      await this.accountFactory.create(email, password),
    );
    account.commit();
  }
}
