import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { MongooseModule, SchemaFactory } from "@nestjs/mongoose";
import { UserEventsSchema } from "./db/user-events.schema";
import { HttpModule } from "@nestjs/axios";
import { UserEventsController } from "./user-events.controller";
import { UserEventsEntityRepository } from "./db/user-events-entity.repository";
import { UserEventsDtoRepository } from "./db/user-events-dto.repository";
import { UserEventsFactory } from "./user-events.factory";
import { UserEventsSchemaFactory } from "./db/user-events-schema.factory";
import { CreateUserEventsHandler } from "./commands";
import { UserEventsCreatedHandler } from "./events";

@Module({
  imports:[
    CqrsModule,
    MongooseModule.forFeature([
      {
        name: UserEventsSchema.name,
        schema: SchemaFactory.createForClass(UserEventsSchema)
      }
    ]),
    HttpModule
  ],

  controllers: [UserEventsController],
  providers:[
    UserEventsEntityRepository,
    UserEventsDtoRepository,
    UserEventsSchemaFactory,
    UserEventsFactory,
    CreateUserEventsHandler,
    UserEventsCreatedHandler
  ]
})

export class UserEventsModule{}