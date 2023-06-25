import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { MongooseModule } from "@nestjs/mongoose";
import { CommunitySchema } from "./db/community.schema";
import { SchemaFactory } from "@nestjs/mongoose";
import { CommunityController } from "./community.controller";
import { CommunityEntityRepository } from "./db/community-entity.repository";
import { CommunityDtoRepository } from "./db/community-dto.repository";
import { CommunitySchemaFactory } from "./db/community-schema.factory";
import { CommunityFactory } from "./community.factory";
import { CreateCommunityHandler, UpdateCommunityHandler} from "./commands";
import { CommunityCreatedHandler } from "./events";
import { DoesExistHandler, GetByNameHandler, GetCommunityHandler} from "./queries";
import { AddPostHandler } from "./commands/add-post/add-post.handler";


@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      {
        name: CommunitySchema.name,
        schema: SchemaFactory.createForClass(CommunitySchema),
      },
    ]),
  ],

  controllers: [CommunityController],
  providers: [
    CommunityEntityRepository,
    CommunityDtoRepository,
    CommunitySchemaFactory,
    CommunityFactory,
    CreateCommunityHandler,
    CommunityCreatedHandler,
    GetCommunityHandler,
    UpdateCommunityHandler,
    DoesExistHandler,
    AddPostHandler,
    GetByNameHandler,
  ],
})

export class CommunityModule{}