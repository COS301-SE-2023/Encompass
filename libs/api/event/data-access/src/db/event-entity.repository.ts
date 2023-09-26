import { BaseEntityRepository } from "@encompass/api/database/data-access";
import { Injectable } from "@nestjs/common";
import { Event } from "../event";
import { EventSchema } from "./event.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { EventSchemaFactory } from "./event-schema.factory";

@Injectable()
export class EventEntityRepository extends BaseEntityRepository<
EventSchema,
Event
>{
  constructor(
    @InjectModel(EventSchema.name)
    eventModel: Model<EventSchema>,
    eventSchemaFactory: EventSchemaFactory,
  ){
    super(eventModel, eventSchemaFactory);
  }

  async findUsersByKeyword(keyword: string): Promise<Event[]>{
    const lowerCaseKeyword = keyword.toLowerCase();
    const allUsers = await this.findAll();
    const filteredUsers = allUsers.filter(user => {
      const name = user?.name?.toLowerCase();
      const isNameMatch = name?.includes(lowerCaseKeyword);
      const isFirstNameMatch = name?.includes(lowerCaseKeyword);
      return isFirstNameMatch || isNameMatch;
    });
    return filteredUsers;
  }
}