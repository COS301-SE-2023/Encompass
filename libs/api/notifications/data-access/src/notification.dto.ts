export class NotificationDto{
  readonly _id!: string;
  readonly notifications!:{
    notificationId: string,
    sentBy: string,
    picture: string,
    title: string,
    description: string,
    dateTime: Date
  }[]
}