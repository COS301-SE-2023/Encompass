import { Injectable } from "@angular/core";
import { ChatDto } from "@encompass/api/chat/data-access";
import { State, Action, StateContext } from "@ngxs/store";
import { MessagesApi } from "./messages.api";
import { GetChatList, GetMessages, SendMessage, SetMessages } from "@encompass/app/messages/util";
import { Selector } from "@ngxs/store";
import { produce } from "immer";
import { tap } from "rxjs";
import { ChatListDto } from "@encompass/api/chat-list/data-access";

export interface MessagesStateModel{
  messages: ChatDto | null
}

export interface ChatListModel{
  ChatListForm: {
    model: {
      chatList: ChatListDto | null
    }
  }
}

@State<MessagesStateModel>({
  name: 'messagesModel',
  defaults:{
    messages: null
  }
})

@State<ChatListModel>({
  name: 'chatListModel',
  defaults:{
    ChatListForm:{
      model:{
        chatList: null
      }
    }
  }
})

@Injectable()
export class MessagesState{
  constructor(private messagesApi: MessagesApi){}
  @Action(GetMessages)
  getMessages(ctx: StateContext<MessagesStateModel>, {chatId}: GetMessages){

    return ( this.messagesApi
      .getMessages(chatId))
    .pipe(tap((messages: ChatDto) => ctx.dispatch(new SetMessages(messages))));
  }

  @Action(SetMessages)
  setMessages(ctx: StateContext<MessagesStateModel>, {messages}: SetMessages){
    return ctx.setState(
      produce((draft) => {
        draft.messages = messages;
      })
    )
  }
  @Action(SendMessage)
  async sendMessage(ctx: StateContext<MessagesStateModel>, {addMessageRequest}: SendMessage){
    const response = await this.messagesApi.sendMessage(addMessageRequest);

    // if(response == null || response == undefined){
    //   return;
    // }

    // ctx.setState({
    //   MessagesStateForm: {
    //     model: {
    //       messages: response
    //     }
    //   }
    // })
  }

  @Action(GetChatList)
  async getChatList(ctx: StateContext<ChatListModel>, {username}: GetChatList){
    const response = await this.messagesApi.getChatList(username);

    if(response == null || response == undefined){
      return;
    }

    ctx.setState({
      ChatListForm:{
        model:{
          chatList: response
        }
      }
    })
  }

  @Selector()
  static messages(state: MessagesStateModel){
    return state.messages;
  }

  @Selector()
  static chatList(state: ChatListModel){
    return state.ChatListForm.model.chatList;
  }
}