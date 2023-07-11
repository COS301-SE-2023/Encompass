import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Socket } from 'ngx-socket-io';
import { ChatDto } from '@encompass/api/chat/data-access';

@Injectable()
export class MessagesApi {
    constructor(private http: HttpClient, private socket: Socket) { }
    
    async getMessages(chatId: string) {
      this.socket.emit('getMessages', chatId);
      return await this.socket.fromEvent<ChatDto[]>('messages').toPromise();
    }

}