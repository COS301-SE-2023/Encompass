import { HttpClient } from "@angular/common/http";
import { ProfileDto } from "@encompass/api/profile/data-access";
import { Injectable } from "@angular/core";
import { PostDto } from "@encompass/api/post/data-access";

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

  async getUserProfilePosts(username: string){
    try{
      const response = await this.httpClient.get<PostDto[]>('/api/post/get-by-user/' + username).toPromise();

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
}