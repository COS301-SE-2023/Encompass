import { OnModuleInit } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ChatService } from './chat.service';
import { AddMessageRequest } from './dto';

@WebSocketGateway(4001)
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit{
  @WebSocketServer()
  server!: Server;

  constructor(private chatService: ChatService){}

  async handleConnection(client: any, ...args: any[]) {
    console.log('Client connected: ');
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
    client.emit('messages', this.chatService.getMessages(data));
  }

  @SubscribeMessage('sendMessage')
  async sendMessage(client: any, data: AddMessageRequest, chatId: string){
    console.log(data);
    this.chatService.sendMessage(data, chatId);
    this.server.emit('messages', this.chatService.getMessages(chatId));
  }
}