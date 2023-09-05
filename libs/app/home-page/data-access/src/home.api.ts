import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommunityDto } from "@encompass/api/community/data-access";
import { HomeDto } from "@encompass/api/home/data-access";
import { AddNotificationRequest, NotificationDto } from "@encompass/api/notifications/data-access";
import { BookDto } from "@encompass/api/media-recommender/data-access";
import { PostDto, UpdatePostRequest } from "@encompass/api/post/data-access";
import { MovieDto } from "@encompass/api/media-recommender/data-access";
import { PodcastDto } from "@encompass/api/media-recommender/data-access";

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

  async getRecommendedBooks(userId: string){
    try{
      const response = await this.httpClient.get<BookDto[]>('/api/media-recommender/books/' + userId).toPromise();
      return response;
    }
    catch(error){
      return null;
    }
  }

  async getRecommendedMovies(userId: string){
    try{
      const response = await this.httpClient.get<MovieDto[]>('/api/media-recommender/movies/' + userId).toPromise();
      return response;
    }
    catch(error){
      return null;
    }
  }

  async getRecommendedPodcasts(userId: string){
    try{
      const response = await this.httpClient.get<PodcastDto[]>('/api/media-recommender/podcasts/' + userId).toPromise();
      return response;
    }
    catch(error){
      return null;
    }
  }

  async getRecommendedCommunites(userId: string, username: string){
    try{
      const response = await this.httpClient.get<CommunityDto[]>('/api/community/get-recommended-communities/' + userId + '/' + username).toPromise();
      return response;
    }
    catch(error){
      return null;
    }
  }

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

  async getLatestPosts(username: string) {
    try {
        const response = await this.httpClient.get<PostDto[]>('/api/post/get-latest/' + username).toPromise();
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

  async getRecommendPosts(userId: string) {
    try {
        const response = await this.httpClient.get<PostDto[]>('/api/post/get-recommended-posts/' + userId).toPromise();
        return response;
    } catch (error) {
        console.log(error);
        return null;
    }
  }

  async sendNotification(userId: string, notification: AddNotificationRequest){ 
    try{
      const response = await this.httpClient.patch<NotificationDto>('/api/notification/add/' + userId, notification).toPromise();

      return response
    }

    catch(error){
      console.log(error)

      return null
    }
  }

  async getAllPosts(username : string){
    try{
      console.log("I am fetching the AI Posts")
      const response = await this.httpClient.get<PostDto[]>('/api/post/get-all/' + username).toPromise();

      console.log(response);
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

  async clearNotification(userId: string, id: string){
    try{
      const response = await this.httpClient.patch<NotificationDto>('/api/notification/remove/' + userId + '/' + id, null).toPromise();

      return response
    }

    catch(error){
      console.log(error)

      return null
    }
  }

  async clearAllNotifications(userId: string){
    try{
      const response = await this.httpClient.patch<NotificationDto>('/api/notification/clear-all/' + userId, null).toPromise();

      return response
    }

    catch(error){
      console.log(error)

      return null
    }
  }
}