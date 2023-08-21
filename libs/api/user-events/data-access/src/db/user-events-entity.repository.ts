import { BaseEntityRepository } from "@encompass/api/database/data-access";
import { Injectable } from "@nestjs/common";
import { UserEventsSchema } from "./user-events.schema";
import { UserEvents } from "../user-events";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserEventsSchemaFactory } from "./user-events-schema.factory";

@Injectable()
export class UserEventsEntityRepository extends BaseEntityRepository<
  UserEventsSchema,
  UserEvents
>{
  constructor(
    @InjectModel(UserEventsSchema.name)
    userEventsModel: Model<UserEventsSchema>,
    userEventsSchemaFactory: UserEventsSchemaFactory,
  ){
    super(userEventsModel, userEventsSchemaFactory)
  }
}