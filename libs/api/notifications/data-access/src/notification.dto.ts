export class NotificationDto{
  readonly _id!: string;
  readonly notification!:{
    notificationId: string,
    sentBy: string,
    picture: string,
    title: string,
    description: string,
    routerUrl: string,
    dateTime: string
  }
}