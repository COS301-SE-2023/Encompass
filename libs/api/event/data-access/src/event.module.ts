import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { MongooseModule } from "@nestjs/mongoose";
import { EventSchema } from "./db/event.schema";
import { SchemaFactory } from "@nestjs/mongoose";
import { EventController } from "./event.controller";
import { EventEntityRepository } from "./db/event-entity.repository";
import { EventDtoRepository } from "./db/event-dto.repository";
import { EventSchemaFactory } from "./db/event-schema.factory";
import { EventFactory } from "./event.factory";
import { EventCreateHandler } from "./events";
import { HttpModule } from "@nestjs/axios";

  
@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      {
        name: EventSchema.name,
        schema: SchemaFactory.createForClass(EventSchema),
      },
    ]),
    HttpModule
  ],

  controllers: [EventController],
  providers: [
    EventEntityRepository,
    EventDtoRepository,
    EventSchemaFactory,
    EventFactory,
    EventCreateHandler,
  ],
})

export class EventModule{}