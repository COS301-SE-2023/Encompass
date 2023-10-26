import { Injectable } from "@angular/core";
import { CommunityDto } from "@encompass/api/community/data-access"
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { CreateCommunityApi } from "./create-community.api";
import { CreateCommunity, CheckCommunity, AddPost, UploadFile, AddEvent } from "@encompass/app/create-community/util";
import { UpdateProfile } from "@encompass/app/profile/util";
import { ToastController } from "@ionic/angular";
import { CommunityRequestDto } from "@encompass/api/community-request/data-access";

export interface CommunityStateModel {
  CommunityForm:{
    model: {
      community: CommunityDto | null;
    }
  }
}

// export interface FileUpload{
//   url: string | null;
// }
// export interface CommunityFileModel{
//   CommunityFileForm:{
//     model: {
//         communityUrl: FileUpload | null,
//       }
//     }
//   }

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

// @State<CommunityFileModel>({
//   name: 'communityFile',
//   defaults: {
//     CommunityFileForm: {
//       model: {
//         communityUrl: null
//       }
//     }
//   }
// })

@Injectable()
export class CreateCommunityState{
  constructor(private createCommunityApi: CreateCommunityApi, private readonly toastController: ToastController){}

  @Action(CreateCommunity)
  async createCommunity(ctx: StateContext<CommunityStateModel>, {createCommunityRequest, profile}: CreateCommunity){
   
    const variable = await this.checkCommunity(ctx, {request: createCommunityRequest.name});
   
    if(!variable)
    {
      const community = await this.createCommunityApi.createCommunity(createCommunityRequest);
    
      // console.log(community);
      
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
      
      if(community.type !== 'Public'){
        await this.createCommunityApi.createCommunityRequest(community._id)
      }

      let arr1;

      if(profile.communities != null){
        arr1 = [...profile.communities, community.name];
      }

      else{
        arr1 = [community.name];
      }

      // console.log(arr1);

      const request = {
        username: profile.username,
        name: profile.name,
        lastName: profile.lastName,
        categories: profile.categories,
        communities: arr1,
        awards: profile.awards,
        events: profile.events,
        followers: profile.followers,
        following: profile.following,
        posts: profile.posts,
        reviews: profile.reviews,
        profileImage: profile.profileImage,
        profileBanner: profile.profileBanner,
        bio: profile.bio,
      }

      // console.log(profile._id);
      ctx.dispatch(new UpdateProfile(request, profile._id))

      const toast = await this.toastController.create({
        message: 'Community created successfully',
        duration: 2000,
        color: 'success'
      })

      await toast.present();
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

  @Action(AddEvent)
  async addEvent(ctx: StateContext<CommunityStateModel>, {username, eventId} : AddEvent){
    const response = await this.createCommunityApi.addEvent(username, eventId);

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

  

  // @Action(UploadFile)
  // async uploadFile(ctx: StateContext<CommunityFileModel>, {file}: UploadFile){
  //   const response = await this.createCommunityApi.uploadFile(file);

  //   console.log(response);

  //   if(response == null || response == undefined){
  //     return;
  //   }

  //   ctx.setState({
  //     CommunityFileForm: {
  //       model: {
  //         communityUrl: {url: response.url}
  //       }
  //     }
  //   })
  // }

  // @Selector()
  // static communityUrl(state: CommunityFileModel){
  //   return state.CommunityFileForm.model.communityUrl;
  // } 
}