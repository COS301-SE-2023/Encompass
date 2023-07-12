import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { MongooseModule, SchemaFactory } from "@nestjs/mongoose";
import { CommunityRequestSchema } from "./db/community-request.schema";
import { CommunityRequestController } from "./community-request.controller";
import { CommunityRequestEntityRepository } from "./db/community-request-entity.repository";
import { CommunityRequestDtoRepository } from "./db/community-request-dto.repository";
import { CommunityRequestSchemaFactory } from "./db/community-request-schema.factory";
import { CommunityRequestFactory } from "./community-request.factory";
import { CreateCommunityRequestHandler } from "./commands";

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      {
        name: CommunityRequestSchema.name,
        schema: SchemaFactory.createForClass(CommunityRequestSchema),
      },
    ]),
    HttpModule
  ],

  controllers: [CommunityRequestController],
  providers: [
    CommunityRequestEntityRepository,
    CommunityRequestDtoRepository,
    CommunityRequestSchemaFactory,
    CommunityRequestFactory,
    CreateCommunityRequestHandler
  ],
})

export class CommunityRequestModule{}