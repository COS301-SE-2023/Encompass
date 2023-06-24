import { Injectable } from "@angular/core";
import { CommunityDto } from "@encompass/api/community/data-access"
import { Action, State, StateContext } from "@ngxs/store";
import { CreateCommunityApi } from "./create-community.api";
import { CreateCommunity, CheckCommunity, AddPost } from "@encompass/app/create-community/util";
import { UpdateProfile } from "@encompass/app/profile/util";
import { ToastController } from "@ionic/angular";

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
  constructor(private createCommunityApi: CreateCommunityApi, private readonly toastController: ToastController){}

  @Action(CreateCommunity)
  async createCommunity(ctx: StateContext<CommunityStateModel>, {createCommunityRequest, profile}: CreateCommunity){
   
    const variable = await this.checkCommunity(ctx, {request: createCommunityRequest.name});
   
    if(!variable)
    {
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
    
    else{
      const toast = await this.toastController.create({
        message: 'Community already exists',
        duration: 2000,
        color: 'danger'
      })

      await toast.present();
    }
  }

  @Action(CheckCommunity)
  async checkCommunity(ctx: StateContext<CommunityStateModel>, {request}: CheckCommunity){
    const response = await this.createCommunityApi.checkCommunity(request);

    return response;
  }

  @Action(AddPost)
  async addPost(ctx: StateContext<CommunityStateModel>, {name, id} : AddPost){
    const response = await this.createCommunityApi.addPost(name, id);

    if(response == null || response == undefined){
      return;
    }

    ctx.patchState({
      CommunityForm: {
        model:{
          community: response
        }
      }
    })
  }
}