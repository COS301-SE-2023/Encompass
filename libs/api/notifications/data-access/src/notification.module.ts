import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { MongooseModule, SchemaFactory } from "@nestjs/mongoose";
import { NotificationController } from "./notification.controller";
import { NotificationEntityRepository } from "./db/notification-entity.repository";
import { NotificationDtoRepository } from "./db/notification-dto.repository";
import { NotificationSchemaFactory } from "./db/notification-schema.factory";
import { NotificationFactory } from "./notification.factory";
import { NotificationSchema } from "./db/notification.schema";
import { AddNotificationHandler, ClearNotificationsHandler, CreateNotificationHandler, RemoveNotificationHandler } from "./commands";
import { NotificationCreateHandler } from "./events";
import { GetNotificationHandler } from "./queries";

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      {
        name: NotificationSchema.name,
        schema: SchemaFactory.createForClass(NotificationSchema),
      }
    ])
  ],
  controllers: [NotificationController],
  providers:[
    NotificationEntityRepository,
    NotificationDtoRepository,
    NotificationSchemaFactory,
    NotificationFactory,
    CreateNotificationHandler,
    NotificationCreateHandler,
    AddNotificationHandler,
    RemoveNotificationHandler,
    GetNotificationHandler,
    ClearNotificationsHandler
  ]
})

export class NotificationModule{}