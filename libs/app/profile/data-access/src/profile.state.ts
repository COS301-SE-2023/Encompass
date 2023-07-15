import { AccountDto } from "@encompass/api/account/data-access"
import { Action, Selector, State, StateContext, Store } from "@ngxs/store"
import { Injectable } from "@angular/core"
import { ProfileApi } from "./profile.api"
import { SubscribeToProfile, SetProfile, UpdateProfile, GetPosts, UpdatePost, GetComments, DeletePost, DeleteComment, DeleteCommunity, AddFollowing, RemoveFollowing } from "@encompass/app/profile/util"
import { SignUpState } from "@encompass/app/sign-up/data-access"
import { LoginState } from "@encompass/app/login/data-access"
import { profile } from "console"
import { ProfileDto } from "@encompass/api/profile/data-access"
import { tap } from "rxjs"
import { produce } from "immer"
import { set } from "mongoose"
import { PostDto } from "@encompass/api/post/data-access"
import { CommentDto } from "@encompass/api/comment/data-access"
import { CommunityDto } from "@encompass/api/community/data-access"

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
  name: 'profilePost',
  defaults: {
    ProfilePostForm: {
      model: {
        posts: null
      }
    }
  }
})

@State<ProfileCommentModel>({
  name: 'profileComment',
  defaults: {
    ProfileCommentForm: {
      model: {
        comments: null
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

    ctx.patchState({
      profile: response
    })
  }

  @Action(GetPosts)
  async getPosts(ctx: StateContext<ProfilePostModel>, {username}: GetPosts){
    const response = await this.profileApi.getPosts(username);
    
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
    const response = await this.profileApi.updatePost(updateRequest, postId);

    if(response == null || response == undefined){
      return;
    }

    const posts = ctx.getState().ProfilePostForm.model.posts;

    if(posts == null ){
      return
    }

    const index = posts?.findIndex(x => x._id == response._id)

    posts[index] = response;

    ctx.setState({
      ProfilePostForm: {
        model: {
          posts: posts
        }
      }
    })
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

    const index = comments?.findIndex(x => x._id == response)

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
}