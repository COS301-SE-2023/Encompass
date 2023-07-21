import { Injectable } from "@angular/core";
import { ChatDto } from "@encompass/api/chat/data-access";
import { State, Action, StateContext } from "@ngxs/store";
import { MessagesApi } from "./messages.api";
import { CreateChat, GetChatList, GetMessages, GetNewChats, GetUserInformation, SendMessage, SendNotification, SetMessages } from "@encompass/app/messages/util";
import { Selector } from "@ngxs/store";
import { produce } from "immer";
import { tap } from "rxjs";
import { ChatListDto } from "@encompass/api/chat-list/data-access";
import { MessagesDto } from "@encompass/api/chat/data-access";
import { ProfileDto } from "@encompass/api/profile/data-access";
import { SettingsDto } from "@encompass/api/settings/data-access";
import { SendNotification as HomeSendNotification } from "@encompass/app/home-page/util";

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

export interface MessagesProfileModel{
  MessagesProfileForm: {
    model: {
      profile: ProfileDto[] | null
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

@State<MessagesDtoModel>({
  name: 'messagesDtoModel',
  defaults:{
    MessagesStateForm:{
      model:{
        messages: null
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

  @Action(SendNotification)
  async sendNotification(ctx: StateContext<MessagesStateModel>, {username, notification}: SendNotification){
    // console.log("here")
    const user = await this.messagesApi.getProfile(username);

    if(user == null || user == undefined){
      return;
    }

    const settings = await this.messagesApi.getProfileSettings(user._id)

    if(settings == null || settings == undefined){
      return;
    }

    if(settings.notifications.dms !== false){
      // console.log("here")
      // ctx.dispatch(new HomeSendNotification(user._id, notification));
      this.messagesApi.sendNotification(user._id, notification);
    }
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

    @Action(GetNewChats)
    async getNewChats(ctx: StateContext<MessagesProfileModel>, { followingList }: GetNewChats) {
    const userList: ProfileDto[] = [];

    // Use map to create an array of promises from the forEach loop
    const promises = followingList.map(async (element) => {
      const response: ProfileDto | null | undefined = await this.messagesApi.getProfile(element);

      if (response != null && response != undefined) {
        const data: SettingsDto | null | undefined = await this.messagesApi.getProfileSettings(response._id);

        if (data?.messagePermissions != "Noone") {
          userList.push(response);
        }
      }
    });
    // console.log("promises")

    // Wait for all the promises to complete using Promise.all
    await Promise.all(promises);

    console.log(userList);
    // Now the userList is fully populated, and you can update the context state
    ctx.setState({
      MessagesProfileForm: {
        model: {
          profile: userList,
        },
      },
    });

    // console.log("Here");
  }

  @Action(CreateChat)
  async createChat(ctx: StateContext<MessagesStateModel>, {usernames}: CreateChat){
    await this.messagesApi.createChat(usernames);
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

  @Selector()
  static messagesProfile(state: MessagesProfileModel){
    return state.MessagesProfileForm.model.profile;
  }
}