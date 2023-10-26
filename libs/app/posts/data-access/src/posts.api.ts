import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommunityDto } from "@encompass/api/community/data-access";
import { CreatePostRequest, PostDto, UpdatePostRequest } from "@encompass/api/post/data-access";

@Injectable()
export class PostsApi{
  constructor(private httpClient: HttpClient){}

  async getPost(postId: string){
    try{
      const response = await this.httpClient.get<PostDto>('/api/post/' + postId).toPromise();

      return response;
    }
    catch(error){
      console.log(error);

      return null;
    }
  }
  
  async getPosts(username: string, userId: string){
    try{
      const response = await this.httpClient.get<PostDto[]>('/api/post/get-by-user/' + username + '/' + userId).toPromise();

      return response;
    }

    catch(error){
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


  // async getCommunityPosts(name: string) {
  //   try{
  //     const response = await this.httpClient.get<PostDto[]>('/api/post/get-by-community/' + name).toPromise();

  //     return response;
  //   }

  //   catch(error){
  //     console.log(error);

  //     return null;
  //   }
  // }

  async getLatestPosts(username: string) {
    try {
        const response = await this.httpClient.get<PostDto[]>('/api/post/get-latest/' + username).toPromise();
        return response;
    } catch (error) {
        console.log(error);
        return null;   
    }
  }

  async getPopularPosts(username: string) {
    try {
        const response = await this.httpClient.get<PostDto[]>('/api/post/get-popular/' + username).toPromise();
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

  async getAllPosts(username : string){
    try{
      // console.log("I am fetching the AI Posts")
      const response = await this.httpClient.get<PostDto[]>('/api/post/get-all/' + username).toPromise();

      // console.log(response);
      return response;
    }

    catch(error){
      return null;
    }
  }

  async createPost(request: CreatePostRequest){
    try {
      const response = await this.httpClient.post<PostDto>('/api/post/create', request).toPromise();

      return response;
    } 
    catch (error) 
    {
      return null;
    }
  }

  async getCommunity(communtiyName: string){
    try {
      const response = await this.httpClient.get<CommunityDto>('/api/community/get-community/' + communtiyName).toPromise();

      return response;
    } 
    catch (error) 
    {
      return null;
    }
  }
}