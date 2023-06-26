import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ProfileDto, UpdateProfileRequest } from "@encompass/api/profile/data-access";
import { Observable } from "rxjs";
import { PostDto, UpdatePostRequest } from "@encompass/api/post/data-access";
import { CommentDto } from "@encompass/api/comment/data-access";

@Injectable()
export class ProfileApi{
  constructor(private httpClient: HttpClient){}
  
  user$(id: string) : Observable<ProfileDto>{
    return this.httpClient.get<ProfileDto>('/api/profile/' + id)
  }

  updateProfile(updateProfileRequest: UpdateProfileRequest, userId: string){
    try{
      const response = this.httpClient.patch<ProfileDto>('/api/profile/' + userId, updateProfileRequest).toPromise();

      return response;
    }

    catch(error){
      return null;
    }
  }

  async getPosts(username: string){
    try{
      const response = await this.httpClient.get<PostDto[]>('/api/post/get-by-user/' + username).toPromise();

      return response;
    }

    catch(error){
      return null;
    }
  }

  async updatePost(post: UpdatePostRequest, postId: string){
    try{
      const response = await this.httpClient.patch<PostDto>('/api/post/' + postId, post).toPromise();
      return response;
    }
    catch(error){
      return null;
    }
  }

  async getComments(username: string){
    try{
      const response = await this.httpClient.get<CommentDto[]>('/api/comment/username/' + username).toPromise();

      return response;
    }

    catch(error){
      console.log(error);

      return null;
    }
  }
}