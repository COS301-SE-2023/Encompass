import { CommandHandler, ICommandHandler, EventPublisher } from "@nestjs/cqrs";
import { UpdateProfileCommand } from "./update-profile.command";
import { SettingsEntityRepository } from "../../db/settings-entity.repository";
import { SettingsDto } from "../../settings.dto";

@CommandHandler(UpdateProfileCommand)
export class UpdateProfileHandler implements ICommandHandler<UpdateProfileCommand>{
  constructor(
    private readonly settingsEntityRepository: SettingsEntityRepository,
    private readonly eventPublisher: EventPublisher
  ){}

  async execute({userId, profile}: UpdateProfileCommand): Promise<SettingsDto> {
    const settings = this.eventPublisher.mergeObjectContext(
      await this.settingsEntityRepository.findOneById(userId)
    )

    settings.updateProfile(profile);
    this.settingsEntityRepository.findOneAndReplaceById(settings._id, settings);
    settings.commit();

    return settings;
  }
}