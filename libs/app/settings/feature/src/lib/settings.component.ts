import { ProfileDto } from '@encompass/api/profile/data-access';
import { NotificationsSettingsDto, ProfileSettingsDto, SettingsDto } from '@encompass/api/settings/data-access';
import { ProfileState } from '@encompass/app/profile/data-access';
import { SettingsState } from '@encompass/app/settings/data-access';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { SubscribeToProfile } from '@encompass/app/profile/util';
import { GetUserSettings, UpdateNotificationSettings, UpdateProfileSettings } from '@encompass/app/settings/util';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { AnimationController } from '@ionic/angular';
import { AccountDto } from '@encompass/api/account/data-access';
import { LoginState } from '@encompass/app/login/data-access';

@Component({
  selector: 'settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsPage{
  @Select(SettingsState.settings) settings$!: Observable<SettingsDto | null>;
  @Select(ProfileState.profile) profile$!: Observable<ProfileDto | null>;
  @Select(LoginState.loginModel) loginModel$!: Observable<AccountDto>;

  loginModel!: AccountDto | null;
  profile!: ProfileDto | null;
  settings!: SettingsDto | null;
  placeHolderText!: string;

  @ViewChild(IonContent, { static: false })
  content!: IonContent;

  scrollTo(elementId: string): void {
    const element = document.getElementById(elementId);
    if (element) {
      this.content.scrollToPoint(0, element.offsetTop, 500);
    }
  }


  labelHidden = true;

  constructor(private store: Store, private animationCtrl: AnimationController){
    this.store.dispatch(new SubscribeToProfile());
    this.profile$.subscribe((profile) => {
      if(profile){
        this.profile = profile;

        this.store.dispatch(new GetUserSettings(profile._id));
        this.settings$.subscribe((settings) => {
          if(settings){
            this.settings = settings;
            if(this.settings.messagePermissions == 'followers'){
              this.placeHolderText = 'Followers Only';
            }

            else{
              this.placeHolderText = 'No One';
            }
          }
        })
      }
    })

    this.loginModel$.subscribe((loginModel) => {
      if(loginModel){
        console.log(loginModel);
        this.loginModel = loginModel;
      }
    })
  }

  toggleLabel(show: boolean) {
    this.labelHidden = !show;
  }

  eventChange(btnName : string){
    
    const accBtn = document.getElementById('accBtn');
    const proBtn = document.getElementById('proBtn');
    const notBtn = document.getElementById('notBtn');
    const messBtn = document.getElementById('messBtn');
    const privBtn = document.getElementById('privBtn');

    if (accBtn && proBtn && notBtn && messBtn && privBtn) {
      if (btnName == 'accBtn'){
        accBtn.classList.add('active-button');
        proBtn.classList.remove('active-button');
        notBtn.classList.remove('active-button');
        messBtn.classList.remove('active-button');
        privBtn.classList.remove('active-button');
      }

      if (btnName == 'proBtn'){
        
        accBtn.classList.remove('active-button');
        proBtn.classList.add('active-button');
        notBtn.classList.remove('active-button');
        messBtn.classList.remove('active-button');
        privBtn.classList.remove('active-button');
      }

      if (btnName == 'notBtn'){
        accBtn.classList.remove('active-button');
        proBtn.classList.remove('active-button');
        notBtn.classList.add('active-button');
        messBtn.classList.remove('active-button');
        privBtn.classList.remove('active-button');
      }

      if (btnName == 'messBtn'){
        accBtn.classList.remove('active-button');
        proBtn.classList.remove('active-button');
        notBtn.classList.remove('active-button');
        messBtn.classList.add('active-button');
        privBtn.classList.remove('active-button');
      }

      if (btnName == 'privBtn'){
        accBtn.classList.remove('active-button');
        proBtn.classList.remove('active-button');
        notBtn.classList.remove('active-button');
        messBtn.classList.remove('active-button');
        privBtn.classList.add('active-button');
      }
      
    }else{
      if (accBtn == null){
        console.log('accBtn is null');
      }else if (proBtn == null){
        console.log('proBtn is null');
      }else if (notBtn == null){
        console.log('notBtn is null');
      }else if (messBtn == null){
        console.log('messBtn is null');
      }else if (privBtn == null){
        console.log('privBtn is null');
      }
    }
  }

  edit(fieldName: string){
    const field = fieldName;
    const account = document.getElementById(field + '-default');
    const editAccount = document.getElementById(field + '-click');
    const saveBtn = document.getElementById(field + '-saveButton');
    const editBtn = document.getElementById(field + '-editButton');

    if (account && editAccount && saveBtn && editBtn) {
      account.classList.add('onClick');
      editAccount.classList.remove('onClick');
      saveBtn.classList.remove('onClick');
      editBtn.classList.add('onClick');
    }else if (account == null){
      console.log('account is null');
    }else if (editAccount == null){
      console.log('editAccount is null');
    } else if (saveBtn == null){  
      console.log('saveBtn is null');
    } else if (editBtn == null){
      console.log('editBtn is null');
    }
  }

  save(fieldName: string){
    const field = fieldName;
    const account = document.getElementById(field + '-default');
    const editAccount = document.getElementById(field + '-click');
    const saveBtn = document.getElementById(field + '-saveButton');
    const editBtn = document.getElementById(field + '-editButton');

    if (account && editAccount && saveBtn && editBtn) {
      account.classList.remove('onClick');
      editAccount.classList.add('onClick');
      saveBtn.classList.add('onClick');
      editBtn.classList.remove('onClick');
    }else if (account == null){
      console.log('account is null');
    }else if (editAccount == null){
      console.log('editAccount is null');
    }else if (saveBtn == null){  
      console.log('saveBtn is null');
    } else if (editBtn == null){
      console.log('editBtn is null');
    }

    console.log(account)
    console.log(editAccount)
    console.log(saveBtn)
    console.log(editBtn)
  }

  profilePictureUrl = '';

  onProfilePictureSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const file = inputElement.files?.[0];
    
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.profilePictureUrl = e.target?.result as string;
      };
      reader.readAsDataURL(file);
      console.log('file: ', file);
    }
  }

  onBannerPictureSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const file = inputElement.files?.[0];
    
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.profilePictureUrl = e.target?.result as string;
      };
      reader.readAsDataURL(file);
      console.log('file: ', file);
    }
  }

  toggleChangedNotifications(event: any, toggleName: string) {
    console.log(toggleName + ': ' + event.detail.checked);

    if(this.settings == null || this.profile == null){
      return
    }

    let dms = this.settings.notifications.dms;
    let follows = this.settings.notifications.follows;
    let commentReplies = this.settings.notifications.commentReplies;
    let recomPosts = this.settings.notifications.recomPosts;
    let recomCC = this.settings.notifications.recomCC;

    if(toggleName == 'dms'){
      dms = event.detail.checked;
    }else if(toggleName == 'follows'){
      follows = event.detail.checked;
    }else if(toggleName == 'commentReplies'){
      commentReplies = event.detail.checked;
    }else if(toggleName == 'recomPosts'){
      recomPosts = event.detail.checked;
    }else if(toggleName == 'recomCC'){
      recomCC = event.detail.checked;
    }

    const data: NotificationsSettingsDto = {
      dms: dms,
      follows: follows,
      commentReplies: commentReplies,
      recomPosts: recomPosts,
      recomCC: recomCC,
    }

    this.store.dispatch(new UpdateNotificationSettings(this.profile._id, data))
  }
  
  toggleChangedProfile(event: any, toggleName: string) {
    console.log(toggleName + ': ' + event.detail.checked);

    if(this.settings == null || this.profile == null){
      return
    }

    let nsfw = this.settings.profile.nsfw;
    let followPermission = this.settings.profile.followPermission;

    if(toggleName == 'nsfw'){
      nsfw = event.detail.checked;
    }else if(toggleName == 'followPermission'){
      followPermission = event.detail.checked;
    }

    const data: ProfileSettingsDto = {
      nsfw: nsfw,
      followPermission: followPermission,
      blocked: this.settings.profile.blocked,
    }

    this.store.dispatch(new UpdateProfileSettings(this.profile._id, data))
  }

  presentingElement: Element | null | undefined;

  ngOnInit() {
    this.presentingElement = document.querySelector('.ion-page');
  }

  public alertButtons = ['Cancel', 'Save'];
  public alertInputs = [
    {
      type: 'password',
      placeholder: 'New Password',
      min: 8,
      max: 100,
    },
    {
      type: 'password',
      placeholder: 'Confirm New Password',
      min: 8,
      max: 100,
    },
  ];
}
