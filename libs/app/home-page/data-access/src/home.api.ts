import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { HomeDto } from "@encompass/api/home/data-access";
import { PostDto } from "@encompass/api/post/data-access";

@Injectable()
export class HomeApi{
  constructor(private httpClient: HttpClient){}

  async getHome()
  {
    try {
      const response = await this.httpClient.get<HomeDto[]>('/api/home').toPromise();
      return response;
    } 
    catch (error) 
    {
      return null;
    }
  }

  async getAllPosts(){
    try{
      const response = await this.httpClient.get<PostDto[]>('/api/post/get-all').toPromise();
      return response;
    }

    catch(error){
      return null;
    }
  }
}