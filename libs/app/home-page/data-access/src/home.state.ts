import { Injectable } from "@angular/core";
import { HomeApi } from "./home.api";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { GetAllPosts, GetLatestPosts, GetNotifications, GetPopularPosts, GetRecommendedCommunities, UpdatePost, getHome } from "@encompass/app/home-page/util";
import { HomeDto } from "@encompass/api/home/data-access";
import { PostDto } from "@encompass/api/post/data-access";
import { NotificationDto } from "@encompass/api/notifications/data-access";
import { CommunityDto } from "@encompass/api/community/data-access";

export interface HomePostsModel{
  HomePostsForm: {
    model: {
      homePosts: PostDto[] | null
    }
  }
}

export interface HomeNotificationsModel{
  HomeNotificationsForm: {
    model: {
      homeNotifications: NotificationDto | null
    }
  }
}

export interface CommunitiesModel{
  CommunitiesForm: {
    model: {
      communities: CommunityDto[] | null
    }
  }
}

@State<CommunitiesModel>({
  name: 'recommended-comunities',
  defaults: {
    CommunitiesForm: {
      model: {
        communities: null
      }
    }
  }
})

@State<HomePostsModel>({
  name: 'homePosts',
  defaults: {
    HomePostsForm: {
      model: {
        homePosts: null
      }
    }
  }
})

@State<HomeNotificationsModel>({
  name: 'homeNotifications',
  defaults: {
    HomeNotificationsForm: {
      model: {
        homeNotifications: null
      }
    }
  }
})

@Injectable()
export class HomeState{
  constructor(private homeApi: HomeApi){}

  @Action(GetRecommendedCommunities)
  async getRecommendedCommunities(ctx: StateContext<CommunitiesModel>, {userId}: GetRecommendedCommunities){
    const response = await this.homeApi.getRecommendedCommunites(userId);

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


  @Action(GetNotifications)
  async getNotifications(ctx: StateContext<HomeNotificationsModel>, {userId}: GetNotifications){
    const response = await this.homeApi.getNotifications(userId);

    if(response == null || response == undefined){
      return;
    }

    ctx.setState({
      HomeNotificationsForm: {
        model: {
          homeNotifications: response
        }
      }
    })
  }

  @Action(GetLatestPosts)
  async getLatestPosts(ctx: StateContext<HomePostsModel>){
    const response = await this.homeApi.getLatestPosts();
    console.log(response);

    if(response == null || response == undefined){
      return;
    }

    ctx.setState({
      HomePostsForm: {
        model: {
          homePosts: response
        }
      }
    })
  }

  @Action(GetPopularPosts)
  async getPopularPosts(ctx: StateContext<HomePostsModel>){
    const response = await this.homeApi.getPopularPosts();
    console.log(response);

    if(response == null || response == undefined){
      return;
    }

    ctx.setState({
      HomePostsForm: {
        model: {
          homePosts: response
        }
      }
    })
  }

  @Action(GetAllPosts)
  async getAllPosts(ctx: StateContext<HomePostsModel>){
    const response = await this.homeApi.getAllPosts();
    console.log(response);

    if(response == null || response == undefined){
      return;
    }
    
    ctx.setState({
      HomePostsForm: {
        model: {
          homePosts: response
        }
      }
    })
  }

  @Action(UpdatePost)
  async updatePost(ctx: StateContext<HomePostsModel>, {postId, updateRequest}: UpdatePost){
    const response = await this.homeApi.updatePost(updateRequest, postId);

    if(response == null || response == undefined){
      return;
    }

    const posts = ctx.getState().HomePostsForm.model.homePosts;

    if(posts == null ){
      return
    }

    const index = posts?.findIndex(x => x._id == response._id)

    posts[index] = response;

    ctx.setState({
      HomePostsForm: {
        model: {
          homePosts: posts
        }
      }
    })
  }

  @Selector()
  static homePosts(state: HomePostsModel){
    return state.HomePostsForm.model.homePosts;
  }

  @Selector()
  static notifications(state: HomeNotificationsModel){
    return state.HomeNotificationsForm.model.homeNotifications;
  }
}