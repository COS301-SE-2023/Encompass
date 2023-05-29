import { Injectable } from "@angular/core";
import { SignUpApi } from "./sign-up.api";
import { Action, State, StateContext, Selector } from "@ngxs/store";
import { CreateAccountRequest } from "@encompass/api/account/data-access";
import { signUp } from "@encompass/app/sign-up/util";
import { AccountDto } from "@encompass/api/account/data-access";

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
  constructor(private signupApi: SignUpApi){}

  @Action(signUp)
  async signUp(ctx: StateContext<SignUpStateModel>, {request}: signUp){

    const data : CreateAccountRequest = {
      email: request.email,
      password: request.password
    }

    const response = await this.signupApi.signUp(data);
    console.log(response);
  }

  @Selector()
  static signup(state: SignUpStateModel)
  {
    return state.SignUpForm.model.signup;
  }
}