import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CreatePostRequest, PostDto } from "@encompass/api/post/data-access";

@Injectable()
export class CreatePostApi{
  constructor(private httpClient: HttpClient){}

  async createPost(request: CreatePostRequest){
    try {
      const response = await this.httpClient.post<PostDto>('/api/post/create', request).toPromise();

      return response;
    } 
    catch (error) 
    {
      return null;
    }
  }  
}