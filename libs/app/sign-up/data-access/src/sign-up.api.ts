import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CreateAccountRequest } from "@encompass/api/account/data-access";


@Injectable()
export class SignUpApi{
  constructor(private httpClient: HttpClient){}

  async signUp(request: CreateAccountRequest){
    try {
      const response = await this.httpClient.post('/api/account', request).toPromise();
      return response;
    } 
    catch (error) 
    {
      return null;
    }
  }
}