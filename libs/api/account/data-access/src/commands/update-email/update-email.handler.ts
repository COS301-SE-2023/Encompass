import { CommandHandler, ICommandHandler, EventPublisher } from "@nestjs/cqrs";
import { UpdateEmailCommand } from "./update-email.command";
import { AccountEntityRepository } from '../../db/account-entity.repository';

@CommandHandler(UpdateEmailCommand)
export class UpdateEmailHandler implements ICommandHandler<UpdateEmailCommand>{
  constructor(
    private accountEntityRepository: AccountEntityRepository,
    private eventPublisher: EventPublisher,
  ){}

  async execute({userId, email}: UpdateEmailCommand){
    const account = this.eventPublisher.mergeObjectContext(
      await this.accountEntityRepository.findOneById(userId)
    );
    
    account.updateEmail(email);
    await this.accountEntityRepository.findOneAndReplaceById(account._id, account)
    account.commit();

    return account;
  }
}