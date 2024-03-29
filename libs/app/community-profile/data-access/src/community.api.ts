import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommunityLeaderboardDto } from '@encompass/api/community-leaderboard/data-access';
import { CommunityRequestDto } from '@encompass/api/community-request/data-access';
import { CommunityDto, UpdateCommunityRequest } from '@encompass/api/community/data-access';
import { PostDto, UpdatePostRequest } from '@encompass/api/post/data-access';
import { ProfileDto } from '@encompass/api/profile/data-access';

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

  async getCommunityRequest(communityId: string){
    try{
      const response = await this.httpClient.get<CommunityRequestDto>('/api/community-request/find/' + communityId).toPromise();
      // console.log(response)
      return response
    }

    catch(error){
      console.log(error);
      return null
    }
  }

  async addCommunityRequest(communityId: string, username: string){
    try{
      const response = await this.httpClient.patch<CommunityRequestDto>('/api/community-request/add-user/' + communityId + '/' + username, {}).toPromise();

      return response;
    }

    catch(error){
      console.log(error);
      return null;
    }
  }

  async removeCommunityRequest(communityId: string, username: string){
    try{
      const response = await this.httpClient.patch<CommunityRequestDto>('/api/community-request/remove-user/' + communityId + '/' + username, {}).toPromise();

      return response;
    }

    catch(error){
      console.log(error);
      return null;
    }
  }

  async removeCommunity(username: string, communityName: string){
    try{
      const response = await this.httpClient.patch<ProfileDto>('/api/profile/remove-community/' + username + '/' + communityName, {}).toPromise();

      return response;
    }

    catch(error){
      console.log(error);
      return null;
    }
  }

  async addCommunity(username: string, communityName: string){
    try{
      const response = await this.httpClient.patch<ProfileDto>('/api/profile/add-community/' + username + '/' + communityName, {}).toPromise();

      return response;
    }

    catch(error){
      console.log(error);
      return null;
    }
  }

  async getUser(username: string){
    try{
      const response = await this.httpClient.get<ProfileDto>('/api/profile/get-user/' + username).toPromise();

      return response
    }

    catch(error){
      console.log(error);

      return null;
    }
  }

  async addCoins(username: string, amount: number){
    try{
      const response = await this.httpClient.patch<ProfileDto>('/api/profile/add-coins/' + username + '/' + amount, null).toPromise();

      return response;
    }

    catch(error){
      console.log(error);
      return null;
    }
  }

  async getRanking(){
    try{
      const response = await this.httpClient.get<CommunityLeaderboardDto[]>('/api/community-leaderboard/leaderboard').toPromise();

      return response;
    }

    catch(error){
      console.log(error);
      return null;
    }
  }

  async dislikePost(postId: string, userId: string){
    try{
      const response = await this.httpClient.patch<PostDto>('/api/post/dislike/' + userId + '/' + postId, null).toPromise();

      return response;
    }

    catch(error){
      console.log(error);

      return null;
    }
  }

  async likePost(postId: string, userId: string){
    try{
      const response = await this.httpClient.patch<PostDto>('/api/post/like/' + userId + '/' + postId, null).toPromise();

      return response;
    }

    catch(error){
      console.log(error);

      return null;
    }
  }
}