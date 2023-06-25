import { AccountDto } from "@encompass/api/account/data-access"
import { Action, Selector, State, StateContext, Store } from "@ngxs/store"
import { Injectable } from "@angular/core"
import { ProfileApi } from "./profile.api"
import { SubscribeToProfile, SetProfile, UpdateProfile } from "@encompass/app/profile/util"
import { SignUpState } from "@encompass/app/sign-up/data-access"
import { LoginState } from "@encompass/app/login/data-access"
import { profile } from "console"
import { ProfileDto } from "@encompass/api/profile/data-access"
import { tap } from "rxjs"
import { produce } from "immer"
import { set } from "mongoose"

export interface ProfileStateModel{
  ProfileForm: {
    model:{
      profile: ProfileDto | null
    }
  }
}

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
export class ProfileState{
  constructor(private profileApi: ProfileApi, private readonly store: Store){}

  @Action(SubscribeToProfile)
  subscribeToProfile(ctx: StateContext<ProfileStateModel>){
    // const id = localStorage.getItem('UserID');
    const id = this.getExpireLocalStorage('UserID');

    if(!id)
    {
      console.log("User is null");
      return null
    } 

    return this.profileApi
      .user$(id)
      .pipe(tap((profile: ProfileDto) => ctx.dispatch(new SetProfile(profile))))
  }

  @Action(SetProfile)
  setProfile(ctx: StateContext<ProfileStateModel>, {profile}: SetProfile){
    return ctx.setState(
      produce((draft) => {
        draft.ProfileForm.model.profile = profile;
      })
    )
  }

  @Action(UpdateProfile)
  updateProfile(ctx: StateContext<ProfileStateModel>, {updateProfileRequest, userId}: UpdateProfile){
    const response = this.profileApi.updateProfile(updateProfileRequest, userId);

    console.log(response);
  }

  getExpireLocalStorage(key: string): string | null{
    const item = localStorage.getItem(key);
    
    if(!item){
      return null;
    }

    const store = JSON.parse(item);

    if(Date.now() > store.expirationTime){
      localStorage.removeItem(key)
      return null;
    }

    else{
      localStorage.removeItem(key);
      this.setExpireLocalStorage(key, store.value, 3600000);
    }

    return store.value;
  }

  setExpireLocalStorage(key: string, value: string, expirationTime: number){
    const item = {
      value: value,
      expirationTime: Date.now() + expirationTime
    };

    localStorage.setItem(key, JSON.stringify(item));
  }

  @Selector()
  static profile(state: ProfileStateModel){
    return state.ProfileForm.model.profile;
  }
}