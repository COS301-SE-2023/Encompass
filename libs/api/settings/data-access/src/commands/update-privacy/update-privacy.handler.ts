import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { UpdatePrivacyCommand } from "./update-privacy.command";
import { SettingsEntityRepository } from "../../db/settings-entity.repository";
import { SettingsDto } from "../../settings.dto";

@CommandHandler(UpdatePrivacyCommand)
export class UpdatePrivacyHandler implements ICommandHandler<UpdatePrivacyCommand>{
  constructor(
    private readonly settingsEntityRepository: SettingsEntityRepository,
    private readonly eventPublisher: EventPublisher
  ){}

  async execute({userId, privacy}: UpdatePrivacyCommand): Promise<SettingsDto> {
    const settings = this.eventPublisher.mergeObjectContext(
      await this.settingsEntityRepository.findOneById(userId)
    )

    settings.updatePrivacy(privacy);
    this.settingsEntityRepository.findOneAndReplaceById(settings._id, settings);
    settings.commit();

    return settings;
  }
}