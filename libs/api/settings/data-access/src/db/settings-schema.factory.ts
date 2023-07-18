import { EntitySchemaFactory } from "@encompass/api/database/data-access";
import { Injectable } from "@nestjs/common";
import { SettingsSchema } from "./settings.schema";
import { Settings } from "../settings";
import { ObjectId } from "mongodb";

@Injectable()
export class SettingsSchemaFactory
  implements EntitySchemaFactory<SettingsSchema, Settings>{
    create(settings: Settings): SettingsSchema {
      return {
        _id: new ObjectId(settings.getId()),
        profile: settings.getProfile(),
        notifications: settings.getNotifications(),
        messagePermissions: settings.getMessagePermissions(),
        privacy: settings.getPrivacy(),
        themes: settings.getThemes(),
      }
    }

    createFromSchema(entitySchema: SettingsSchema): Settings{
      return new Settings(
        entitySchema._id.toHexString(),
        entitySchema.profile,
        entitySchema.notifications,
        entitySchema.messagePermissions,
        entitySchema.privacy,
        entitySchema.themes,
      )
    }
  }