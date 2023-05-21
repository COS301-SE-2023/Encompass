import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable()
export class HomeApi{
  constructor(private httpClient: HttpClient){}

  async getHome()
  {
    return await this.httpClient.get('http://localhost:3000/api/home');
  }
}