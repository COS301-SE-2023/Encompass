import { ProfileDto } from "@encompass/api/profile/data-access"
import { Injectable } from "@angular/core"
import { Action, Selector, State, StateContext } from "@ngxs/store"
import { GetUserProfile } from "@encompass/app/user-profile/util"
import { UserProfileApi } from "./user-profile.api"

export interface UserProfileStateModel{
  UserProfileStateForm:{
    model:{
      userProfile: ProfileDto | null
    }
  }
}

@State<UserProfileStateModel>({
  name: 'userProfileModel',
  defaults:{
    UserProfileStateForm:{
      model:{
        userProfile: null
      }
    }
  }
})

@Injectable()
export class UserProfileState{
  constructor(private userProfileApi: UserProfileApi){}

  @Action(GetUserProfile)
  async getUserProfile(ctx: StateContext<UserProfileStateModel>, {username}: GetUserProfile){
    const response = await this.userProfileApi.getUserProfile(username)

    if(response == null && response == undefined){
      return;
    }

    ctx.setState({
      UserProfileStateForm:{
        model:{
          userProfile: response
        }
      }
    })
  }

  @Selector()
  static userProfile(state: UserProfileStateModel){
    return state.UserProfileStateForm.model.userProfile
  }
}