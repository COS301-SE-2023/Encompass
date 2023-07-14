import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommunityDto, UpdateCommunityRequest } from '@encompass/api/community/data-access';
import { PostDto } from '@encompass/api/post/data-access';

export interface fileReturn{
  key: string,
  url: string;
}

@Injectable()
export class CommunityApi {
  constructor(private httpClient: HttpClient) {}

  async getCommunity(name: string) {
    try{
      const response = await this.httpClient.get<CommunityDto>('/api/community/get-community/' + name).toPromise();

      return response;
    }

    catch(error){
      console.log(error);

      return null;
    }
  }

  async getCommunityPosts(name: string) {
    try{
      const response = await this.httpClient.get<PostDto[]>('/api/post/get-by-community/' + name).toPromise();

      return response;
    }

    catch(error){
      console.log(error);

      return null;
    }
  }

  async updateCommunity(communityId: string, updateCommunityRequest: UpdateCommunityRequest) {
    try{
      const response = await this.httpClient.patch<CommunityDto>('/api/community/' + communityId, updateCommunityRequest).toPromise();

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
      const response = await this.httpClient.post<fileReturn>('/api/community/upload-image', request).toPromise();

      if(response == null){
        return null;
      }
      
      return response.url;
    } 
    catch (error) 
    {
      console.log(error);
      return null;
    }
  }
}