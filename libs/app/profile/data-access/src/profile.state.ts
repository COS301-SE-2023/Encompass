import { Action, Selector, State, StateContext, Store } from "@ngxs/store"
import { Injectable } from "@angular/core"
import { ProfileApi } from "./profile.api"
import { SubscribeToProfile, SetProfile, UpdateProfile, GetPosts, UpdatePost, GetComments, DeletePost, DeleteComment, DeleteCommunity, AddFollowing, RemoveFollowing, RemoveCommunity, AddCommunity, DislikeProfilePost, LikeProfilePost } from "@encompass/app/profile/util"
import { ProfileDto } from "@encompass/api/profile/data-access"
import { tap } from "rxjs"
import { produce } from "immer"
import { PostDto } from "@encompass/api/post/data-access"
import { CommentDto } from "@encompass/api/comment/data-access"
import { ToastController } from "@ionic/angular"

export interface ProfileStateModel{
  profile: ProfileDto | null
}

export interface ProfilePostModel{
  ProfilePostForm: {
    model:{
      posts: PostDto[] | null
    }
  }
}

export interface OtherUsers{
  OtherUsersForm: {
    model:{
      otherUsers: ProfileDto[] | null
    }
  }
}

export interface ProfileCommentModel{
  ProfileCommentForm: {
    model:{
      comments: CommentDto[] | null
    }
  }
}

@State<ProfileStateModel>({
  name: 'profile',
  defaults: {
        profile: null
  }
})

@State<ProfilePostModel>({
  name: 'profilePosts',
  defaults: {
    ProfilePostForm: {
      model: {
        posts: null
      },
    },
  },
})

@State<ProfileCommentModel>({
  name: 'profileComments',
  defaults: {
    ProfileCommentForm: {
      model: {
        comments: null
      },
    },
  },
})

@State<OtherUsers>({
  name: 'otherUsers',
  defaults: {
    OtherUsersForm: {
      model: {
        otherUsers: null
      }
    }
  }
})

