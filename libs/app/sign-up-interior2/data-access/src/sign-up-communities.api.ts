import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommunityDto, UpdateCommunityRequest } from '@encompass/api/community/data-access';

@Injectable()
export class SignUpCommunitiesApi{
  constructor(private httpClient: HttpClient){}

  async getCommunities(userId: string, username: string){
    try{
      // console.log(userId)
      const response = await this.httpClient.get<CommunityDto[]>('/api/community/get-recommended-communities/' + userId + '/' + username).toPromise();
      return response;
    }
    catch(error){
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
}