import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { AddMessageRequest } from "./dto";

@Injectable()
export class ChatService {
  constructor(private readonly httpService: HttpService){}

  async getMessages(chatId: string){
    const url = process.env["BASE_URL"];
    console.log(chatId);

    try{
      const response = await this.httpService.get(url + '/api/chat/get-chat/' + chatId).toPromise();
      if (response && response.data) {
        console.log(response.data);
        return response.data;
      }
    }

    catch(error){
      console.log(error);
    }
  }

    async sendMessage(data: AddMessageRequest, chatId: string){
      console.log(data);
      const url = process.env["BASE_URL"];

      try{
        const response = await this.httpService.post(url + '/api/chat/add-message/' + chatId, data).toPromise();
        if (response) {
          console.log(response.data);
          return response.data;
        }
      }

      catch(error){
        console.log(error);
      }
    }  }

