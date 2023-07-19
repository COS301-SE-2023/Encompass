import { CommentDto } from '@encompass/api/comment/data-access';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { CommentsApi } from './comments.api';
import { GetComments, AddReply, AddComment, GetPost, UpdatePost, SendNotification } from '@encompass/app/comments/util';
import { PostDto } from '@encompass/api/post/data-access';
import { SendNotification as HomeSendNotification } from '@encompass/app/home-page/util';

export interface CommentStateModel {
  CommentForm:{
    model: {
      comments: CommentDto[] | null;
    }
  }
}

export interface CommentPostModel{
  CommentPostForm:{
    model: {
      post: PostDto | null;
    }
  }
}

@State<CommentStateModel>({
  name: 'comments',
  defaults: {
    CommentForm: {
      model: {
        comments: null
      }
    }
  }
})

@State<CommentPostModel>({
  name: 'commentPost',
  defaults: {
    CommentPostForm: {
      model: {
        post: null
      }
    }
  } 
})

@Injectable()
export class CommentsState{
  constructor(private commentsApi: CommentsApi){}

  @Action(GetComments)
  async getComments(ctx: StateContext<CommentStateModel>, {postId}: GetComments){
    const response = await this.commentsApi.getComments(postId);

    if(response == null || response == undefined){
      return;
    }

    ctx.setState({
      CommentForm: {
        model: {
          comments: response
        }
      }
    })
  }

  @Action(AddComment)
  async addComment(ctx: StateContext<CommentStateModel>, {comment}: AddComment){

    const old = ctx.getState().CommentForm.model.comments;

    const response = await this.commentsApi.addComment(comment);

    if(response == null || response == undefined){
      return;
    }

    let newComments : CommentDto[];

    if(old == null || old == undefined){
      newComments = [response];
    }

    else{
      newComments = [...old, response];
    }

    ctx.patchState({
      CommentForm: {
        model: {
          comments: newComments
        }
      }
    })
  }

  @Action(AddReply)
  async addReply(ctx: StateContext<CommentStateModel>, {comment, commentId}: AddReply){
    const old = ctx.getState().CommentForm.model.comments;
    
    const response = await this.commentsApi.addReply(comment, commentId);

    if(response == null || response == undefined){
      return;
    }

    let newComments : CommentDto[];

    if(old == null || old == undefined){
      newComments = [response];
    }

    else{
      newComments = [...old];

      const index = newComments.findIndex(x => x._id == response._id)

      newComments[index] = response;
    }

    ctx.patchState({
      CommentForm: {
        model: {
          comments: newComments
        }
      }
    })
  }

  @Action(GetPost)
  async getPost(ctx: StateContext<CommentPostModel>, {postId}: GetPost){
    const response = await this.commentsApi.getPost(postId);

    if(response == null || response == undefined){
      return;
    }

    ctx.patchState({
      CommentPostForm: {
        model: {
          post: response
        }
      }
    })
  }

  @Action(UpdatePost)
  async updatePost(ctx: StateContext<CommentPostModel>, {postId, postUpdateRequest}: UpdatePost){
    const response = await this.commentsApi.updatePost(postId, postUpdateRequest);

    if(response == null || response == undefined){
      return;
    }

    ctx.patchState({
      CommentPostForm: {
        model: {
          post: response
        }
      }
    })
  }

  @Selector()
  static comments(state: CommentStateModel){
    return state.CommentForm.model.comments;
  }

  @Selector()
  static post(state: CommentPostModel){
    return state.CommentPostForm.model.post;
  }

  @Action(SendNotification)
  async sendNotification(ctx: StateContext<CommentPostModel>, {username, notification}: SendNotification){
    const user = await this.commentsApi.getProfile(username);

    if(user == null || user == undefined){
      return;
    }

    const settings = await this.commentsApi.getProfileSettings(user._id)

    if(settings == null || settings == undefined){
      return;
    }

    if(settings.notifications.dms !== false){
      ctx.dispatch(new HomeSendNotification(user._id, notification));
    }
  }
}