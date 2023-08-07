import { Injectable } from "@angular/core";
import { PostDto } from "@encompass/api/post/data-access";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { PostsApi } from "./posts.api";
import { GetCommunityPosts, GetPost, UpdatePost } from "@encompass/app/posts/util";

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

  @Action(GetCommunityPosts)
  async getCommunityPosts(ctx: StateContext<PostArrayStateModel>, {name}: GetCommunityPosts){
    const response = await this.postsApi.getCommunityPosts(name);

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

  @Selector()
  static post(state: PostStateModel){
    return state.PostForm.model.post;
  }
  
  @Selector()
  static posts(state: PostArrayStateModel){
    return state.PostArrayForm.model.posts;
  }
}