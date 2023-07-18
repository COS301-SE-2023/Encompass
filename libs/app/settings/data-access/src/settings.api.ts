import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { SettingsDto } from "@encompass/api/settings/data-access";

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
}