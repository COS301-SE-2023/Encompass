import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { PostDto, UpdatePostRequest } from "@encompass/api/post/data-access";

@Injectable()
export class PostsApi{
  constructor(private httpClient: HttpClient){}

  async getPost(postId: string){
    try{
      const response = await this.httpClient.get<PostDto>('/api/post/' + postId).toPromise();

      return response;
    }
    catch(error){
      console.log(error);

      return null;
    }
  }
  
  async updatePost(postId: string, postUpdateRequest: UpdatePostRequest){
    try{
      const response = await this.httpClient.patch<PostDto>('/api/post/' + postId, postUpdateRequest).toPromise();

      return response;
    }

    catch(error){
      console.log(error);

      return null;
    }
  }
}