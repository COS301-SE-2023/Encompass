import { EntitySchemaFactory } from "@encompass/api/database/data-access";
import { Injectable } from "@nestjs/common";
import { Notification } from "../notification";
import { ObjectId } from "mongodb"
import { NotificationSchema } from "./notification.schema";

@Injectable()
export class NotificationSchemaFactory
  implements EntitySchemaFactory<NotificationSchema, Notification>{
    create(notification: Notification): NotificationSchema {
      return{
        _id: new ObjectId(notification.getId()),
        notifications: notification.getNotifications()
      }
    }

    createFromSchema(entitySchema: NotificationSchema): Notification {
      return new Notification(
        entitySchema._id.toHexString(),
        entitySchema.notifications
      )
    }
  }