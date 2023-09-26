import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommunityRequestDto } from "@encompass/api/community-request/data-access";
import { CreateCommunityRequest, CommunityDto } from "@encompass/api/community/data-access";

export interface fileReturn{
  key: string,
  url: string;
}

@Injectable()
export class CreateCommunityApi{
  constructor(private httpClient: HttpClient){}

  async createCommunity(request: CreateCommunityRequest){
    try {
      const response = await this.httpClient.post<CommunityDto>('/api/community/create', request).toPromise();

      return response;
    } 
    catch (error) 
    {
      return null;
    }
  }
  
  async checkCommunity(request: string){
    try{
      const response = await this.httpClient.get('/api/community/does-exist/' + request, {responseType: 'text'}).toPromise();

      if(response == "true"){
        return true;
      }

      else{
        return false;
      }
    }

    catch(error){
      return null
    }
  }

  async addPost(name: string, id: string){
    try{
      const response = await this.httpClient.patch<CommunityDto>('/api/community/add-post/' + name + "/" + id, {}).toPromise();

      return response;
    }

    catch(error){
      console.log(error);
      return null;
    }
  }

  async addEvent(name: string, id: string){
    try{
      const response = await this.httpClient.patch<CommunityDto>('/api/community/add-event/' + name + "/" + id, {}).toPromise();

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

  async createCommunityRequest(id: string){
    try{
      const response = await this.httpClient.post<CommunityRequestDto>('/api/community-request/create/' + id, {}).toPromise();

      return response;
    }

    catch(error){
      console.log(error)
      return null;
    }
  }
}