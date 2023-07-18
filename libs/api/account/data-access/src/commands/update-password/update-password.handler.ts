import { CommandHandler, ICommandHandler, EventPublisher } from "@nestjs/cqrs";
import { UpdatePasswordCommand } from "./update-password.command";
import { AccountEntityRepository } from '../../db/account-entity.repository';

@CommandHandler(UpdatePasswordCommand)
export class UpdatePasswordHandler implements ICommandHandler<UpdatePasswordCommand>{
  constructor(
    private accountEntityRepository: AccountEntityRepository,
    private eventPublisher: EventPublisher,
  ){}

  async execute({userId, password}: UpdatePasswordCommand){
    const account = this.eventPublisher.mergeObjectContext(
      await this.accountEntityRepository.findOneById(userId)
    );
    
    account.updatePassword(password);
    await this.accountEntityRepository.findOneAndReplaceById(account._id, account)
    account.commit();

    return account;
  }
}