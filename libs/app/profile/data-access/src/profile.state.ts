import { AccountDto } from "@encompass/api/account/data-access"
import { Action, Selector, State, StateContext, Store } from "@ngxs/store"
import { Injectable } from "@angular/core"
import { ProfileApi } from "./profile.api"
import { SubscribeToProfile, SetProfile } from "@encompass/app/profile/util"
import { SignUpState } from "@encompass/app/sign-up/data-access"
import { LoginState } from "@encompass/app/login/data-access"
import { profile } from "console"
import { ProfileDto } from "@encompass/api/profile/data-access"
import { tap } from "rxjs/operators"
import { produce } from "immer"

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
    console.log("SubscribeToProfile");
    const user = this.store.selectSnapshot(LoginState.loginModel);
    console.log("UserId", user?._id);
    if(!user)
    {
      console.log("User is null");
      return null
    }

    return this.profileApi
      .user$(user._id)
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

  @Selector()
  static profile(state: ProfileStateModel){
    return state.ProfileForm.model.profile;
  }
}