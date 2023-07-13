import { AggregateRoot } from "@nestjs/cqrs";

export class Notification extends AggregateRoot{
  constructor(
    public readonly _id: string,
    public readonly notifications: {
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
}