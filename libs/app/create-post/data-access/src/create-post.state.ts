import { Injectable } from "@angular/core";
import { PostDto } from "@encompass/api/post/data-access"
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { CreatePostApi } from "./create-post.api";
import { CreatePost, UploadFile } from "@encompass/app/create-post/util";
import { AddPost } from "@encompass/app/create-community/util";

export interface PostStateModel {
  PostForm:{
    model: {
      post: PostDto | null;
    }
  }
}

export interface CreateFileModel{
  CreateFileForm:{
    model: {
      url: string | null;
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

@State<CreateFileModel>({
  name: 'createFile',
  defaults: {
    CreateFileForm: {
      model: {
        url: null
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

    ctx.dispatch(new AddPost(post.community, post._id));
  }

  @Action(UploadFile)
  async uploadFile(ctx: StateContext<CreateFileModel>, {file}: UploadFile){
    // console.log("Here")
    const response = await this.createPostApi.uploadFile(file);

    console.log(response);

    if(response == null || response == undefined){
      return;
    }

    ctx.setState({
      CreateFileForm: {
        model: {
          url: response.url
        }
      }
    })
  }

  @Selector()
  static post(state: PostStateModel){
    return state.PostForm.model.post;
  }

  @Selector()
  static url(state: CreateFileModel){
    return state.CreateFileForm.model.url;
  }
}