import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { EventDto } from "@encompass/api/event/data-access";
import { ProfileLeaderboardDto } from "@encompass/api/profile-leaderboard/data-access";

@Injectable()
export class EventApi{
  constructor(private httpClient: HttpClient){}

  async getEvents(){
    try{
      const response = await this.httpClient.get<ProfileLeaderboardDto[]>('/api/profile-leaderboard/leaderboard').toPromise();

      return response;
    }

    catch(error){
      console.log(error)

      return null;
    }
  }

  async getEventsByCommunity(community: string){
    try{
      const response = await this.httpClient.get<EventDto[]>('/api/event/get-by-community/' + community).toPromise();

      return response;
    }

    catch(error){
      console.log(error)

      return null;
    }
  }
}