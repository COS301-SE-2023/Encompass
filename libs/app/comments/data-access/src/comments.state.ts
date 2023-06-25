import { CommentDto } from '@encompass/api/comment/data-access';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { CommentsApi } from './comments.api';
import { GetComments, AddReply, AddComment } from '@encompass/app/comments/util';

export interface CommentStateModel {
  CommentForm:{
    model: {
      comments: CommentDto[] | null;
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
    const response = await this.commentsApi.addComment(comment);

    if(response == null || response == undefined){
      return;
    }

    ctx.patchState({
      CommentForm: {
        model: {
          comments: response
        }
      }
    })
  }

  @Action(AddReply)
  async addReply(ctx: StateContext<CommentStateModel>, {comment, commentId}: AddReply){
    const response = await this.commentsApi.addReply(comment, commentId);

    if(response == null || response == undefined){
      return;
    }

    ctx.patchState({
      CommentForm: {
        model: {
          comments: response
        }
      }
    })
  }

  @Selector()
  static comments(state: CommentStateModel){
    return state.CommentForm.model.comments;
  }
}