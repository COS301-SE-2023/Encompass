import { EntityFactory } from "@encompass/api/database/data-access";
import { Injectable } from "@nestjs/common";
import { Notification } from "./notification";
import { ObjectId } from "mongodb"
import { NotificationEntityRepository } from "./db/notification-entity.repository";
import { NotificationCreatedEvent } from "./events";

@Injectable()
export class NotificationFactory implements EntityFactory<Notification>{
  constructor(
    private readonly notificationEntityRepository: NotificationEntityRepository
  ){}

  async create(
    id: string
  ) : Promise<Notification>{
    const notifcation = new Notification(
      new ObjectId(id).toHexString(),
      []
    );

    await this.notificationEntityRepository.create(notifcation);
    notifcation.apply(new NotificationCreatedEvent(notifcation.getId()))
    return notifcation;
  }
}