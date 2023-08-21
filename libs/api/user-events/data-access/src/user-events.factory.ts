import { EntityFactory } from "@encompass/api/database/data-access";
import { Injectable } from "@nestjs/common";
import { UserEvents } from "./user-events";
import { ObjectId } from "mongodb"
import { UserEventsEntityRepository } from "./db/user-events-entity.repository";
import { UserEventsCreatedEvent } from "./events";

@Injectable()
export class UserEventsFactory implements EntityFactory<UserEvents>{
  constructor(
    private readonly userEventsEntityRepository: UserEventsEntityRepository
  ){}

  async create(
    userId: string
  ): Promise<UserEvents> {
    const userEvents = new UserEvents(
      new ObjectId(userId).toHexString(),
      []
    );

    await this.userEventsEntityRepository.create(userEvents);
    userEvents.apply(new UserEventsCreatedEvent(userEvents.getId()));
    return userEvents;
  }
}