import { Injectable } from "@angular/core";
import { CommunityDto } from "@encompass/api/community/data-access"
import { Action, State, StateContext } from "@ngxs/store";
import { CreateCommunityApi } from "./create-community.api";
import { CreateCommunity } from "@encompass/app/create-community/util";
import { UpdateProfile } from "@encompass/app/profile/util";

export interface CommunityStateModel {
  CommunityForm:{
    model: {
      community: CommunityDto | null;
    }
  }
}

@State<CommunityStateModel>({
  name: 'community',
  defaults: {
    CommunityForm: {
      model: {
        community: null
      }
    }
  }
})

@Injectable()
export class CreateCommunityState{
  constructor(private createCommunityApi: CreateCommunityApi){}

  @Action(CreateCommunity)
  async createCommunity(ctx: StateContext<CommunityStateModel>, {createCommunityRequest, profile}: CreateCommunity){
    const community = await this.createCommunityApi.createCommunity(createCommunityRequest);
    
    console.log(community);
    
    if(community == null || community == undefined){
      return;
    }

    ctx.patchState({
      CommunityForm: {
        model: {
            community: community
        }
      }
    })

    let arr1;

    if(profile.communities != null){
      arr1 = [...profile.communities, community.name];
    }

    else{
      arr1 = [community.name];
    }

    console.log(arr1);

    const request = {
      username: profile.username,
      name: profile.name,
      lastName: profile.lastName,
      categories: profile.category,
      communities: arr1,
      awards: profile.awards,
      events: profile.events,
      followers: profile.followers,
      following: profile.following,
      posts: profile.posts,
      reviews: profile.reviews,
    }

    console.log(profile._id);
    ctx.dispatch(new UpdateProfile(request, profile._id))
  }
}