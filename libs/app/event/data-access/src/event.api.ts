import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { EventDto } from "@encompass/api/event/data-access";
import { ProfileLeaderboardDto } from "@encompass/api/profile-leaderboard/data-access";
import { ProfileDto } from "@encompass/api/profile/data-access";
import { UpdateEventRequest, UserEventsDto } from "@encompass/api/user-events/data-access";

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

  async getEventsByUsername(username: string){
    try{
      const response = await this.httpClient.get<EventDto[]>('/api/event/get-by-user/' + username).toPromise();

      return response;
    }

    catch(error){
      console.log(error);

      return null;
    }
  }

  async getEventById(id: string){
    try{
      const response = await this.httpClient.get<EventDto>('/api/event/' + id).toPromise();

      return response;
    }

    catch(error){
      console.log(error)

      return null;
    }
  }

  async getUserEvents(userId: string){
    try{
      const response = await this.httpClient.get<UserEventsDto>('/api/user-events/get/' + userId).toPromise();

      return response;
    }

    catch(error){
      console.log(error)

      return null;
    }
  }

  async updateUserEvent(userId: string, updateRequest: UpdateEventRequest){
    try{
      const response = await this.httpClient.patch<UserEventsDto>('/api/user-events/update-event/' + userId, updateRequest).toPromise();

      return response;
    }

    catch(error){
      console.log(error);
      return null;
    }
  }

  async addUser(eventId: string, username: string){
    try{
      const response = await this.httpClient.patch<EventDto>('/api/event/add-user/' + eventId + '/' + username, null).toPromise();

      return response;
    }

    catch(error){
      console.log(error);
      return null;
    }
  }

  async addToUserEvents(userId: string, eventId: string){
    try{
      const response = await this.httpClient.patch<UserEventsDto>('/api/user-events/add-event/' + userId + "/" + eventId, {}).toPromise();

      return response;
    }

    catch(error){
      console.log(error);
      return null;
    }
  }

  async addCoins(username: string, amount: number){
    try{
      const response = await this.httpClient.patch<ProfileDto>('/api/profile/add-coins/' + username + '/' + amount, null).toPromise();

      return response;
    }

    catch(error){
      console.log(error);
      return null;
    }
  }
}