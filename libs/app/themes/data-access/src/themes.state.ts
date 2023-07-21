import { SettingsDto } from "@encompass/api/settings/data-access";
import { Injectable } from "@angular/core";
import { ThemesApi } from "./themes.api";
import { GetUserSettings, UpdateThemes } from "@encompass/app/themes/util";
import { Action, Selector, State, StateContext } from "@ngxs/store";

export interface ThemesStateModel {
  ThemesForm: {
    model: {
      settings: SettingsDto | null;
    }
  }
}

@State<ThemesStateModel>({
  name: 'themes',
  defaults: {
    ThemesForm: {
      model: {
        settings: null
      }
    }
  }
})

@Injectable()
export class ThemesState {
  constructor(private themesApi: ThemesApi) {}

  @Action(GetUserSettings)
  async getSettings(ctx: StateContext<ThemesStateModel>, {userId}: GetUserSettings){
    const response = await this.themesApi.getUserSettings(userId);

    if(response == null || response == undefined){
      return;
    }

    ctx.setState({
      ThemesForm: {
        model: {
          settings: response
        }
      }
    })
  }

  @Action(UpdateThemes)
  async updateThemes(ctx: StateContext<ThemesStateModel>, {userId, settings}: UpdateThemes){
    const response = await this.themesApi.updateThemes(userId, settings);

    if(response == null || response == undefined){
      return;
    }

    ctx.setState({
      ThemesForm: {
        model: {
          settings: response  
        }
      }
    })
  }

  @Selector()
  static settings(state: ThemesStateModel){
    return state.ThemesForm.model.settings;
  }
}
