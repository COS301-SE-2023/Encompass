import { Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MessagesState } from '@encompass/app/messages/data-access';
import { GateWayAddMessageRequest, ChatDto } from '@encompass/api/chat/data-access';
import { Select } from '@ngxs/store';
import { GetChatList, GetMessages, GetUserInformation, SendMessage } from '@encompass/app/messages/util';
import { ProfileState } from '@encompass/app/profile/data-access';
import { ProfileDto } from '@encompass/api/profile/data-access';
import { SubscribeToProfile } from '@encompass/app/profile/util';
import { ChatListDto } from '@encompass/api/chat-list/data-access';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessagesDto } from '@encompass/api/chat/data-access';

@Component({
  selector: 'messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesPage {

  @Select(MessagesState.messages) messages$!: Observable<ChatDto | null>;
  @Select(ProfileState.profile) profile$!: Observable<ProfileDto | null>;
  @Select(MessagesState.chatList) chatList$!: Observable<ChatListDto | null>;
  @Select(MessagesState.messagesDto) chatProfiles$!: Observable<MessagesDto[] | null>;

  messages!: ChatDto | null;
  profile!: ProfileDto | null;
  chatProfiles!: MessagesDto[] | null;
  chatList!: ChatListDto | null;
  hasMessages = false;
  firstName!: string;
  lastName!: string;
  userImage!: string;

  selectedOption!: string;
  selectOpen = false;

  chatOptions: string[] = ["Delete Chat", "Block User"];

  constructor(private store: Store, private router: Router, private formBuilder: FormBuilder){
    this.store.dispatch(new SubscribeToProfile());
    this.profile$.subscribe((profile) => {
      if(profile){
        this.profile = profile;

        this.store.dispatch(new GetChatList(profile.username))
        this.chatList$.subscribe((chatList) => {
          if(chatList){
            this.chatList = chatList

            this.store.dispatch(new GetUserInformation(chatList))
            this.chatProfiles$.subscribe((chatProfiles) => {
              if(chatProfiles){
                console.log(chatProfiles)
                this.chatProfiles = chatProfiles;
              }
            })
          }
        })
      }
    })
  }

  messageForm = this.formBuilder.group({
    messageInput: ['', Validators.maxLength(150)],
  });

  get messageInput(){
    return this.messageForm.get('messageInput');
  }
  sendMessage(){

    if(this.messageInput?.value == null || this.messageInput?.value == undefined){
      return;
    }
    console.log(this.messageInput.value);
    if(!this.profile || !this.messages){
      return;
    }

    const data: GateWayAddMessageRequest = {
      message: this.messageInput.value,
      username: this.profile?.username,
      chatId: this.messages?._id
    }

    this.store.dispatch(new SendMessage(data));
  }

  fetchMessages(chatId: string,first: string,last:string,image: string){
    this.userImage=image;
    this.firstName=first;
    this.lastName=last;
    this.store.dispatch(new GetMessages(chatId));
    this.messages$.subscribe((messages) => {
      console.log(messages);
      if(messages){
        this.messages = messages;
        this.hasMessages = true;
      }
    })
  }

  toggleSelect() {
    this.selectOpen = !this.selectOpen;
  }

  onOptionChange() {
    // Handle option change logic here if needed
    console.log(this.selectedOption);
  }
}
