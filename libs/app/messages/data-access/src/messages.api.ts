import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Socket } from 'ngx-socket-io';
import { GateWayAddMessageRequest, ChatDto } from '@encompass/api/chat/data-access';
import { Observable } from 'rxjs';

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
}