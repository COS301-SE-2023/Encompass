import { Injectable } from "@angular/core";
import { SignUpApi } from "./sign-up.api";
import { Action, State, StateContext, Selector } from "@ngxs/store";
import { CreateAccountRequest } from "@encompass/api/account/data-access";
import { CreateProfileRequest } from "@encompass/api/profile/data-access";
import { SignUp, CheckAccount, CheckUsername, CreateProfile } from "@encompass/app/sign-up/util";
import { AccountDto } from "@encompass/api/account/data-access";
import { ProfileDto } from "@encompass/api/profile/data-access";
import { ToastController } from "@ionic/angular"
export interface SignUpStateModel{
  SignUpForm: {
    model:{
      signup: AccountDto | null
    }
  }
}

export interface ProfileStateModel{
  ProfileForm: {
    model:{
      profile: ProfileDto | null
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

@State<ProfileStateModel>({
  name: 'profile',
  defaults: {
    ProfileForm: {
      model: {
        profile: null
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

        if(response != null){
          
          this.setExpireLocalStorage('UserID', response._id, 3600000);

          const profileData : CreateProfileRequest = {
            _id: response._id,
            username: request.username,
            name: request.name,
            lastName: request.lastName,
            categories: [],
            communities: [],
            awards: [],
            events: [],
            followers: [],
            following: [],
            posts: [],
            reviews: null,
            profileImage: null,
            profileBanner: null,
            bio: null,
          }

          ctx.dispatch(new CreateProfile(profileData))
        }
        if(response != null)
        {
          ctx.patchState({
            SignUpForm: {
              model: {
                signup: {
                  _id: response._id,
                  email: request.email,
                  password: request.password
                }
              }
            }
          })
        }
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

  @Action(CreateProfile)
  async createProfile(ctx: StateContext<ProfileStateModel>, {request}: CreateProfile){
    const response = await this.signupApi.createProfile(request);

    // if(response != null && response != undefined){
    //   this.setExpireLocalStorage('UserID', response, 3600000);
    // }
  }

  setExpireLocalStorage(key: string, value: string, expirationTime: number){
    const item = {
      value: value,
      expirationTime: Date.now() + expirationTime
    };

    localStorage.setItem(key, JSON.stringify(item));
  }

  @Selector()
  static signup(state: SignUpStateModel){
    return state.SignUpForm.model.signup;
  }

  @Selector()
  static profile(state: ProfileStateModel){
    return state.ProfileForm.model.profile;
  }
}