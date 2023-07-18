import { Injectable } from "@angular/core";
import { SettingsApi } from "./settings.api";
import { GetUserSettings } from "@encompass/app/settings/util";
import { Selector, State } from "@ngxs/store";
import { Action } from "@ngxs/store";
import { SettingsDto } from "@encompass/api/settings/data-access";
import { StateContext } from "@ngxs/store";

export interface SettingsStateModel {
  SettingsForm: {
    model: {
      settings: SettingsDto | null;
    }
  }
}

@State<SettingsStateModel>({
  name: 'settings',
  defaults: {
    SettingsForm: {
      model: {
        settings: null
      }
    }
  }
})

@Injectable()
export class SettingsState {
  constructor(private settingsApi: SettingsApi) {}

  @Action(GetUserSettings)
  async getSettings(ctx: StateContext<SettingsStateModel>, {userId}: GetUserSettings){
    const response = await this.settingsApi.getUserSettings(userId);

    if(response == null || response == undefined){
      return;
    }

    ctx.setState({
      SettingsForm: {
        model: {
          settings: response
        }
      }
    })
  }

  @Selector()
  static settings(state: SettingsStateModel){
    return state.SettingsForm.model.settings;
  }
}