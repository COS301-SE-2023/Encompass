import { CommandHandler, ICommandHandler, EventPublisher } from "@nestjs/cqrs";
import { UpdateMessagePermissionsCommand } from "./update-message-permissions.command";
import { SettingsEntityRepository } from "../../db/settings-entity.repository";
import { SettingsDto } from "../../settings.dto";

@CommandHandler(UpdateMessagePermissionsCommand)
export class UpdateMessagePermissionsHandler implements ICommandHandler<UpdateMessagePermissionsCommand>{
  constructor(
    private readonly settingsEntityRepository: SettingsEntityRepository,
    private readonly eventPublisher: EventPublisher
  ){}

  async execute({userId, messagePermissions}: UpdateMessagePermissionsCommand): Promise<SettingsDto> {
    const settings = this.eventPublisher.mergeObjectContext(
      await this.settingsEntityRepository.findOneById(userId)
    )

    settings.updateMessagePermissions(messagePermissions);
    this.settingsEntityRepository.findOneAndReplaceById(settings._id, settings);
    settings.commit();

    return settings;
  }
}