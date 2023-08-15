import { EntityFactory } from "@encompass/api/database/data-access";
import { Injectable } from "@nestjs/common";
import { EventEntityRepository } from "./db/event-entity.repository";
import { ObjectId } from "mongodb";
 import { EventCreatedEvent } from "./events";
import { Event } from "./event";

@Injectable()
export class EventFactory implements EntityFactory<Event>{
  constructor(
    private readonly eventEntityRepository: EventEntityRepository,
  ){}

  async create(
    name: string | null,
    host: string | null,
    community: string | null,
    description: string | null,
    startDate: Date | null,
    endDate: Date | null,
    members: string[] | null,
    quiz: string[] | null,
    memo: string[] | null,
    prompt: string[] | null,
  ) : Promise<Event>{
    const event = new Event(
      new ObjectId().toHexString(),
       name,
        host,
        community,
        description,
        startDate,
        endDate,
        members,
        quiz,
        memo,
        prompt,
      
    );
    await this.eventEntityRepository.create(event);
    event.apply(new EventCreatedEvent(event.getId()))
    return event;
  }
}