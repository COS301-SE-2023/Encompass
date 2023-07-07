import { CommunityDto } from '@encompass/api/community/data-access';
import { Selector, State } from '@ngxs/store';
import { GetCommunity, GetCommunityPosts } from '@encompass/app/community-profile/util';
import { CommunityApi } from './community.api';
import { Action } from '@ngxs/store';
import { StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { PostDto } from '@encompass/api/post/data-access';


export interface CommunityStateModel{
  CommunityStateForm: {
    model:{
      community: CommunityDto | null
    }
  }
}

export interface CommunityPostsModel{
  CommunityPostForm: {
    model:{
      posts: PostDto[] | null
    }
  }
}

@State<CommunityStateModel>({
  name: 'communityModel',
  defaults: {
    CommunityStateForm: {
      model: {
        community: null
      }
    }
  }
})

@State<CommunityPostsModel>({
  name: 'communityPostsModel',
  defaults: {
    CommunityPostForm: {
      model: {
        posts: null
      }
    }
  }
})

@Injectable()
export class CommunityState{
  constructor(private communityApi: CommunityApi){}
  @Action(GetCommunity)
  async getCommunity(ctx: StateContext<CommunityStateModel>, {name}: GetCommunity){
    const response = await this.communityApi.getCommunity(name);

    if(response == null || response == undefined){
      return;
    }

    ctx.setState({
      CommunityStateForm: {
        model: {
          community: response
        }
      }
    })
  }

  @Action(GetCommunityPosts)
  async getCommunityPosts(ctx: StateContext<CommunityPostsModel>, {name}: GetCommunityPosts){
    const response = await this.communityApi.getCommunityPosts(name);

    if(response == null || response == undefined){
      return;
    }

    ctx.setState({
      CommunityPostForm: {
        model: {
          posts: response
        }
      }
    })
  }


  @Selector()
  static community(state: CommunityStateModel){
    return state.CommunityStateForm.model.community
  }

  @Selector()
  static posts(state: CommunityPostsModel){
    return state.CommunityPostForm.model.posts
  }
}