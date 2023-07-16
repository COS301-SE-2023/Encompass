import { AggregateRoot } from "@nestjs/cqrs";
import { AddNotificationRequest } from "./dto/add-notification-request.dto";
import { ObjectId } from "mongodb";

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
      dateTime: Date
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
      dateTime: Date
  }[]{
    return this.notifications
  }

  addNotification(newNotification: AddNotificationRequest){
    const adding = {
      notificationId: new ObjectId().toHexString(),
      sentBy: newNotification.sentBy,
      picture: newNotification.picture,
      title: newNotification.title,
      description: newNotification.description,
      routerUrl: newNotification.routerUrl,
      dateTime: new Date()
    }
    this.notifications = [...this.notifications, adding]
  }

  removeNotification(id: string){
    if(this.notifications)
      this.notifications = this.notifications.filter(notification => notification.notificationId !== id)
  }
}