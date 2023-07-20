import { Injectable } from "@angular/core";
import { HomeApi } from "./home.api";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { GetAllPosts, GetNotifications, SendNotification, UpdatePost, getHome } from "@encompass/app/home-page/util";
import { HomeDto } from "@encompass/api/home/data-access";
import { PostDto } from "@encompass/api/post/data-access";
import { NotificationDto } from "@encompass/api/notifications/data-access";

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

  @Action(GetAllPosts)
  async getAllPosts(ctx: StateContext<HomePostsModel>, {userId}: GetAllPosts){
    const response = await this.homeApi.getAllPosts(userId);
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

  @Action(SendNotification)
  async sendNotification(ctx: StateContext<HomeNotificationsModel>, {userId, notification}: SendNotification){
    await this.homeApi.sendNotification(userId, notification);
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