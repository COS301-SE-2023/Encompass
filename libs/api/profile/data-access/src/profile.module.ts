import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { MongooseModule, Schema } from "@nestjs/mongoose";
import { ProfileSchema } from "./db/profile.schema";
import { SchemaFactory } from "@nestjs/mongoose";
import { ProfileController } from "./profile.controller";
import { ProfileEntityRepository } from "./db/profile-entity.repository";
import { ProfileDtoRepository } from "./db/profile-dto.repository";
import { ProfileSchemaFactory } from "./db/profile-schema.factory";
import { ProfileFactory } from "./profile.factory";
import { CreateProfileHandler } from "./commands";
import { ProfileCreatedHandler } from "./events";
import { GetProfileHandler } from "./queries";

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      {
        name: ProfileSchema.name,
        schema: SchemaFactory.createForClass(ProfileSchema),
      },
    ]),
  ],

  controllers: [ProfileController],
  providers: [
    ProfileEntityRepository,
    ProfileDtoRepository,
    ProfileSchemaFactory,
    ProfileFactory,
    CreateProfileHandler,
    ProfileCreatedHandler,
    GetProfileHandler
  ],
})

export class ProfileModule{}