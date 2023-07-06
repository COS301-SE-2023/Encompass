import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommunityDto } from '@encompass/api/community/data-access';
import { PostDto } from '@encompass/api/post/data-access';

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
}