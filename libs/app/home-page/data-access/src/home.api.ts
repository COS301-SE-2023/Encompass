import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { HomeDto } from "@encompass/api/home/data-access";
import { NotificationDto } from "@encompass/api/notifications/data-access";
import { PostDto, UpdatePostRequest } from "@encompass/api/post/data-access";

@Injectable()
export class HomeApi{
  constructor(private httpClient: HttpClient){}

  // async getHome()
  // {
  //   try {
  //     const response = await this.httpClient.get<HomeDto[]>('/api/home').toPromise();
  //     return response;
  //   } 
  //   catch (error) 
  //   {
  //     return null;
  //   }
  // }

  async getNotifications(userId: string){
    try{
      const response = await this.httpClient.get<NotificationDto>('/api/notification/get/' + userId).toPromise();
      return response;
    }
    catch(error){
      console.log(error);

      return null;
    }
  }

  async getLatestPosts() {
    try {
        const response = await this.httpClient.get<PostDto[]>('/api/post/get-latest').toPromise();
        return response;
    } catch (error) {
        console.log(error);
        return null;   
    }
  }

  async getPopularPosts() {
    try {
        const response = await this.httpClient.get<PostDto[]>('/api/post/get-popular').toPromise();
        return response;
    } catch (error) {
        console.log(error);
        return null;
    }
  }

  async getAllPosts(){ //recommended posts
    try{
      const response = await this.httpClient.get<PostDto[]>('/api/post/get-all').toPromise();
      return response;
    }

    catch(error){
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
}