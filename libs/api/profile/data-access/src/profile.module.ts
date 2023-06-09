import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { MongooseModule } from "@nestjs/mongoose";
import { ProfileSchema } from "./db/profile.schema";
import { SchemaFactory } from "@nestjs/mongoose";
import { ProfileController } from "./profile.controller";
import { ProfileEntityRepository } from "./db/profile-entity.repository";
import { ProfileDtoRepository } from "./db/profile-dto.repository";
import { ProfileSchemaFactory } from "./db/profile-schema.factory";
import { ProfileFactory } from "./profile.factory";
import { CreateProfileHandler, RemovePostHandler, UpdateProfileHandler, RemoveCommunityHandler } from "./commands";
import { ProfileCreatedHandler } from "./events";
import { GetAllProfilesHandler, GetProfileHandler, GetUsernameHandler } from "./queries";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      {
        name: ProfileSchema.name,
        schema: SchemaFactory.createForClass(ProfileSchema),
      },
    ]),
    HttpModule
  ],

  controllers: [ProfileController],
  providers: [
    ProfileEntityRepository,
    ProfileDtoRepository,
    ProfileSchemaFactory,
    ProfileFactory,
    CreateProfileHandler,
    ProfileCreatedHandler,
    GetProfileHandler,
    GetAllProfilesHandler,
    UpdateProfileHandler,
    GetUsernameHandler,
    RemovePostHandler,
    RemoveCommunityHandler,
  ],
})

export class ProfileModule{}