import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { AddNotificationCommand } from "./add-notification.command";
import { NotificationEntityRepository } from "../../db/notification-entity.repository";
import { EventPublisher } from "@nestjs/cqrs";

@CommandHandler(AddNotificationCommand)
export class AddNotificationHandler implements ICommandHandler<AddNotificationCommand>{
  constructor(
    private readonly notificationEntityRepository: NotificationEntityRepository,
    private readonly eventPublisher: EventPublisher
  ){}

  async execute({id, addNotificationRequest}: AddNotificationCommand){
    const notification = this.eventPublisher.mergeObjectContext(
      await this.notificationEntityRepository.findOneById(id)
    );

    notification.addNotification(addNotificationRequest);
    await this.notificationEntityRepository.findOneAndReplaceById(id, notification);
    notification.commit();

    return notification;
  }
}