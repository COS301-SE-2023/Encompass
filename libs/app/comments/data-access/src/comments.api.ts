import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CommentDto, AddReplyRequest, CreateCommentRequest } from "@encompass/api/comment/data-access";
import { PostDto, UpdatePostRequest } from "@encompass/api/post/data-access";
import { SettingsDto } from "@encompass/api/settings/data-access";
import { ProfileDto } from "@encompass/api/profile/data-access";

@Injectable()
export class CommentsApi{
  constructor(private httpClient: HttpClient){}

  async getComments(postId: string){
    try{
      const response = await this.httpClient.get<CommentDto[]>('/api/comment/get-post-comments/' + postId).toPromise();

      return response;
    }

    catch(error){
      console.log(error);

      return null;
    }
  }

  async addComment(comment: CreateCommentRequest){
    try{
      const response = await this.httpClient.post<CommentDto>('/api/comment/create', comment).toPromise();

      return response;
    }
    catch(error){
      console.log(error);

      return null;
    }
  }

  async addReply(comment: AddReplyRequest, commentId: string){
    try{
      const response = await this.httpClient.patch<CommentDto>('/api/comment/add-reply/' + commentId, comment).toPromise();

      return response;
    }
    catch(error){
      console.log(error);

      return null;
    }
  }

  // async getPost(postId: string){
  //   try{
  //     const response = await this.httpClient.get<PostDto>('/api/post/' + postId).toPromise();

  //     return response;
  //   }
  //   catch(error){
  //     console.log(error);

  //     return null;
  //   }
  // }

  // async updatePost(postId: string, postUpdateRequest: UpdatePostRequest){
  //   try{
  //     const response = await this.httpClient.patch<PostDto>('/api/post/' + postId, postUpdateRequest).toPromise();

  //     return response;
  //   }

  //   catch(error){
  //     console.log(error);

  //     return null;
  //   }
  // }

  async getProfile(username: string){
    console.log("TIME")
    try{
      const response = this.httpClient.get<ProfileDto>('/api/profile/get-user/' + username).toPromise();

      return response;
    }

    catch(error){
      console.log(error)

      return null;
    }
  }

  async getProfileSettings(userId: string){
    try{
      console.log("HERE")
      const response = this.httpClient.get<SettingsDto>('/api/settings/get/' + userId).toPromise();

      return response;
    }

    catch(error){
      console.log(error)

      return null;
    }
  }
}