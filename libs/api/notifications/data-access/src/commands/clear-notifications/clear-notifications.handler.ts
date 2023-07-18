import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { ClearNotificationsCommand } from "./clear-notifications.command";
import { NotificationEntityRepository } from "../../db/notification-entity.repository";

@CommandHandler(ClearNotificationsCommand)
export class ClearNotificationsHandler implements ICommandHandler<ClearNotificationsCommand>{
  constructor(
    private readonly notificationsEntityRepository: NotificationEntityRepository,
    private readonly eventPublisher: EventPublisher
  ){}

  async execute({userId}: ClearNotificationsCommand): Promise<any> {
    const notification = this.eventPublisher.mergeObjectContext(
      await this.notificationsEntityRepository.findOneById(userId)
    )

    notification.clearNotifications()
    this.notificationsEntityRepository.findOneAndReplaceById(notification._id, notification);
    notification.commit()

    return notification
  }
}