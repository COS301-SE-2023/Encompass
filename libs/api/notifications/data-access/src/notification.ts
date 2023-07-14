import { AggregateRoot } from "@nestjs/cqrs";
import { AddNotificationRequest } from "./dto/add-notification-request.dto";

export class Notification extends AggregateRoot{
  constructor(
    public readonly _id: string,
    public notifications: {
      notificationId: string,
      sentBy: string,
      picture: string,
      title: string,
      description: string,
      routerUrl: string,
      dateTime: string
    }[]
  ){
    super();
  }

  getId(): string{
    return this._id
  }

  getNotifications(): {
    notificationId: string,
      sentBy: string,
      picture: string,
      title: string,
      description: string,
      routerUrl: string,
      dateTime: string
  }[]{
    return this.notifications
  }

  addNotification(newNotification: AddNotificationRequest){
    this.notifications = [...this.notifications, newNotification]
  }

  removeNotification(id: string){
    if(this.notifications)
      this.notifications = this.notifications.filter(notification => notification.notificationId !== id)
  }
}