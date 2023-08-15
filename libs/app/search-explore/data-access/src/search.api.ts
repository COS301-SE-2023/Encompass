import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommunityDto } from "@encompass/api/community/data-access";
import { PostDto } from "@encompass/api/post/data-access";
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

    async getPostsByCategory(category: string){
        try{
            return await this.http.get<PostDto[]>('/api/post/get-posts-by-category/' + category).toPromise();
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

    async getPostsByKeyword(keyword: string){
        try{
            return await this.http.get<PostDto[]>('/api/post/get-posts-by-keyword/' + keyword).toPromise();
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
}

