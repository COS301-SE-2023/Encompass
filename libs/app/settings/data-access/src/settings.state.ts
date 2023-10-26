import { Injectable } from "@angular/core";
import { SettingsApi } from "./settings.api";
import { GetAccount, GetUserSettings, UpdateEmail, UpdateMessageSettings, UpdateNotificationSettings, UpdatePassword, UpdateProfileSettings } from "@encompass/app/settings/util";
import { Selector, State } from "@ngxs/store";
import { Action } from "@ngxs/store";
import { SettingsDto } from "@encompass/api/settings/data-access";
import { StateContext } from "@ngxs/store";
import { AccountDto } from "@encompass/api/account/data-access";

export interface SettingsStateModel {
  SettingsForm: {
    model: {
      settings: SettingsDto | null;
    }
  }
}

export interface SettingsAccountModel{
  AccountForm: {
    model: {
      account: AccountDto | null;
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

@State<SettingsAccountModel>({
  name: 'settingsAccount',
  defaults: {
    AccountForm: {
      model: {
        account: null
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

  @Action(UpdateProfileSettings)
  async updateProfile(ctx: StateContext<SettingsStateModel>, {userId, settings}: UpdateProfileSettings){
    const response = await this.settingsApi.updateProfile(userId, settings);

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

  @Action(UpdateNotificationSettings)
  async updateNotifications(ctx: StateContext<SettingsStateModel>, {userId, settings}: UpdateNotificationSettings){
    const response = await this.settingsApi.updateNotification(userId, settings);

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

  @Action(UpdateMessageSettings)
  async updateMessage(ctx: StateContext<SettingsStateModel>, {userId, settings}: UpdateMessageSettings){
    const response = await this.settingsApi.updateMessage(userId, settings);

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

  @Action(GetAccount)
  async getAccount(ctx: StateContext<SettingsAccountModel>, {userId}: GetAccount){
    // console.log("here")
    const response = await this.settingsApi.getAccount(userId);

    if(response == null || response == undefined){
      return;
    }

    ctx.setState({
      AccountForm: {
        model: {
          account: response
        }
      }
    })
  }

  @Action(UpdateEmail)
  async updateEmail(ctx: StateContext<SettingsAccountModel>, {userId, email}: UpdateEmail){
    const response = await this.settingsApi.updateEmail(userId, email);

    if(response == null || response == undefined){
      return;
    }

    ctx.setState({
      AccountForm: {
        model: {
          account: response
        }
      }
    })
  }

  @Action(UpdatePassword)
  async updatePassword(ctx: StateContext<SettingsAccountModel>, {userId, password}: UpdatePassword){
    const response = await this.settingsApi.updatePassword(userId, password);

    if(response == null || response == undefined){
      return;
    }

    ctx.setState({
      AccountForm: {
        model: {
          account: response
        }
      }
    })
  }

  @Selector()
  static settings(state: SettingsStateModel){
    return state.SettingsForm.model.settings;
  }

  @Selector()
  static account(state: SettingsAccountModel){
    return state.AccountForm.model.account;
  }
}