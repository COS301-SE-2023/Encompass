import { Injectable } from "@angular/core";
import { HomeApi } from "./home.api";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { GetAllPosts, UpdatePost, getHome } from "@encompass/app/home-page/util";
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