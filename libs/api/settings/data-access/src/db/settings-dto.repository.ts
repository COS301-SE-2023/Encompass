import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { SettingsSchema } from "./settings.schema";

@Injectable()
export class SettingsDtoRepository{
  constructor(
    @InjectModel(SettingsSchema.name)
    private readonly settingsModel: Model<SettingsSchema>,
  ){}

  async findById(id: string){
    return await this.settingsModel.findOne({ _id: id });
  }
}