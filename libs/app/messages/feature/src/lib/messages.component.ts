import { Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MessagesState } from '@encompass/app/messages/data-access';
import { GateWayAddMessageRequest, ChatDto } from '@encompass/api/chat/data-access';
import { Select } from '@ngxs/store';
import { GetMessages, SendMessage } from '@encompass/app/messages/util';
import { ProfileState } from '@encompass/app/profile/data-access';
import { ProfileDto } from '@encompass/api/profile/data-access';
import { SubscribeToProfile } from '@encompass/app/profile/util';

@Component({
  selector: 'messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesPage {

  @Select(MessagesState.messages) messages$!: Observable<ChatDto | null>;
  @Select(ProfileState.profile) profile$!: Observable<ProfileDto | null>;

  messages!: ChatDto | null;
  profile!: ProfileDto | null;

  constructor(private store: Store, private router: Router){
    this.store.dispatch(new SubscribeToProfile());
    this.profile$.subscribe((profile) => {
      if(profile){
        this.profile = profile;
      }
    })

    this.store.dispatch(new GetMessages('64a6a388c8b736d7942f727e'));
    this.messages$.subscribe((messages) => {
      console.log(messages);
      if(messages){
        this.messages = messages;
      }
    })
  }

  sendMessage(){
    if(!this.profile){
      return;
    }

    const data: GateWayAddMessageRequest = {
      message: "Hello",
      username: this.profile?.username,
      chatId: '64a6a388c8b736d7942f727e'
    }

    this.store.dispatch(new SendMessage(data));
  }
}
