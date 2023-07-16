import { BaseEntityRepository } from "@encompass/api/database/data-access";
import { Injectable } from "@nestjs/common";
import { SettingsSchema } from "./settings.schema";
import { Settings } from "../settings";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { SettingsSchemaFactory } from "./settings-schema.factory";

@Injectable()
export class SettingsEntityRepository extends BaseEntityRepository<
SettingsSchema,
Settings
>{
  constructor(
    @InjectModel(SettingsSchema.name)
    settingsModel: Model<SettingsSchema>,
    settingsSchemaFactory: SettingsSchemaFactory,
  ){
    super(settingsModel, settingsSchemaFactory);
  }
}