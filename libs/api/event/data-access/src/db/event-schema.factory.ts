import { Injectable } from "@nestjs/common";
import { Event } from "../event";
import { EventSchema } from "./event.schema";
import { EntitySchemaFactory } from "@encompass/api/database/data-access";
import { ObjectId } from "mongodb";

@Injectable()
export class EventSchemaFactory
  implements EntitySchemaFactory<EventSchema, Event> {
    create(event: Event): EventSchema {
      return {
        _id: new ObjectId(event.getId()),
        name: event.getName(),
        host: event.getHost(),
        community: event.getCommunity(),
        description: event.getDescription(),
        startDate: event.getStartDate(),
        endDate: event.getEndDate(),
        members: event.getMembers(),
        quiz: event.getQuiz(),
        prompt: event.getPrompt(),
      };
    }

    createFromSchema(entitySchema: EventSchema): Event{
      return new Event(
        entitySchema._id.toHexString(), 
        entitySchema.name,
        entitySchema.host,
        entitySchema.community,
        entitySchema.description,
        entitySchema.startDate,
        entitySchema.endDate,
        entitySchema.members,
        entitySchema.quiz,
        entitySchema.prompt,
      )
    }
  }