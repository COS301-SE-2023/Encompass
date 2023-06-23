import { Injectable } from "@angular/core";
import { HomeApi } from "./home.api";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { GetAllPosts, getHome } from "@encompass/app/home-page/util";
import { HomeDto } from "@encompass/api/home/data-access";
import { PostDto } from "@encompass/api/post/data-access";

export interface HomeStateModel{
  HomeForm: {
    model: {
      home: HomeDto | null
    }
  }
}

export interface HomePostsModel{
  HomePostsForm: {
    model: {
      homePosts: PostDto[] | null
    }
  }
}

@State<HomeStateModel>({
  name: 'home',
  defaults: {
    HomeForm: {
      model: {
        home: null
      }
    }
  }
})



@Injectable()
export class HomeState{
  constructor(private homeApi: HomeApi){}

  @Action(getHome)
  async getHome(ctx: StateContext<HomeStateModel>){
    console.log("Here 1")
    // const state = ctx.getState();
    const response = await this.homeApi.getHome();
    //const rsp = response.;
    console.log("Here");
    console.log(response);
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

  @Selector()
  static home(state: HomeStateModel)
  {
    console.log(state.HomeForm.model.home)
    return state.HomeForm.model.home;
  }

  @Selector()
  static homePosts(state: HomePostsModel){
    return state.HomePostsForm.model.homePosts;
  }
}