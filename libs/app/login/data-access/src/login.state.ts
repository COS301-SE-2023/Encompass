import { Injectable } from "@angular/core"
import { AccountDto, GetAccountRequest } from "@encompass/api/account/data-access"
import { Selector, State, StateContext, Action } from "@ngxs/store"
import { LoginApi } from "./login.api"
import { login } from '@encompass/app/login/util'
import { ToastController } from "@ionic/angular"


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
  constructor(private loginApi: LoginApi, private toastController: ToastController){}

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

    else{
      // console.log("Error");

      const toast = await this.toastController.create({
        message: 'Incorrect Email or Password',
        duration: 2000,
        color: 'danger'
      })

      await toast.present();
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
