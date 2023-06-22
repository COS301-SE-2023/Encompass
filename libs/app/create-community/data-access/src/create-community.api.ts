import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CreateCommunityRequest, CommunityDto } from "@encompass/api/community/data-access";

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
}