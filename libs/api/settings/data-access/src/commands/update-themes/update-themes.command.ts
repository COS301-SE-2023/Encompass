import { ThemesSettingsDto } from "../../dto";

export class UpdateThemesCommand{
  constructor(public readonly userId: string, public readonly themes: ThemesSettingsDto){}
}