import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { ProfileEntityRepository } from '../../db/profile-entity.repository'
import { EventPublisher } from '@nestjs/cqrs'
import { RemoveAwardCommand } from './remove-award.command'

@CommandHandler(RemoveAwardCommand)
export class RemoveAwardHandler implements ICommandHandler<RemoveAwardCommand> {
  constructor(
    private readonly profileEntityRepository: ProfileEntityRepository,
    private readonly eventPublisher: EventPublisher
  ){}

  async execute({ username, award }: RemoveAwardCommand){
    const profile = this.eventPublisher.mergeObjectContext(
      await this.profileEntityRepository.findOneByUsername(username)
    );

    profile.removeAward(award);

    this.profileEntityRepository.findOneAndReplaceById(profile._id, profile);
    profile.commit();

    return profile; 
  }
}
