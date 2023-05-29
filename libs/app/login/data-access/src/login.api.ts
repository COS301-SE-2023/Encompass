import { HttpClient } from "@angular/common/http";
import { GetAccountRequest } from "@encompass/api/account/data-access";
import { Injectable } from "@nestjs/common";

@Injectable()
export class LoginApi{
  constructor(private httpClient: HttpClient){}

  async login(request: GetAccountRequest){
    try{
      const response = await this.httpClient.post('/api/account/login', request).toPromise();
      return response;
    }

    catch(error)
    {
      return null;
    }
  }
}