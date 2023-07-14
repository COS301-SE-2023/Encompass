import { OnModuleInit } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ChatService } from './chat.service';
import { AddMessageRequest } from './dto';
import { Socket } from 'socket.io';
import { GateWayAddMessageRequest } from './dto/gateway-add-message-request.dto';

@WebSocketGateway({ cors: { origin: [ 'http://localhost:3000', 'http://localhost:4200'] } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit{
  @WebSocketServer()
  server!: Server;

  constructor(private chatService: ChatService){}

  async handleConnection(client: any, ...args: any[]) {
    console.log('Client connected: ');
    // this.server.emit('messages', "Here");
  }

  async handleDisconnect(client: any) {
    console.log('Client disconnected: ');
  }

  afterInit(server: any) {
    console.log('Initialized: ');
  }

  @SubscribeMessage('getMessages')
  async getMessages(client: any, data: string){
    console.log(data);
    const item = await this.chatService.getMessages(data);
    console.log(item);
    this.server.emit('messages/' + data, item);
  }

  @SubscribeMessage('sendMessage')
  async sendMessage(client: any, data: GateWayAddMessageRequest){
    console.log("This is the data");
    console.log(data);

    const message: AddMessageRequest = {
      message: data.message,
      username: data.username,
    }

    await this.chatService.sendMessage(message, data.chatId);
    const item = await this.chatService.getMessages(data.chatId);
    console.log(item);
    this.server.emit('messages/' + data.chatId, item);
  }
}