@Injectable()
export class ProfileState{
  constructor(private profileApi: ProfileApi, private readonly store: Store, private toastController: ToastController){}

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
        draft.profile = profile;
      })
    )
  }

  @Action(UpdateProfile)
  async updateProfile(ctx: StateContext<ProfileStateModel>, {updateProfileRequest, userId}: UpdateProfile){
    const response = await this.profileApi.updateProfile(updateProfileRequest, userId);

    console.log(response);

    if(response == null || response == undefined){
      return;
    }

    const toast = await this.toastController.create({
      message: 'Profile successfully updated',
      duration: 2000,
      color: 'success'
    })

    await toast.present();

    await ctx.patchState({
      profile: response
    })
  }

  @Action(GetPosts)
  async getPosts(ctx: StateContext<ProfilePostModel>, {username, userId}: GetPosts){
    const response = await this.profileApi.getPosts(username, userId);
    
    if(response == null || response == undefined){
      return;
    }

    console.log(response);

    return ctx.setState({
      ProfilePostForm: {
        model: {
          posts: response
        }
      }
    })
  }

  @Action(UpdatePost)
  async updatePost(ctx: StateContext<ProfilePostModel>, {postId, updateRequest}: UpdatePost){
    const response = await this.profileApi.updatePost(postId, updateRequest);

    if(response == null || response == undefined){
      return;
    }

    try{
      const posts = await ctx.getState().ProfilePostForm.model.posts;

      if(posts == null ){
        console.log("POSTS IS NULL")
        return;
      }

      const index = await posts.findIndex(x => x._id == response._id)

      console.log(posts[index])

      posts[index] = response;

      console.log(posts[index])

      ctx.patchState({
        ProfilePostForm: {
          model: {
            posts: posts
          }
        }
      })
    }

    catch(error){
      console.log(error)
    }
  }

  @Action(LikeProfilePost)
  async likedProfilePost(ctx: StateContext<ProfilePostModel>, { postId, userId }: LikeProfilePost){
    const response = await this.profileApi.likePost(postId, userId);

    if (response == null || response == undefined) {
      return;
    }

    try{
      const posts = await ctx.getState().ProfilePostForm.model.posts;

      if(posts == null ){
        console.log("POSTS IS NULL")
        return;
      }

      const index = await posts.findIndex(x => x._id == response._id)

      posts[index] = response;

      ctx.patchState({
        ProfilePostForm: {
          model: {
            posts: posts
          }

        }
      })
    }

    catch(error){
      console.log(error)
    }

  }

  @Action(DislikeProfilePost)
  async dislikedProfilePost(ctx: StateContext<ProfilePostModel>, { postId, userId }: DislikeProfilePost){
    const response = await this.profileApi.dislikePost(postId, userId);

    if (response == null || response == undefined) {
      return;
    }

    try{
      const posts = await ctx.getState().ProfilePostForm.model.posts;

      if(posts == null ){
        console.log("POSTS IS NULL")
        return;
      }

      const index = await posts.findIndex(x => x._id == response._id)

      posts[index] = response;

      ctx.patchState({
        ProfilePostForm: {
          model: {
            posts: posts
          }
        }
      })
    }

    catch(error){
      console.log(error)
    }

  }
  @Action(GetComments)
  async getComments(ctx: StateContext<ProfileCommentModel>, {username}: GetComments){
    const response = await this.profileApi.getComments(username);

    if(response == null || response == undefined){
      return;
    }

    console.log(response);

    ctx.setState({
      ProfileCommentForm: {
        model: {
          comments: response
        }
      }
    })
  }

  @Action(DeletePost)
  async deletePost(ctx: StateContext<ProfilePostModel>, {postId}: DeletePost){
    const response = await this.profileApi.deletePost(postId);

    if(response == null || response == undefined){
      return;
    }

    const posts = ctx.getState().ProfilePostForm.model.posts;

    if(posts == null ){
      return
    }

    const index = posts?.findIndex(x => x._id == response)

    posts.splice(index, 1);

    ctx.setState({
      ProfilePostForm: {
        model: {
          posts: posts
        }
      }
    })
  }

  @Action(DeleteComment)
  async deleteComment(ctx: StateContext<ProfileCommentModel>, {commentId}: DeleteComment){
    const response = await this.profileApi.deleteComment(commentId);

    if(response == null || response == undefined){
      return;
    }

    const comments = ctx.getState().ProfileCommentForm.model.comments;

    if(comments == null ){
      return
    }

    const index = comments?.findIndex(x => x._id == response._id)

    comments.splice(index, 1);

    ctx.setState({
      ProfileCommentForm: {
        model: {
          comments: comments
        }
      }
    })
  }

  @Action(DeleteCommunity)
  async deleteCommunity(ctx: StateContext<ProfileStateModel>, {communityName}: DeleteCommunity){
    const response = await this.profileApi.deleteCommunity(communityName);

    if(response == null || response == undefined){
      return;
    }

    const profile = ctx.getState().profile;

    if(profile == null){
      return;
    }

    const index = profile.communities.findIndex(x => x == response);

    profile.communities.splice(index, 1);

    ctx.setState({
      profile: profile
    })
  }

  @Action(AddFollowing)
  async addFollowing(ctx: StateContext<ProfileStateModel>, {username, followingUsername}: AddFollowing){
    const response = await this.profileApi.addFollowing(username, followingUsername);

    if(response == null || response == undefined){
      return;
    }

    ctx.setState({
      profile: response
    })
  }

  @Action(RemoveFollowing)
  async removeFollowing(ctx: StateContext<ProfileStateModel>, {username, followingUsername}: RemoveFollowing){
    const response = await this.profileApi.removeFollowing(username, followingUsername);

    if(response == null || response == undefined){
      return;
    }

    ctx.setState({
      profile: response
    })
  }

  // @Action(GetFollowers)
  // async getFollowers(ctx: StateContext<OtherUsers>, {followerList}: GetFollowers){
  //   let followers: ProfileDto[] = [];

  //   followerList.forEach(async element => {
  //     const item = await this.profileApi.getProfile(element)

  //     if(item != null && item != undefined){
  //       followers = [...followers, item];

  //       ctx.setState({
  //         OtherUsersForm: {
  //           model: {
  //             otherUsers: followers
  //           }
  //         }
  //       })
  //     }
  //   });
  // }

  // @Action(GetFollowing)
  // async getFollowing(ctx: StateContext<OtherUsers>, {followingList}: GetFollowing){
  //   let following: ProfileDto[] = [];

  //   followingList.forEach(async element => {
  //     const item = await this.profileApi.getProfile(element)

  //     if(item != null && item != undefined){
  //       following = [...following, item];

  //       ctx.setState({
  //         OtherUsersForm: {
  //           model: {
  //             otherUsers: following
  //           }
  //         }
  //       })
  //     }
  //   });
  // }

  async getFollowers(followerList: string[]){
    const followers: ProfileDto[] = [];
  
    await Promise.all(
      followerList.map(async (element) => {
        const item = await this.profileApi.getProfile(element);
  
        if (item != null && item != undefined) {
          followers.push(item);
        }
      })
    );
  
    console.log(followers);
  
    return followers;
  }

  // @Action(GetFollowing)
  async getFollowing(followingList: string[]): Promise<ProfileDto[]> {
    const following: ProfileDto[] = [];
  
    await Promise.all(
      followingList.map(async (element) => {
        const item = await this.profileApi.getProfile(element);
  
        if (item != null && item != undefined) {
          following.push(item);
        }
      })
    );
  
    console.log(following);
  
    return following;
  }

  @Action(RemoveCommunity)
  async removeCommunity(ctx: StateContext<ProfileStateModel>, {communityName, username}: RemoveCommunity){
    const response = await this.profileApi.removeCommunity(username, communityName);

    if(response == null || response == undefined){
      return;
    }

    const profile = ctx.getState().profile;

    if(profile == null){
      return;
    }

    const index = profile.communities.findIndex(x => x == communityName);

    profile.communities.splice(index, 1);

    ctx.setState({
      profile: profile
    })
  }

  @Action(AddCommunity)
  async addCommunity(ctx: StateContext<ProfileStateModel>, {communityName, username} : AddCommunity){
    const response = await this.profileApi.addCommunity(username, communityName);

    if(response == null || response == undefined){
      return;
    }

    const profile = ctx.getState().profile;

    if(profile == null){
      return;
    }

    // profile.communities = [...profile.communities, communityName];

    ctx.setState({
      profile: response
    })
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
    return state.profile;
  }

  @Selector()
  static posts(state: ProfilePostModel){
    return state.ProfilePostForm.model.posts;
  }

  @Selector()
  static comments(state: ProfileCommentModel){
    return state.ProfileCommentForm.model.comments;
  }

  @Selector()
  static otherUsers(state: OtherUsers){
    return state.OtherUsersForm.model.otherUsers;
  }
}