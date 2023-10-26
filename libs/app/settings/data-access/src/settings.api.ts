import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AccountDto } from "@encompass/api/account/data-access";
import { ProfileDto, UpdateProfileRequest } from "@encompass/api/profile/data-access";
import { NotificationsSettingsDto, ProfileSettingsDto, SettingsDto } from "@encompass/api/settings/data-access";

export interface fileReturn{
  key: string,
  url: string;
}

@Injectable()
export class SettingsApi {
  constructor(private httpClient: HttpClient) {}

  async getUserSettings(userId: string) {
    try {
      const response = await this.httpClient.get<SettingsDto>("/api/settings/get/" + userId).toPromise();

      return response;

    } 
    catch (error) {
      console.log(error);

      return null;
    }
  }

  async uploadFile(request: FormData) : Promise<string | null>{
    try {
      const response = await this.httpClient.post<fileReturn>('/api/profile/upload-image', request).toPromise();

      if(response == null){
        return null;
      }
      
      return response.url;
    } 
    catch (error) 
    {
      console.log(error);
      return null;
    }
  }

  async updateProfile(userId: string, settings: ProfileSettingsDto) {
    try {
      const response = await this.httpClient.patch<SettingsDto>("/api/settings/update-profile/" + userId, settings).toPromise();

      return response;

    } 
    catch (error) {
      console.log(error);

      return null;
    }
  }

  async updateNotification(userId: string, settings: NotificationsSettingsDto){
    try{
      const response = await this.httpClient.patch<SettingsDto>("/api/settings/update-notifications/" + userId, settings).toPromise();

      return response;
    }

    catch(error){
      console.log(error);

      return null;
    }
  }

  async updateMessage(userId: string, settings: string){
    try{
      const response = await this.httpClient.patch<SettingsDto>("/api/settings/update-message/" + userId, {messagePermissions: settings}).toPromise();

      return response;
    }

    catch(error){
      console.log(error);

      return null;
    }
  }

  async getAccount(userId: string){
    try{
      const response = await this.httpClient.get<AccountDto>("/api/account/get/" + userId).toPromise();

      // console.log(response);
      return response;
    }

    catch(error){
      console.log(error);

      return null;
    }
  }

  async updateEmail(userId: string, email: string){
    try{
      const response = await this.httpClient.patch<AccountDto>("/api/account/update-email/" + userId, {email: email}).toPromise();

      return response;
    }

    catch(error){
      console.log(error);

      return null;
    }
  }

  async updatePassword(userId: string, password: string){
    try{
      const response = await this.httpClient.patch<AccountDto>("/api/account/update-password/" + userId, {password: password}).toPromise();

      return response;
    }

    catch(error){
      console.log(error);

      return null;
    }
  }
}