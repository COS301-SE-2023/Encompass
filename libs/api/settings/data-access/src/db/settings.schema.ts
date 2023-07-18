import { IdentifiableEntitySchema } from "@encompass/api/database/data-access";
import { Prop, Schema } from "@nestjs/mongoose";
import { NotificationsSettingsDto, PrivacySettingsDto, ProfileSettingsDto, ThemesSettingsDto } from "../dto";

@Schema({ versionKey: false, collection: "settings" })
export class SettingsSchema extends IdentifiableEntitySchema{
  @Prop()
  readonly profile!: ProfileSettingsDto;
  
  @Prop()
  readonly notifications!: NotificationsSettingsDto;

  @Prop()
  readonly messagePermissions!: string;

  @Prop()
  readonly privacy!: PrivacySettingsDto;

  @Prop()
  readonly themes!: ThemesSettingsDto;
}