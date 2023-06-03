import { Injectable } from "@angular/core";
import { SignUpApi } from "./sign-up.api";
import { Action, State, StateContext, Selector } from "@ngxs/store";
import { CreateAccountRequest } from "@encompass/api/account/data-access";
import { SignUp, CheckAccount, CheckUsername } from "@encompass/app/sign-up/util";
import { AccountDto } from "@encompass/api/account/data-access";
import { ToastController } from "@ionic/angular";
export interface SignUpStateModel{
  SignUpForm: {
    model:{
      signup: AccountDto | null
    }
  }
}

@State<SignUpStateModel>({
  name: 'signup',
  defaults: {
    SignUpForm: {
      model: {
        signup: null
      }
    }
  }
})

@Injectable()
export class SignUpState{
  constructor(private signupApi: SignUpApi, private readonly toastController: ToastController){}

  @Action(SignUp)
  async signUp(ctx: StateContext<SignUpStateModel>, {request}: SignUp){

    const data : CreateAccountRequest = {
      email: request.email,
      password: request.password
    }
    const variable = await this.checkAccount(ctx, {request: request.email});
    const variable2 = await this.checkUsername(ctx, {request: request.username});

    if(variable == false)
    {
      if(variable2 == false)
      {
        const response = await this.signupApi.signUp(data);

        ctx.patchState({
          SignUpForm: {
            model: {
              signup: {
                _id: response,
                email: request.email,
                password: request.password
              }
            }
          }
        })
      }

      else
      {
        const toast = await this.toastController.create({
          message: 'Username already exists',
          duration: 2000,
          color: 'danger'
        });
  
        await toast.present();
      }
    }
    
    else
    {
      const toast = await this.toastController.create({
        message: 'Email already exists',
        duration: 2000,
        color: 'danger'
      });

      await toast.present();
    }
  }

  @Action(CheckAccount)
  async checkAccount(ctx: StateContext<SignUpStateModel>, {request}: CheckAccount) : Promise<boolean | null>{

    const response = await this.signupApi.checkAccount(request);

    return response;
  }

  @Action(CheckUsername)
  async checkUsername(ctx: StateContext<SignUpStateModel>, {request}: CheckUsername) : Promise<boolean | null>{

    const response = await this.signupApi.checkUsername(request);

    return response;
  }

  @Selector()
  static signup(state: SignUpStateModel)
  {
    return state.SignUpForm.model.signup;
  }
}