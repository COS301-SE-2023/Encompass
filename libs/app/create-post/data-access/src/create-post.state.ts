import { Injectable } from "@angular/core";
import { PostDto } from "@encompass/api/post/data-access"
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { CreatePostApi } from "./create-post.api";
import { CreateEvent, CreatePost, UploadFile } from "@encompass/app/create-post/util";
import { AddEvent, AddPost } from "@encompass/app/create-community/util";
import { UpdateProfile } from "@encompass/app/profile/util";
import { ToastController } from "@ionic/angular";

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
      profileImage: profile.profileImage,
      profileBanner: profile.profileBanner,
      bio: profile.bio,
    }

    ctx.dispatch(new UpdateProfile(data, profile._id));

    const toast = await this.toastController.create({
      message: 'Post Created',
      duration: 2000,
      color: 'success'
    })

    await toast.present();
  }

  @Action(CreateEvent)
  async createEvent(ctx: StateContext<PostStateModel>, {createEventRequest, profile}: CreateEvent){
    const toast1 = await this.toastController.create({
      message: 'Creating Event',
      color: 'success'
    })

    toast1.present();

    const event = await this.createPostApi.createEvent(createEventRequest);

    console.log(event);

    if(event == null || event == undefined){
      return;
    }

    ctx.dispatch(new AddEvent(event._id, event.community));

    this.createPostApi.addToUserEvents(profile._id, event._id);

    let arr;

    if(profile.events == null){
      arr = [event._id];
    }

    else{
      arr = [...profile.events, event._id];
    }

    const data  = {
      username: profile.username,
      name: profile.name,
      lastName: profile.lastName,
      categories: profile.categories,
      communities: profile.communities,
      awards: profile.awards,
      events: arr,
      followers: profile.followers,
      following: profile.following,
      posts: profile.posts,
      reviews: profile.reviews,
      profileImage: profile.profileImage,
      profileBanner: profile.profileBanner,
      bio: profile.bio,
    }

    ctx.dispatch(new UpdateProfile(data, profile._id));

    const toast = await this.toastController.create({
      message: 'Event Created',
      duration: 5000,
      color: 'success'
    })

    await toast.present();
  }

  getAdminCommunities(communities: string[], profile: string){
    const arr: string[] = [];

    communities.forEach(element => {
      this.createPostApi.getCommunity(element).then((response) => {
        if(response?.admin == profile){
          arr.push(element);
        }
      })
    });

    return arr;
  }

  @Selector()
  static post(state: PostStateModel){
    return state.PostForm.model.post;
  }
}