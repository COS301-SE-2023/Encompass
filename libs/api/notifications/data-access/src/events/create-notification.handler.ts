import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { NotificationCreatedEvent } from "./create-notification.event";

@EventsHandler(NotificationCreatedEvent)
export class NotificationCreateHandler implements IEventHandler<NotificationCreatedEvent>{
  async handle({notificationId}: NotificationCreatedEvent) {
    console.log("Notification creatd event handled")
  }
}