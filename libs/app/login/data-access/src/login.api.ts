import { HttpClient } from "@angular/common/http";
import { GetAccountRequest } from "@encompass/api/account/data-access";
import { Injectable } from "@angular/core";
@Injectable()
export class LoginApi{
  constructor(private httpClient: HttpClient){}

  async login(request: GetAccountRequest){
    try{
      
      const response =  await this.httpClient.post('/api/account/login', request, {responseType: 'text'}).toPromise();
      // const response = await this.httpClient.get('/api/home').toPromise();
      return response;
    }

    catch(error)
    {
      console.log(error);
      return null;
    }
  }
}