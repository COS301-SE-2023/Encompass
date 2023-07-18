import { CommandHandler, ICommandHandler, EventPublisher } from "@nestjs/cqrs";
import { UpdateThemesCommand } from "./update-themes.command";
import { SettingsEntityRepository } from "../../db/settings-entity.repository";
import { SettingsDto } from "../../settings.dto";

@CommandHandler(UpdateThemesCommand)
export class UpdateThemesHandler implements ICommandHandler<UpdateThemesCommand>{
  constructor(
    private readonly settingsEntityRepository: SettingsEntityRepository,
    private readonly eventPublisher: EventPublisher
  ){}

  async execute({userId, themes}: UpdateThemesCommand): Promise<SettingsDto> {
    const settings = this.eventPublisher.mergeObjectContext(
      await this.settingsEntityRepository.findOneById(userId)
    )

    settings.updateThemes(themes);
    this.settingsEntityRepository.findOneAndReplaceById(settings._id, settings);
    settings.commit();

    return settings;
  }
}