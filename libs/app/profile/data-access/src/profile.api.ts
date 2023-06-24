import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ProfileDto, UpdateProfileRequest } from "@encompass/api/profile/data-access";
import { Observable } from "rxjs";

@Injectable()
export class ProfileApi{
  constructor(private httpClient: HttpClient){}
  
  user$(id: string) : Observable<ProfileDto>{
    return this.httpClient.get<ProfileDto>('/api/profile/' + id)
  }

  updateProfile(updateProfileRequest: UpdateProfileRequest, userId: string){
    try{
      const response = this.httpClient.patch<ProfileDto>('/api/profile/' + userId, updateProfileRequest).toPromise();

      return response;
    }

    catch(error){
      return null;
    }
  }
}