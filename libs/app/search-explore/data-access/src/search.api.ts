import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommunityDto } from "@encompass/api/community/data-access";
import { PostDto, UpdatePostRequest } from "@encompass/api/post/data-access";
import { ProfileDto } from "@encompass/api/profile/data-access";

@Injectable({
    providedIn: 'root'
  })
export class SearchApi {
    constructor(private http: HttpClient) {}

    async getAllProfiles(){
        try{
            return await this.http.get<ProfileDto[]>('/api/profile/get-all').toPromise();
        } catch(error){
            console.log(error);
            return null;
        }
    }

    async getProfilesByKeyword(keyword: string){
        try{
            return await this.http.get<ProfileDto[]>('/api/profile/get-users-by-keyword/' + keyword).toPromise();
        } catch(error){
            console.log(error);
            return null;
        }
    }

    async getAllCommunities(){
        try{
            return await this.http.get<CommunityDto[]>('/api/community/get-all-communities').toPromise();
        } catch(error){
            console.log(error);
            return null;
        }
    }

    async getCommunitiesByKeyword(keyword: string){
        try{
            return await this.http.get<CommunityDto[]>('/api/community/get-communities-by-keyword/' + keyword).toPromise();
        } catch(error){
            console.log(error);
            return null;
        }
    }

    async getPostsByKeyword(keyword: string, userId: string){
        try{
            return await this.http.get<PostDto[]>('/api/post/get-posts-by-keyword/' + keyword + '/' + userId).toPromise();
        } catch(error){
            console.log(error);
            return null;
        }
    }

    async addCoins(userId: string, coins: number){
        try{
            return await this.http.patch<ProfileDto>('/api/profile/add-coins/' + userId + '/' + coins, null).toPromise();
        } catch(error){
            console.log(error);
            return null;
        }
    }

    async removeCoins(userId: string, coins: number){
        try{
            return await this.http.patch<ProfileDto>('/api/profile/remove-coins/' + userId + '/' + coins, null).toPromise();
        } catch(error){
            console.log(error);
            return null;
        }
    }

    async updatePost(postId: string, postUpdateRequest: UpdatePostRequest){
        try{
          const response = await this.http.patch<PostDto>('/api/post/' + postId, postUpdateRequest).toPromise();
    
          return response;
        }
    
        catch(error){
          console.log(error);
    
          return null;
        }
      }

      async dislikePost(postId: string, userId: string){
        try{
          const response = await this.http.patch<PostDto>('/api/post/dislike/' + userId + '/' + postId, null).toPromise();
    
          return response;
        }
    
        catch(error){
          console.log(error);
    
          return null;
        }
      }
    
      async likePost(postId: string, userId: string){
        try{
          const response = await this.http.patch<PostDto>('/api/post/like/' + userId + '/' + postId, null).toPromise();
    
          return response;
        }
    
        catch(error){
          console.log(error);
    
          return null;
        }
    }
}

