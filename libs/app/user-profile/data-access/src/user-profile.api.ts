import { HttpClient } from "@angular/common/http";
import { ProfileDto } from "@encompass/api/profile/data-access";
import { Injectable } from "@angular/core";
import { PostDto, UpdatePostRequest } from "@encompass/api/post/data-access";
import { SettingsDto } from "@encompass/api/settings/data-access";

@Injectable()
export class UserProfileApi{
  constructor(private httpClient: HttpClient){}

  async getUserProfile(username: string){
    try{
      const response = await this.httpClient.get<ProfileDto>('/api/profile/get-user/' + username).toPromise();

      return response
    }

    catch(error){
      console.log(error)
      return null;
    }
  }

  async getUserProfilePosts(username: string, userId: string){
    try{
      const response = await this.httpClient.get<PostDto[]>('/api/post/get-by-user/' + username + '/' + userId).toPromise();

      return response
    }

    catch(error){
      console.log(error)
      return null;
    }
  }

  async addFollower(username: string, followerUsername: string){
    try{
      const response = await this.httpClient.patch<ProfileDto>('/api/profile/add-follower/' + username + '/' + followerUsername, {}).toPromise();

      return response
    }

    catch(error){
      console.log(error)
      return null;
    }
  }

  async removeFollower(username: string, followerUsername: string){
    try{
      const response = await this.httpClient.patch<ProfileDto>('/api/profile/remove-follower/' + username + '/' + followerUsername, {}).toPromise();

      return response
    }

    catch(error){
      console.log(error)
      return null;
    }
  }

  async getUserSettings(userId:string){
    try{
      const response = await this.httpClient.get<SettingsDto>('/api/settings/get/' + userId).toPromise();

      return response
    }

    catch(error){
      console.log(error)
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

  async addCoins(username: string, amount: number){
    try{
      const response = await this.httpClient.patch<ProfileDto>('/api/profile/add-coins/' + username + '/' + amount, null).toPromise();

      return response;
    }

    catch(error){
      return null
    }
  }

  async removeCoins(username: string, amount: number){
    try{
      const response = await this.httpClient.patch<ProfileDto>('/api/profile/remove-coins/' + username + '/' + amount, null).toPromise();

      return response;
    }

    catch(error){
      return null
    }
  }

  async getProfile(username: string){
    try{
      const response = await this.httpClient.get<ProfileDto>('/api/profile/get-user/' + username).toPromise();

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