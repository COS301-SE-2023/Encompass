import { PrivacySettingsDto } from "../../dto";

export class UpdatePrivacyCommand{
  constructor(public readonly userId: string, public readonly privacy: PrivacySettingsDto){}
}