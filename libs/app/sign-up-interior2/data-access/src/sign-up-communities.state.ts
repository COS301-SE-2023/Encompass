import { Injectable } from "@angular/core"
import { CommunityDto } from "@encompass/api/community/data-access"
import { Action, Selector, State, StateContext } from "@ngxs/store"
import { SignUpCommunitiesApi } from "./sign-up-communities.api"
import { GetCommunities } from "@encompass/app/sign-up-interior2/util"

export interface SignUpCommunitiesStateModel{
  CommunitiesForm: {
    model: {
      communities: CommunityDto[] | null
    }
  }
}

@State<SignUpCommunitiesStateModel>({
  name: 'signUpCommunitiesModel',
  defaults: {
    CommunitiesForm: {
      model: {
        communities: null
      }
    }
  }
})

@Injectable()
export class SignUpCommunitiesState{
  constructor(private signUpCommunitiesApi: SignUpCommunitiesApi){}

  @Action(GetCommunities)
  async getCommunities(ctx: StateContext<SignUpCommunitiesStateModel>, {userId, username}: GetCommunities){
    console.log("herer")
    const response = await this.signUpCommunitiesApi.getCommunities(userId, username);

    if(response == null || response == undefined){
      return;
    }

    ctx.setState({
      CommunitiesForm: {
        model: {
          communities: response
        }
      }
    })
  }
  
  @Selector()
  static getCommunities(state: SignUpCommunitiesStateModel){
    return state.CommunitiesForm.model.communities;
  }
}