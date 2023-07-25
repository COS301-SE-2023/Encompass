import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommunityDto } from '@encompass/api/community/data-access';

@Injectable()
export class SignUpCommunitiesApi{
  constructor(private httpClient: HttpClient){}

  async getCommunities(userId: string){
    try{
      const response = await this.httpClient.get<CommunityDto[]>('/api/community/get-recommended-communities/' + userId).toPromise();
      return response;
    }
    catch(error){
      return null;
    }
  }
}