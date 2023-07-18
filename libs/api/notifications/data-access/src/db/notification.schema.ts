import { IdentifiableEntitySchema } from "@encompass/api/database/data-access";
import { Schema, Prop } from "@nestjs/mongoose";

@Schema({versionKey: false, collection: "notification"})
export class NotificationSchema extends IdentifiableEntitySchema{
  @Prop()
  readonly notifications!:{
    notificationId: string,
    sentBy: string,
    picture: string,
    title: string,
    description: string,
    routerUrl: string,
    dateTime: Date
  }[]
}