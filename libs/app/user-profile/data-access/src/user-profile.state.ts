import { ProfileDto } from "@encompass/api/profile/data-access"
import { Injectable } from "@angular/core"
import { Action, Selector, State, StateContext } from "@ngxs/store"
import { GetUserProfile, GetUserProfilePosts } from "@encompass/app/user-profile/util"
import { UserProfileApi } from "./user-profile.api"
import { PostDto } from "@encompass/api/post/data-access"

export interface UserProfileStateModel{
  UserProfileStateForm:{
    model:{
      userProfile: ProfileDto | null
    }
  }
}

export interface UserProfilePostModel{
  UserProfilePostForm:{
    model:{
      userProfilePosts: PostDto[] | null
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

@State<UserProfilePostModel>({
  name: 'userProfilePostModel',
  defaults:{
    UserProfilePostForm:{
      model:{
        userProfilePosts: null
      }
    }
  }
})

@Injectable()
export class UserProfileState{
  constructor(private userProfileApi: UserProfileApi){}

  // @Action(GetUserProfile)
  async getUserProfile( username: string){
    const response = await this.userProfileApi.getUserProfile(username)

    if(response == null && response == undefined){
      return null;
    }

    return response;

    // ctx.setState({
    //   UserProfileStateForm:{
    //     model:{
    //       userProfile: response
    //     }
    //   }
    // })
  }

  async addFollower(username: string, followerUsername: string){
    const response = await this.userProfileApi.addFollower(username, followerUsername)

    if(response == null && response == undefined){
      return null;
    }
    
    return response;
  }


  async removeFollower(username: string, followerUsername: string){
    const response = await this.userProfileApi.removeFollower(username, followerUsername)

    if(response == null && response == undefined){
      return null;
    }

    return response;
  }
  
  @Action(GetUserProfilePosts)
  async getUserProfilePosts(ctx: StateContext<UserProfilePostModel>, {username}: GetUserProfilePosts){
    const response = await this.userProfileApi.getUserProfilePosts(username)

    if(response == null && response == undefined){
      return;
    }

    ctx.setState({
      UserProfilePostForm:{
        model:{
          userProfilePosts: response
        }
      }
    })
  }

  @Selector()
  static userProfile(state: UserProfileStateModel){
    return state.UserProfileStateForm.model.userProfile
  }

  @Selector()
  static userProfilePosts(state: UserProfilePostModel){
    return state.UserProfilePostForm.model.userProfilePosts
  }
}