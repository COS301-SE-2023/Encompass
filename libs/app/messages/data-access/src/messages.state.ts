import { Injectable } from "@angular/core";
import { ChatDto } from "@encompass/api/chat/data-access";
import { State, Action, StateContext } from "@ngxs/store";
import { MessagesApi } from "./messages.api";
import { GetMessages } from "@encompass/app/messages/util";

export interface MessagesStateModel{
  MessagesStateForm: {
    model:{
      messages: ChatDto[] | null
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
  async getMessages(ctx: StateContext<MessagesStateModel>, {chatId}: GetMessages){
    const response = await this.messagesApi.getMessages(chatId);

    console.log(response);

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
}