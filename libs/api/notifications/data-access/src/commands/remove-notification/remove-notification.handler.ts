import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { RemoveNotificationCommand } from "./remove-notification.command";
import { NotificationEntityRepository } from "../../db/notification-entity.repository";
import { EventPublisher } from "@nestjs/cqrs";

@CommandHandler(RemoveNotificationCommand)
export class RemoveNotificationHandler implements ICommandHandler<RemoveNotificationCommand>{
  constructor(
    private notificationEntityRepository: NotificationEntityRepository,
    private eventPublisher: EventPublisher
  ){}

  async execute({id, notificationId}: RemoveNotificationCommand){
    const notification = this.eventPublisher.mergeObjectContext(
      await this.notificationEntityRepository.findOneById(id)
    );

    notification.removeNotification(notificationId);
    await this.notificationEntityRepository.findOneAndReplaceById(id, notification);
    notification.commit();

    return notification;
  }
}