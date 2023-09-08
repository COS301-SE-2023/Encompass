import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { UpdateProfileCommand } from './update-profile.command';
import { ProfileEntityRepository } from '../../db/profile-entity.repository';

@CommandHandler(UpdateProfileCommand)
export class UpdateProfileHandler
  implements ICommandHandler<UpdateProfileCommand> {
    constructor(
      private readonly profileEntityRepository: ProfileEntityRepository,
      private readonly eventPublisher: EventPublisher,
    ){}

    async execute({ id, updateProfileRequest }: UpdateProfileCommand){
      const profile = this.eventPublisher.mergeObjectContext(
        await this.profileEntityRepository.findOneById(id),
      );

      profile.updateProfile(updateProfileRequest);

      if(profile.bio !== null && profile.profileBanner !== null && profile.profileImage !== null ){
        profile.addAward('profileComplete')
      }

      await this.profileEntityRepository.findOneAndReplaceById(id, profile);
      profile.commit();

      return profile;
    }
  }