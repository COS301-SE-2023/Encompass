import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { MongooseModule } from "@nestjs/mongoose";
import { SchemaFactory } from "@nestjs/mongoose";
import { SettingsController } from "./settings.controller";
import { SettingsEntityRepository } from "./db/settings-entity.repository";
import { SettingsDtoRepository } from "./db/settings-dto.repository";
import { SettingsSchema } from "./db/settings.schema";
import { SettingsSchemaFactory } from "./db/settings-schema.factory";
import { SettingsFactory } from "./settings.factory";
import { CreateSettingsHandler, UpdateMessagePermissionsHandler, UpdateNotificationsHandler, UpdateProfileHandler, UpdateThemesHandler } from "./commands"; 
import { GetSettingsHandler } from "./queries";

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      {
        name: SettingsSchema.name,
        schema: SchemaFactory.createForClass(SettingsSchema),
      }
    ]),
    HttpModule
  ],
  controllers: [SettingsController],
  providers: [
    SettingsEntityRepository,
    SettingsDtoRepository,
    SettingsSchemaFactory,
    SettingsFactory,
    CreateSettingsHandler,
    UpdateMessagePermissionsHandler,
    UpdateNotificationsHandler,
    UpdateProfileHandler,
    UpdateThemesHandler,
    GetSettingsHandler
  ]
})

export class SettingsModule{}