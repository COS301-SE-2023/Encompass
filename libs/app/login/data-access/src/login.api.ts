import { HttpClient } from "@angular/common/http";
import { AccountDto, GetAccountRequest } from "@encompass/api/account/data-access";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
@Injectable()
export class LoginApi{
  constructor(private httpClient: HttpClient){}

  async login(request: GetAccountRequest){
    try{
      
      const response =  await this.httpClient.post<AccountDto>('/api/account/login', request).toPromise();
      return response;
    }

    catch(error)
    {
      console.log(error);
      return null;
    }
  }
}