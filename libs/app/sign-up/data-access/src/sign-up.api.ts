import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AccountDto, CreateAccountRequest } from "@encompass/api/account/data-access";
import { CreateProfileRequest } from "@encompass/api/profile/data-access";


@Injectable()
export class SignUpApi{
  constructor(private httpClient: HttpClient){}

  async signUp(request: CreateAccountRequest){
    try {
      const response = await this.httpClient.post<AccountDto>('/api/account', request).toPromise();

      // console.log(response);
      return response;
    } 
    catch (error) 
    {
      return null;
    }
  }

  async checkAccount(request: string) : Promise<boolean | null>{
    try {
      const response = await this.httpClient.get('/api/account/' + request, {responseType: 'text'}).toPromise();

      if(response == "true")
        return true;

      else
        return false;
    } 
    catch (error) 
    {
      return null;
    }
  }

  async checkUsername(request: string) : Promise<boolean | null>{
    try{
      const response = await this.httpClient.get('/api/profile/user/' + request, {responseType: 'text'}).toPromise();

      if(response == "true")
        return true;

      else
        return false;
    }

    catch(error){
      return null;
    }
  }

  async createProfile(request: CreateProfileRequest){
    try{
      const response = await this.httpClient.post('/api/profile/create', request, {responseType: 'text'}).toPromise();

      return response;
    }

    catch(error){
      return null;
    }
  }
}