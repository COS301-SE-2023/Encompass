import { ProfileDto } from "@encompass/api/profile/data-access"
import { Injectable } from "@angular/core"
import { Action, Selector, State, StateContext } from "@ngxs/store"
import { GetUserProfile, GetUserProfilePosts, GetUserSettings, UpdateUserPost } from "@encompass/app/user-profile/util"
import { UserProfileApi } from "./user-profile.api"
import { PostDto } from "@encompass/api/post/data-access"
import { SettingsDto } from "@encompass/api/settings/data-access"

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

export interface UserProfileSettingsModel{
  UserProfileSettingsForm:{
    model:{
      userProfileSettings: SettingsDto | null
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

@State<UserProfileSettingsModel>({
  name: 'userProfileSettingsModel',
  defaults:{
    UserProfileSettingsForm:{
      model:{
        userProfileSettings: null
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

  @Action(UpdateUserPost)
  async updatePost(ctx: StateContext<UserProfilePostModel>, {postId, updateRequest, username}: UpdateUserPost){
    console.log("POST")
    const response = await this.userProfileApi.updatePost(updateRequest, postId);

    if(response == null || response == undefined){
      return;
    }

    ctx.dispatch(new GetUserProfilePosts(username))
    
    // try{
    //   const posts = ctx.getState().UserProfilePostForm.model.userProfilePosts;

    //   if(posts == null ){
    //     return
    //   }

    //   const index = posts.findIndex(x => x._id == response._id)
    //   // console.log(response)
    //   posts[index] = response;
    //   console.log(posts[index])
    //   console.log("HERE")

    //   ctx.patchState({
    //     UserProfilePostForm: {
    //       model: {
    //         userProfilePosts: posts
    //       }
    //     }
    //   })
    // }

    // catch(error){
    //   console.log("here")
    //   ctx.dispatch(new GetUserProfilePosts(username))
    //   console.log(error)
    // }
  }
  
  @Action(GetUserSettings)
  async getUserSettings(ctx: StateContext<UserProfileSettingsModel>, {userId}: GetUserSettings){
    const response = await this.userProfileApi.getUserSettings(userId)

    if(response == null && response == undefined){
      return;
    }

    ctx.setState({
      UserProfileSettingsForm:{
        model:{
          userProfileSettings: response
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

  @Selector()
  static userProfileSettings(state: UserProfileSettingsModel){
    return state.UserProfileSettingsForm.model.userProfileSettings
  }
}