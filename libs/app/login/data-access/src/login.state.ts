import { Injectable } from "@angular/core"
import { AccountDto, GetAccountRequest } from "@encompass/api/account/data-access"
import { Selector, State, StateContext, Action } from "@ngxs/store"
import { LoginApi } from "./login.api"
import { login } from '@encompass/app/login/util'


export interface LoginStateModel{
  LoginForm: {
    model: {
      login: AccountDto | null
    }
  }
}
@State<LoginStateModel>({
  name: 'login',
  defaults: {
    LoginForm: {
      model: {
        login: null
      }
    }
  }
})

@Injectable()
export class LoginState{
  constructor(private loginApi: LoginApi){}

  @Action(login)
  async login(ctx: StateContext<LoginStateModel>, {request}: login){
    const data : GetAccountRequest = {
      email: request.email,
      password: request.password
    }

    const response = await this.loginApi.login(data);

    if(response != null)
    {
      this.setExpireLocalStorage('UserID', response._id, 3600000);

      const newData: AccountDto = { _id: response._id, email: request.email, password: request.password }

      ctx.patchState({
        LoginForm: {
          model: {
            login: newData
          }
        }
      });
    }
    
  }

  setExpireLocalStorage(key: string, value: string, expirationTime: number){
    const item = {
      value: value,
      expirationTime: Date.now() + expirationTime
    };

    localStorage.setItem(key, JSON.stringify(item));
  }

  @Selector()
  static loginModel(state: LoginStateModel)
  {
    return state.LoginForm.model.login;
  }
}
