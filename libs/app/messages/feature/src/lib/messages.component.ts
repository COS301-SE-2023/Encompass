import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Router } from '@angular/router';
import { Observable, Subject, takeUntil } from 'rxjs';
import { MessagesState } from '@encompass/app/messages/data-access';
import {
  GateWayAddMessageRequest,
  ChatDto,
} from '@encompass/api/chat/data-access';
import { Select } from '@ngxs/store';
import {
  CreateChat,
  GetChatList,
  GetMessages,
  GetNewChats,
  GetUserInformation,
  SendMessage,
  SendingNotification,
} from '@encompass/app/messages/util';
import { ProfileState } from '@encompass/app/profile/data-access';
import { ProfileDto } from '@encompass/api/profile/data-access';
import { SubscribeToProfile } from '@encompass/app/profile/util';
import { ChatListDto } from '@encompass/api/chat-list/data-access';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessagesDto } from '@encompass/api/chat/data-access';
import { take } from 'rxjs/operators';
import { AddNotificationRequest } from '@encompass/api/notifications/data-access';
import { SettingsState } from '@encompass/app/settings/data-access';
import { SettingsDto } from '@encompass/api/settings/data-access';
import { GetUserSettings } from '@encompass/app/settings/util';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesPage implements OnDestroy {
  @Select(MessagesState.messages) messages$!: Observable<ChatDto | null>;
  @Select(ProfileState.profile) profile$!: Observable<ProfileDto | null>;
  @Select(MessagesState.chatList) chatList$!: Observable<ChatListDto | null>;
  @Select(MessagesState.messagesDto) chatProfiles$!: Observable<
    MessagesDto[] | null
  >;
  @Select(MessagesState.messagesProfile) messagesProfile$!: Observable<
    ProfileDto[] | null
  >;
  @Select(SettingsState.settings) settings$!: Observable<SettingsDto | null>;

  private unsubscribe$: Subject<void> = new Subject<void>();

  settings!: SettingsDto | null;
  isGetNewChatsDispatched = false;
  isGetUserInformationDispatched = false;
  selectedValue!: ProfileDto;
  messages!: ChatDto | null;
  profile!: ProfileDto | null;
  chatProfiles!: MessagesDto[] | null;
  chatList!: ChatListDto | null;
  messagesProfile!: ProfileDto[] | null;
  hasMessages = false;
  firstName!: string;
  lastName!: string;
  userImage!: string;
  username!: string;
  isValid = false;
  inputValue!: string;

  selectedOption!: string;
  selectOpen = false;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private store: Store,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    const page = document.getElementById('home-page');

    this.store.dispatch(new SubscribeToProfile());
    this.profile$.subscribe((profile) => {
      if (profile) {
        this.profile = profile;

        this.store.dispatch(new GetChatList(profile.username));
        this.chatList$.subscribe((chatList) => {
          if (chatList) {
            this.chatList = chatList;

            if (!this.isGetUserInformationDispatched) {
              this.isGetUserInformationDispatched = true;
              this.store
                .dispatch(new GetUserInformation(chatList))
                .subscribe(() => {
                  this.chatProfiles$
                    .pipe(takeUntil(this.unsubscribe$))
                    .subscribe((chatProfiles) => {
                      if (chatProfiles) {
                        console.log(chatProfiles);
                        this.chatProfiles = chatProfiles;
                        if (chatProfiles[0]){
                          this.fetchMessages(chatProfiles[0].chatId, chatProfiles[0].name, chatProfiles[0].lastName, chatProfiles[0].profilePicture, chatProfiles[0].username);
                        }
                      }
                    });
                });
            }
          }
        });

        this.store.dispatch(new GetUserSettings(profile._id));
        this.settings$.subscribe((settings) => {
          if (settings) {
            this.settings = settings;

            this.document.body.setAttribute(
              'color-theme',
              this.settings.themes.themeColor
            );

            if (page) {
              page.style.backgroundImage = `url(${this.settings.themes.themeImage})`;
              // page.style.backgroundImage = "blue";
            }
          }
        });
      }
    });
  }

  messageForm = this.formBuilder.group({
    messageInput: ['', Validators.maxLength(150)],
  });

  ngOnDestroy() {
    // Unsubscribe to avoid memory leaks
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  get messageInput() {
    return this.messageForm.get('messageInput');
  }
  sendMessage() {
    if (
      this.messageInput?.value == null ||
      this.messageInput?.value == undefined
    ) {
      return;
    }
    console.log(this.messageInput.value);
    if (!this.profile || !this.messages) {
      return;
    }

    const data: GateWayAddMessageRequest = {
      message: this.messageInput.value,
      username: this.profile?.username,
      chatId: this.messages?._id,
    };

    const notification: AddNotificationRequest = {
      sentBy: this.profile.name + ' ' + this.profile.lastName,
      picture: this.profile.profileImage,
      title: 'Has sent you a message',
      description: this.messageInput.value.substring(0, 20) + '...',
    };

    this.store.dispatch(new SendMessage(data));
    this.store.dispatch(new SendingNotification(this.username, notification));
    this.messageForm.reset();
  }

  fetchMessages(
    chatId: string,
    first: string,
    last: string,
    image: string,
    username: string
  ) {
    this.username = username;
    this.userImage = image;
    this.firstName = first;
    this.lastName = last;
    this.store.dispatch(new GetMessages(chatId));
    this.messages$.subscribe((messages) => {
      console.log(messages);
      if (messages) {
        this.messages = messages;
        this.hasMessages = true;
      }
    });
  }

  toggleSelect() {
    this.selectOpen = !this.selectOpen;
  }

  onSelectChange() {
    // console.log("here");
    // console.log('Selected value:', this.selectedValue);
    if (this.profile == null) {
      return;
    }

    this.store.dispatch(
      new CreateChat(
        [this.profile.username, this.selectedValue.username],
        this.profile.username
      )
    );

    this.isGetNewChatsDispatched = false;
    this.store.dispatch(new GetChatList(this.profile.username));
    this.chatList$.subscribe((chatList) => {
      if (chatList) {

        console.log(chatList);

        this.chatList = chatList;

        this.store.dispatch(new GetUserInformation(chatList));
        this.chatProfiles$
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe((chatProfiles) => {
            if (chatProfiles) {
              console.log(chatProfiles);
              this.chatProfiles = chatProfiles;
              if (chatProfiles.length > 0) {
                const lastProfile = chatProfiles[chatProfiles.length - 1]; 
                this.fetchMessages(
                  lastProfile.chatId,
                  lastProfile.name,
                  lastProfile.lastName,
                  lastProfile.profilePicture,
                  lastProfile.username
                );
              }
              
            }
          });

      }
    });
  }

  getUsers() {
    if (!this.profile) {
      console.log('Profile is null');
      return;
    }

    if (this.isGetNewChatsDispatched) {
      console.log('Get new chats already dispatched');
      return;
    }

    // Dispatch the action only once
    this.isGetNewChatsDispatched = true;
    const searchList = this.profile.following.filter(
      (x) => !this.chatProfiles?.some((y) => y.username === x)
    );

    this.store.dispatch(new GetNewChats(searchList)).subscribe(() => {
      // Subscribe to messagesProfile$ to update messagesProfile and chatOptions
      this.messagesProfile$
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((messagesProfile) => {
          if (messagesProfile) {
            console.log(messagesProfile);
            this.messagesProfile = messagesProfile;
          }
        });
    });
  }

  checkInput() {
    if (
      this.messageInput?.value == null ||
      this.messageInput?.value == undefined ||
      this.messageInput?.value == ''
    ) {
      this.isValid = false;
    } else {
      this.isValid = true;
    }
  }

  mobileview = false;
  openChats = true;

  updateMobileView() {
    this.mobileview = window.innerWidth <= 992;
  }

  ngOnInit() {
    this.updateMobileView();
    window.addEventListener('resize', this.updateMobileView.bind(this));
  }

  closeChats(value: boolean) {
    this.openChats = value;
  }

  
}
