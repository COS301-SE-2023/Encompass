import { Injectable } from "@angular/core";
import { PostDto } from "@encompass/api/post/data-access";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { PostsApi } from "./posts.api";
import { GetAllPosts, GetLatestPosts, GetPopularPosts, GetPost, UpdatePost, UpdatePostArray } from "@encompass/app/posts/util";

export interface PostStateModel {
  PostForm: {
    model: {
      post: PostDto | null;
    };
  };
}

export interface PostArrayStateModel{
  PostArrayForm: {
    model: {
      posts: PostDto[] | null;
    };
  };
}

@State<PostStateModel>({
  name: "posts",
  defaults: {
    PostForm: {
      model: {
        post: null,
      },
    },
  },
})

@State<PostArrayStateModel>({
  name: "postsArray",
  defaults: {
    PostArrayForm: {
      model: {
        posts: null,
      },
    },
  },
})

@Injectable()
export class PostsState {
  constructor(private postsApi: PostsApi) {}

  @Action(UpdatePost)
  async updatePost(ctx: StateContext<PostStateModel>, { postId, postUpdateRequest }: UpdatePost) {
    const response = await this.postsApi.updatePost(postId, postUpdateRequest);

    if (response == null || response == undefined) {
      return;
    }

    ctx.setState({
      PostForm: {
        model: {
          post: response,
        },
      },
    });
  }

  @Action(GetPost)
  async getPost(ctx: StateContext<PostStateModel>, { postId }: GetPost) {
    const response = await this.postsApi.getPost(postId);

    if (response == null || response == undefined) {
      return;
    }

    ctx.setState({
      PostForm: {
        model: {
          post: response,
        },
      },
    });
  }

  // @Action(GetCommunityPosts)
  // async getCommunityPosts(ctx: StateContext<PostArrayStateModel>, {name}: GetCommunityPosts){
  //   const response = await this.postsApi.getCommunityPosts(name);

  //   if(response == null || response == undefined){
  //     return;
  //   }

  //   ctx.setState({
  //     PostArrayForm: {
  //       model: {
  //         posts: response
  //       }
  //     }
  //   })
  // }

  @Action(GetLatestPosts)
  async getLatestPosts(ctx: StateContext<PostArrayStateModel>, {username}: GetLatestPosts){
    const response = await this.postsApi.getLatestPosts(username);

    if(response == null || response == undefined){
      return;
    }

    ctx.setState({
      PostArrayForm: {
        model: {
          posts: response
        }
      }
    })
  }

  @Action(GetPopularPosts)
  async getPopularPosts(ctx: StateContext<PostArrayStateModel>){
    const response = await this.postsApi.getPopularPosts();

    if(response == null || response == undefined){
      return;
    }

    ctx.setState({
      PostArrayForm: {
        model: {
          posts: response
        }
      }
    })
  }

  @Action(GetAllPosts)
  async getAllPosts(ctx: StateContext<PostArrayStateModel>, {username}: GetAllPosts){
    const response = await this.postsApi.getRecommendPosts(username);

    if(response == null || response == undefined){
      return;
    }

    ctx.setState({
      PostArrayForm: {
        model: {
          posts: response
        }
      }
    })
  }

  @Action(UpdatePostArray)
  async updatePostArray(ctx: StateContext<PostArrayStateModel>, {postId, postUpdateRequest}: UpdatePostArray){
    const response = await this.postsApi.updatePost(postId, postUpdateRequest);

    if(response == null || response == undefined){
      return;
    }

    try{
      const posts = await ctx.getState().PostArrayForm.model.posts;

      if(posts == null ){
        console.log("POSTS IS NULL")
        return;
      }

      const index = await posts.findIndex(x => x._id == response._id)

      console.log(posts[index])

      posts[index] = response;

      console.log(posts[index])

      ctx.patchState({
        PostArrayForm: {
          model: {
            posts: posts
          }
        }
      })
    }

    catch(error){
      console.log(error)
    }
  }

  @Selector()
  static post(state: PostStateModel){
    return state.PostForm.model.post;
  }
  
  @Selector()
  static posts(state: PostArrayStateModel){
    return state.PostArrayForm.model.posts;
  }
}