import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { UpdateNotificationsCommand } from "./update-notifications.command";
import { SettingsEntityRepository } from "../../db/settings-entity.repository";
import { SettingsDto } from "../../settings.dto";

@CommandHandler(UpdateNotificationsCommand)
export class UpdateNotificationsHandler implements ICommandHandler<UpdateNotificationsCommand>{
  constructor(
    private readonly settingsEntityRepository: SettingsEntityRepository,
    private readonly eventPublisher: EventPublisher
  ){}

  async execute({userId, notifications}: UpdateNotificationsCommand): Promise<SettingsDto> {
    const settings = this.eventPublisher.mergeObjectContext(
      await this.settingsEntityRepository.findOneById(userId)
    )

    settings.updateNotifications(notifications)
    await this.settingsEntityRepository.findOneAndReplaceById(settings._id, settings)
    settings.commit();
    
    return settings
  }
}