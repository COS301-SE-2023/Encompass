import { ProfileDto } from "@encompass/api/profile/data-access"
import { Injectable } from "@angular/core"
import { Action, Selector, State, StateContext } from "@ngxs/store"
import { DislikeUserProfilePost, GetUserProfile, GetUserProfilePosts, GetUserSettings, LikeUserProfilePost, UpdateUserPost } from "@encompass/app/user-profile/util"
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

  getUserProfileSettings(username: string){
    const response = this.userProfileApi.getUserSettings(username)

    if(response == null && response == undefined){
      return null;
    }

    return response;
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
  async getUserProfilePosts(ctx: StateContext<UserProfilePostModel>, {username, userId}: GetUserProfilePosts){
    const response = await this.userProfileApi.getUserProfilePosts(username, userId)

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
    const response = await this.userProfileApi.updatePost(updateRequest, postId);

    if(response == null || response == undefined){
      return;
    }

    try{
      const posts = await ctx.getState().UserProfilePostForm.model.userProfilePosts;

      if(posts == null ){
        // console.log("POSTS IS NULL")
        return;
      }

      const index = await posts.findIndex(x => x._id == response._id)

      // console.log(posts[index])

      posts[index] = response;

      // console.log(posts[index])

      ctx.patchState({
        UserProfilePostForm: {
          model: {
            userProfilePosts: posts
          }
        }
      })
    }

    catch(error){
      console.log(error)
    }
  }

  @Action(LikeUserProfilePost)
  async likedProfilePost(ctx: StateContext<UserProfilePostModel>, { postId, userId }: LikeUserProfilePost){
    const response = await this.userProfileApi.likePost(postId, userId);

    if (response == null || response == undefined) {
      return;
    }

    try{
      const posts = await ctx.getState().UserProfilePostForm.model.userProfilePosts;

      if(posts == null ){
        // console.log("POSTS IS NULL")
        return;
      }

      const index = await posts.findIndex(x => x._id == response._id)

      posts[index] = response;

      ctx.patchState({
        UserProfilePostForm: {
          model: {
            userProfilePosts: posts
          }

        }
      })
    }

    catch(error){
      console.log(error)
    }

  }

  @Action(DislikeUserProfilePost)
  async dislikedProfilePost(ctx: StateContext<UserProfilePostModel>, { postId, userId }: DislikeUserProfilePost){
    const response = await this.userProfileApi.dislikePost(postId, userId);

    if (response == null || response == undefined) {
      return;
    }

    try{
      const posts = await ctx.getState().UserProfilePostForm.model.userProfilePosts;

      if(posts == null ){
        // console.log("POSTS IS NULL")
        return;
      }

      const index = await posts.findIndex(x => x._id == response._id)

      posts[index] = response;

      ctx.patchState({
        UserProfilePostForm: {
          model: {
            userProfilePosts: posts
          }
        }
      })
    }

    catch(error){
      console.log(error)
    }

  }

  async getFollowers(followerList: string[]){
    const followers: ProfileDto[] = [];
  
    await Promise.all(
      followerList.map(async (element) => {
        const item = await this.userProfileApi.getProfile(element);
  
        if (item != null && item != undefined) {
          followers.push(item);
        }
      })
    );
  
    // console.log(followers);
  
    return followers;
  }

  async getFollowing(followingList: string[]): Promise<ProfileDto[]> {
    const following: ProfileDto[] = [];
  
    await Promise.all(
      followingList.map(async (element) => {
        const item = await this.userProfileApi.getProfile(element);
  
        if (item != null && item != undefined) {
          following.push(item);
        }
      })
    );
  
    // console.log(following);
  
    return following;
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