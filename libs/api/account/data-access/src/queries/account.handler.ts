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