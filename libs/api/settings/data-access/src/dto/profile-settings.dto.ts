export class ProfileSettingsDto{
  readonly nsfw!: boolean;
  readonly followPermission!: boolean;
  readonly blocked!: string[];
}