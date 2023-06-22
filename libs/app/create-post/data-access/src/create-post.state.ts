import { Injectable } from "@angular/core";
import { PostDto } from "@encompass/api/post/data-access"
import { Action, State, StateContext } from "@ngxs/store";
import { CreatePostApi } from "./create-post.api";
import { CreatePost, UploadFile } from "@encompass/app/create-post/util";

export interface PostStateModel {
  PostForm:{
    model: {
      post: PostDto | null;
    }
  }
}

@State<PostStateModel>({
  name: 'post',
  defaults: {
    PostForm: {
      model: {
        post: null
      }
    }
  }
})

@Injectable()
export class CreatePostState{
  constructor(private createPostApi: CreatePostApi){}

  @Action(CreatePost)
  async createPost(ctx: StateContext<PostStateModel>, {createPostRequest}: CreatePost){
    const post = await this.createPostApi.createPost(createPostRequest);
    
    console.log(post);
    
    if(post == null || post == undefined){
      return;
    }

    ctx.patchState({
      PostForm: {
        model: {
          post: post
        }
      }
    })
  }

  @Action(UploadFile)
  async uploadFile(ctx: StateContext<PostStateModel>, {file}: UploadFile){
    console.log("Here")
    const response = await this.createPostApi.uploadFile(file);

    console.log(response);

    return response?.url;
  }

}