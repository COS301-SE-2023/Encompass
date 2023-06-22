import { Injectable } from "@angular/core";
import { CommunityDto } from "@encompass/api/community/data-access"
import { Action, State, StateContext } from "@ngxs/store";
import { CreateCommunityApi } from "./create-community.api";
import { CreateCommunity } from "@encompass/app/create-community/util";

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
  async createCommunity(ctx: StateContext<CommunityStateModel>, {createCommunityRequest}: CreateCommunity){
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
  }
}