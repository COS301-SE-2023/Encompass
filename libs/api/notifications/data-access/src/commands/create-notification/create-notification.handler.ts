import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { CreateNotificationCommand } from "./create-notification.command";
import { NotificationFactory } from "../../notification.factory";

@CommandHandler(CreateNotificationCommand)
export class CreateNotificationHandler implements ICommandHandler<CreateNotificationCommand>{
  constructor(
    private notificationFactory: NotificationFactory,
    private eventPublisher: EventPublisher
    ){}

    async execute({id}: CreateNotificationCommand): Promise<any> {
      const notification = this.eventPublisher.mergeObjectContext(
        await this.notificationFactory.create(
          id,
        )
      )
      
      notification.commit()
      return notification
    }
}