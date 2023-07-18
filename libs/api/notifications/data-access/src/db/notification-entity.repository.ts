import { BaseEntityRepository } from "@encompass/api/database/data-access";
import { Injectable } from "@nestjs/common";
import { Notification } from "../notification";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { NotificationSchema } from "./notification.schema";
import { NotificationSchemaFactory } from "./notification-schema.factory";

@Injectable()
export class NotificationEntityRepository extends BaseEntityRepository<
  NotificationSchema,
  Notification
>{
  constructor(
    @InjectModel(NotificationSchema.name)
    notificationModel: Model<NotificationSchema>,
    notificationSchemaFactory: NotificationSchemaFactory
  ){
    super(notificationModel, notificationSchemaFactory)
  }
}