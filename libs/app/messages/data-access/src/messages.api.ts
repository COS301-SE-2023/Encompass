import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Socket } from 'ngx-socket-io';
import { GateWayAddMessageRequest, ChatDto } from '@encompass/api/chat/data-access';
import { Observable } from 'rxjs';
import { ChatListDto } from '@encompass/api/chat-list/data-access';
import { ProfileDto } from '@encompass/api/profile/data-access';

@Injectable({
  providedIn: 'root'
})
export class MessagesApi {
    constructor(private http: HttpClient, private socket: Socket) { }
    
    getMessages(chatId: string): Observable<ChatDto> {
      return new Observable<ChatDto>(observer => {
        this.socket.on('messages/' + chatId, (item: ChatDto) => {
          console.log(item);
          observer.next(item);
        });
    
        this.socket.emit('getMessages', chatId);
      });
    }

    async sendMessage(message: GateWayAddMessageRequest) {
      // return new Promise<ChatDto | null>((resolve, reject) => {
      //   this.socket.on('messages', (item: ChatDto) => {
      //     console.log(item);
      //     resolve(item);
      //   });

      this.socket.emit('sendMessage', message);
      // });
    }

    async getChatList(username: string){
      try{
        const response = this.http.get<ChatListDto>('/api/chat-list/get-chat-list/' + username).toPromise();

        return response;
      }

      catch(error){
        console.log(error)

        return null;
      }
    }

    async getProfile(username: string){
      try{
        const response = this.http.get<ProfileDto>('/api/profile/get-user/' + username).toPromise();

        return response;
      }

      catch(error){
        console.log(error)

        return null;
      }
    }
}