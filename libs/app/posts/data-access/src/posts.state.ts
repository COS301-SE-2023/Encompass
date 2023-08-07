import { Injectable } from "@angular/core";
import { PostDto } from "@encompass/api/post/data-access";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { PostsApi } from "./posts.api";
import { GetPost, UpdatePost } from "@encompass/app/posts/util";

export interface PostStateModel {
  PostForm: {
    model: {
      post: PostDto | null;
    };
  };
}

@State<PostStateModel>({
  name: "post",
  defaults: {
    PostForm: {
      model: {
        post: null,
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

  @Selector()
  static post(state: PostStateModel){
    return state.PostForm.model.post;
  }
}