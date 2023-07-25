import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class SignUpCommunitiesApi{
  constructor(private httpClient: HttpClient){}

  async getCommunities(userId: string){

  }
}