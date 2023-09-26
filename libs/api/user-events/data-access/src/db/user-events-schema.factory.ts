import { EntitySchemaFactory } from "@encompass/api/database/data-access";
import { Injectable } from "@nestjs/common";
import { UserEvents } from "../user-events";
import { ObjectId } from "mongodb"
import { UserEventsSchema } from "./user-events.schema";

@Injectable()
export class UserEventsSchemaFactory
  implements EntitySchemaFactory<UserEventsSchema, UserEvents>{
    create(userEvents: UserEvents): UserEventsSchema {
      return{
        _id: new ObjectId(userEvents.getId()),
        events: userEvents.getEvents()
      }
    }

    createFromSchema(userEventsSchema: UserEventsSchema): UserEvents {
      return new UserEvents(
        userEventsSchema._id.toHexString(),
        userEventsSchema.events
      )  
    }
  }