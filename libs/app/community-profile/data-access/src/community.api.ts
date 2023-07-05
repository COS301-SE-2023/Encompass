import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommunityDto } from '@encompass/api/community/data-access';

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
}