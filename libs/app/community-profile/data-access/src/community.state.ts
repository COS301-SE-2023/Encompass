import { CommunityDto } from '@encompass/api/community/data-access';
import { Selector, State } from '@ngxs/store';
import { AddCommunityRequest, GetCommunity, GetCommunityPosts, GetCommunityRequest, RemoveCommunityRequest, UpdateCommunity } from '@encompass/app/community-profile/util';
import { CommunityApi } from './community.api';
import { Action } from '@ngxs/store';
import { StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { PostDto } from '@encompass/api/post/data-access';
import { CommunityRequestDto } from '@encompass/api/community-request/data-access';


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

export interface CommunityRequestModel{
  CommunityRequestForm:{
    model:{
      communityRequest: CommunityRequestDto | null
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

@State<CommunityRequestModel>({
  name: 'communityRequest',
  defaults:{
    CommunityRequestForm:{
      model:{
        communityRequest: null
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

  @Action(UpdateCommunity)
  async updateCommunity(ctx: StateContext<CommunityStateModel>, {communityId, updateCommunityRequest}: UpdateCommunity){
    const response = await this.communityApi.updateCommunity(communityId, updateCommunityRequest);

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

  @Action(GetCommunityRequest)
  async getCommunityRequest(ctx: StateContext<CommunityRequestModel>, {communityId}: GetCommunityRequest){
    const response = await this.communityApi.getCommunityRequest(communityId);

    if(response == null || response == undefined){
      return;
    }

    ctx.setState({
      CommunityRequestForm:{
        model:{
          communityRequest: response
        }
      }
    })
  }

  @Action(AddCommunityRequest)
  async addCommunityRequest(ctx: StateContext<CommunityRequestModel>, {communityId, username}: AddCommunityRequest){
    const response = await this.communityApi.addCommunityRequest(communityId, username);

    if(response == null || response == undefined){
      return;
    }

    ctx.setState({
      CommunityRequestForm:{
        model:{
          communityRequest: response
        }
      }
    })
  }

  @Action(RemoveCommunityRequest)
  async removeCommunityRequest(ctx: StateContext<CommunityRequestModel>, {communityId, username}: RemoveCommunityRequest){
    const response = await this.communityApi.removeCommunityRequest(communityId, username);

    if(response == null || response == undefined){
      return;
    }

    ctx.setState({
      CommunityRequestForm:{
        model:{
          communityRequest: response
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

  @Selector()
  static communityRequest(state: CommunityRequestModel){
    return state.CommunityRequestForm.model.communityRequest
  }
}