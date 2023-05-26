import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { HomeDto } from "@encompass/api/home/data-access";

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
}