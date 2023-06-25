import { Injectable } from "@angular/core";
import { PostDto } from "@encompass/api/post/data-access"
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { CreatePostApi } from "./create-post.api";
import { CreatePost, UploadFile } from "@encompass/app/create-post/util";
import { AddPost } from "@encompass/app/create-community/util";
import { UpdateProfile } from "@encompass/app/profile/util";
import { ToastController } from "@ionic/angular";

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
  constructor(private createPostApi: CreatePostApi, private toastController: ToastController){}

  @Action(CreatePost)
  async createPost(ctx: StateContext<PostStateModel>, {createPostRequest, profile}: CreatePost){
    const communtiy = await this.createPostApi.getCommunity(createPostRequest.community);

    if(communtiy != undefined){
      createPostRequest.communityImageUrl = communtiy?.groupImage;
    }
    
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

    let arr;

    if(profile.posts == null){
      arr = [post._id];
    }

    else{
      arr = [...profile.posts, post._id];
    }

    const data  = {
      username: profile.username,
      name: profile.name,
      lastName: profile.lastName,
      categories: profile.categories,
      communities: profile.communities,
      awards: profile.awards,
      events: profile.events,
      followers: profile.followers,
      following: profile.following,
      posts: arr,
      reviews: profile.reviews,
    }

    ctx.dispatch(new UpdateProfile(data, profile._id));

    const toast = await this.toastController.create({
      message: 'Post Created',
      duration: 2000,
      color: 'success'
    })

    await toast.present();
  }

  @Action(UploadFile)
  async uploadFile(ctx: StateContext<CreateFileModel>, {file}: UploadFile){
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