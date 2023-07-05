import { CommunityDto } from '@encompass/api/community/data-access';
import { Selector, State } from '@ngxs/store';
import { GetCommunity } from '@encompass/app/community-profile/util';
import { CommunityApi } from './community.api';
import { Action } from '@ngxs/store';
import { StateContext } from '@ngxs/store';


export interface CommunityStateModel{
  CommunityStateForm: {
    model:{
      community: CommunityDto | null
    }
  }
}

@State<CommunityStateModel>({
  name: 'community',
  defaults: {
    CommunityStateForm: {
      model: {
        community: null
      }
    }
  }
})

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

  @Selector()
  static community(state: CommunityStateModel){
    return state.CommunityStateForm.model.community
  }
}