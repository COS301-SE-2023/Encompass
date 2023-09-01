import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommunityDto } from "@encompass/api/community/data-access";
import { CreateEventRequest, EventDto } from "@encompass/api/event/data-access";
import { CreatePostRequest, PostDto } from "@encompass/api/post/data-access";

export interface fileReturn{
  key: string,
  url: string;
}
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
  
  async createEvent(request: CreateEventRequest){
    try{
      const response = await this.httpClient.post<EventDto>('/api/event/create', request).toPromise();

      return response;
    }

    catch(error){
      console.log(error);
      return null;
    }
  }

  async uploadFile(request: FormData) : Promise<string | null>{
    try {

      // console.log("HERE")
      const response = await this.httpClient.post<fileReturn>('/api/post/upload-image', request).toPromise();

      if(response == null){
        return null
      }

      return response.url;
    } 
    catch (error) 
    {
      console.log(error);
      return null;
    }
  }

  async getCommunity(communtiyName: string){
    try {
      const response = await this.httpClient.get<CommunityDto>('/api/community/get-community/' + communtiyName).toPromise();

      return response;
    } 
    catch (error) 
    {
      return null;
    }
  }
}