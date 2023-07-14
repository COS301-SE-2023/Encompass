import { HttpClient } from "@angular/common/http";
import { ProfileDto } from "@encompass/api/profile/data-access";
import { Injectable } from "@angular/core";

@Injectable()
export class UserProfileApi{
  constructor(private httpClient: HttpClient){}

  async getUserProfile(username: string){
    try{
      const response = await this.httpClient.get<ProfileDto>('/api/profile/get-user/' + username).toPromise();

      return response
    }

    catch(error){
      console.log(error)
      return null;
    }
  }
}