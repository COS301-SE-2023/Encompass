import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ProfileDto } from "@encompass/api/profile/data-access";
import { Observable } from "rxjs";

@Injectable()
export class ProfileApi{
  constructor(private httpClient: HttpClient){}
  
  user$(id: string) : Observable<ProfileDto>{
    return this.httpClient.get<ProfileDto>('/api/profile/' + id)
  }
}