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
import { CreateProfileHandler, RemovePostHandler, UpdateProfileHandler, RemoveCommunityHandler, AddFollowerHandler, AddFollowingHandler, RemoveFollowerHandler, RemoveFollowingHandler, AddCommunityHandler, AddCoinsHandler, RemoveCoinsHandler, RemoveAwardHandler, AddAwardHandler, AddEventHandler, AddAwardByUserIdHandler } from "./commands";
import { ProfileCreatedHandler } from "./events";
import { GetAllProfilesHandler, GetProfileHandler, GetUsernameHandler, GetByUsernameHandler } from "./queries";
import { HttpModule } from "@nestjs/axios";
import { UploadImage } from "./upload-image.service";
import { GetRecommendedProfilesHandler } from "./queries/get-recommended-profiles/getRecommendedProfiles.handler";
import { GetUsersByKeywordHandler } from "./queries/search-profiles/get-users-by-keyword.handler";

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
    UploadImage,
    GetByUsernameHandler,
    AddFollowerHandler,
    AddFollowingHandler,
    RemoveFollowerHandler,
    RemoveFollowingHandler,
    GetRecommendedProfilesHandler,
    GetUsersByKeywordHandler,
    AddCommunityHandler,
    AddCoinsHandler,
    RemoveCoinsHandler,
    AddAwardHandler,
    RemoveAwardHandler,
    AddEventHandler,
    AddAwardByUserIdHandler
  ],
})

export class ProfileModule{}