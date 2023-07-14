import { Injectable } from "@angular/core";
import { ChatDto } from "@encompass/api/chat/data-access";
import { State, Action, StateContext } from "@ngxs/store";
import { MessagesApi } from "./messages.api";
import { GetChatList, GetMessages, GetUserInformation, SendMessage, SetMessages } from "@encompass/app/messages/util";
import { Selector } from "@ngxs/store";
import { produce } from "immer";
import { tap } from "rxjs";
import { ChatListDto } from "@encompass/api/chat-list/data-access";
import { MessagesDto } from "@encompass/api/chat/data-access";
import { ProfileDto } from "@encompass/api/profile/data-access";

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

export interface MessagesDtoModel{
  MessagesStateForm: {
    model: {
      messages: MessagesDto[] | null
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
    await this.messagesApi.sendMessage(addMessageRequest);
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

  @Action(GetUserInformation)
  async getUserInformation(ctx: StateContext<MessagesDtoModel>, {messageList}: GetUserInformation){
    let currentList: MessagesDto[] = []
    const items = messageList.chatList;

    for (const element of items) {
      const response: ProfileDto | null | undefined = await this.messagesApi.getProfile(element.otherUser);
      if(response != null && response != undefined){
        const data: MessagesDto = {
          username: element.otherUser,
          name: response.name,
          lastName: response.lastName,
          profilePicture: response.profileImage,
          chatId: element.chatRef
        }

        console.log(data);
        currentList = [...currentList, data];
      }
    }

    ctx.setState({
      MessagesStateForm:{
        model:{
          messages: currentList
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

  @Selector()
  static messagesDto(state: MessagesDtoModel){
    return state.MessagesStateForm.model.messages;
  }
}