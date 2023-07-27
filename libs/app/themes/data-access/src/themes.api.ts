import { HttpClient } from "@angular/common/http";
import { SettingsDto, ThemesSettingsDto } from "@encompass/api/settings/data-access";
import { Injectable } from "@angular/core";

export interface fileReturn{
  key: string,
  url: string;
}

@Injectable()
export class ThemesApi{
  constructor(private httpClient: HttpClient){}

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

  async updateThemes(userId: string, settings: ThemesSettingsDto){
    try{
      const response = await this.httpClient.patch<SettingsDto>("/api/settings/update-themes/" + userId, settings).toPromise();

      return response;
    }

    catch(error){
      console.log(error)

      return null
    }
  }

  async uploadFile(request: FormData) : Promise<string | null>{
    try {

      // console.log("HERE")
      const response = await this.httpClient.post<fileReturn>('/api/post/upload-image', request).toPromise();

      if(response == null){
        return null
      }

      return response.url;
    } 
    catch (error) 
    {
      console.log(error);
      return null;
    }
  }
}