import { Injectable } from "@angular/core";
import { ChatDto } from "@encompass/api/chat/data-access";
import { State, Action, StateContext } from "@ngxs/store";
import { MessagesApi } from "./messages.api";
import { GetMessages, SendMessage, SetMessages } from "@encompass/app/messages/util";
import { Selector } from "@ngxs/store";
import { produce } from "immer";
import { tap } from "rxjs";

export interface MessagesStateModel{
  MessagesStateForm: {
    model:{
      messages: ChatDto | null
    }
  }
}

@State<MessagesStateModel>({
  name: 'messagesModel',
  defaults: {
    MessagesStateForm: {
      model: {
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

    // console.log("Here")
    // const response = await this.messagesApi.getMessages(chatId);

    // console.log(response);

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

  @Action(SetMessages)
  setMessages(ctx: StateContext<MessagesStateModel>, {messages}: SetMessages){
    return ctx.setState(
      produce((draft) => {
        draft.MessagesStateForm.model.messages = messages;
      })
    )
  }
  @Action(SendMessage)
  async sendMessage(ctx: StateContext<MessagesStateModel>, {addMessageRequest}: SendMessage){
    const response = await this.messagesApi.sendMessage(addMessageRequest);

    if(response == null || response == undefined){
      return;
    }

    ctx.setState({
      MessagesStateForm: {
        model: {
          messages: response
        }
      }
    })
  }

  @Selector()
  static messages(state: MessagesStateModel){
    return state.MessagesStateForm.model.messages;
  }
}