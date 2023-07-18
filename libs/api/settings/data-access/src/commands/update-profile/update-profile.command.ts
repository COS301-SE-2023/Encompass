import { ProfileSettingsDto } from "../../dto";

export class UpdateProfileCommand{
  constructor(public readonly userId: string, public readonly profile: ProfileSettingsDto){}
}