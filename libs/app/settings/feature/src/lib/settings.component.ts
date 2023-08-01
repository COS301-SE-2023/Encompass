import { ProfileDto, UpdateProfileRequest } from '@encompass/api/profile/data-access';
import { NotificationsSettingsDto, ProfileSettingsDto, SettingsDto } from '@encompass/api/settings/data-access';
import { ProfileState } from '@encompass/app/profile/data-access';
import { SettingsApi, SettingsState } from '@encompass/app/settings/data-access';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { SubscribeToProfile, UpdateProfile } from '@encompass/app/profile/util';
import { GetAccount, GetUserSettings, UpdateEmail, UpdateMessageSettings, UpdateNotificationSettings, UpdatePassword, UpdateProfileSettings } from '@encompass/app/settings/util';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { AlertController, AlertInput, IonContent } from '@ionic/angular';
import { AnimationController } from '@ionic/angular';
import { AccountDto } from '@encompass/api/account/data-access';
import { APP_BASE_HREF, DOCUMENT } from '@angular/common';
import { Inject } from '@angular/core';

@Component({
  selector: 'settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsPage{
  @Select(SettingsState.settings) settings$!: Observable<SettingsDto | null>;
  @Select(ProfileState.profile) profile$!: Observable<ProfileDto | null>;
  @Select(SettingsState.account) loginModel$!: Observable<AccountDto>;

  profileFile!: File;
  bannerFile!: File;
  profileName!: string;
  bannerName!: string;
  nameEdit!: string
  lastNameEdit!: string
  emailEdit!: string
  bioEdit!: string
  selectedValue!: string
  loginModel!: AccountDto | null;
  profile!: ProfileDto | null;
  settings!: SettingsDto | null;
  placeHolderText!: string;
  newPassword!: string;
  confirmNewPassword!: string;

  requiredFileType = ['image/png', 'image/jpg', 'image/jpeg'];

  @ViewChild(IonContent, { static: false })
  content!: IonContent;

  scrollTo(elementId: string): void {
    const element = document.getElementById(elementId);
    if (element) {
      this.content.scrollToPoint(0, element.offsetTop, 500);
    }
  }


  labelHidden = true;

  constructor(@Inject(DOCUMENT) private document: Document, private store: Store, private animationCtrl: AnimationController, private settingsApi: SettingsApi, private alertController: AlertController){
    this.store.dispatch(new SubscribeToProfile());
    this.profile$.subscribe((profile) => {
      if(profile){
        this.profile = profile;
        
        this.nameEdit = profile.name;
        this.lastNameEdit = profile.lastName;
        this.bioEdit = profile.bio;

        this.store.dispatch(new GetAccount(profile._id));
        this.loginModel$.subscribe((loginModel) => {
          if(loginModel){
            console.log(loginModel);
            this.loginModel = loginModel;
            this.emailEdit = loginModel.email;
          }
        })

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
    this.load();

  }

  load(){
    const page = document.getElementById('home-page');
  
  
      this.store.dispatch(new SubscribeToProfile())
      // this.store.dispatch(new SubscribeToProfile())
      this.profile$.subscribe((profile) => {
        if(profile){
          
          console.log("Profile CALLED")
          console.log(profile); 
          this.profile = profile;
          // this.addPosts("recommended");
          // this.newChange();
  
          this.store.dispatch(new GetUserSettings(this.profile._id))
          
          this.settings$.subscribe(settings => {
            if(settings){
              this.settings = settings;
              
              this.document.body.setAttribute('color-theme', this.settings.themes.themeColor);
              if (this.settings.themes.themeColor.startsWith('dark')) {
                const icons = document.getElementById('genreicons');
  
                if (icons) {
                  icons.style.filter = 'invert(1)';
                }
              }
              
              if(page){
                console.log("testing the feed page")
                console.log("hello " + this.settings.themes.themeImage);
                page.style.backgroundImage = `url(${this.settings.themes.themeImage})`;
              }else {
                console.log("page is null")
              }
            }
          })
          
        }
      });
  }

  toggleLabel(show: boolean) {
    this.labelHidden = !show;
  }

  eventChange(btnName : string){
    
    const accBtn = document.getElementById('accBtn');
    const proBtn = document.getElementById('proBtn');
    const notBtn = document.getElementById('notBtn');
    const messBtn = document.getElementById('messBtn');

    if (accBtn && proBtn && notBtn && messBtn) {
      if (btnName == 'accBtn'){
        accBtn.classList.add('active-button');
        proBtn.classList.remove('active-button');
        notBtn.classList.remove('active-button');
        messBtn.classList.remove('active-button');

      }

      if (btnName == 'proBtn'){
        
        accBtn.classList.remove('active-button');
        proBtn.classList.add('active-button');
        notBtn.classList.remove('active-button');
        messBtn.classList.remove('active-button');

      }

      if (btnName == 'notBtn'){
        accBtn.classList.remove('active-button');
        proBtn.classList.remove('active-button');
        notBtn.classList.add('active-button');
        messBtn.classList.remove('active-button');

      }

      if (btnName == 'messBtn'){
        accBtn.classList.remove('active-button');
        proBtn.classList.remove('active-button');
        notBtn.classList.remove('active-button');
        messBtn.classList.add('active-button');

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

  async save(fieldName: string){
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

    if(this.profile === null || this.loginModel === null){
      return;
    }

    if(fieldName === 'account'){
      const data: UpdateProfileRequest ={
        username: this.profile.username,
        name: this.nameEdit,
        lastName: this.lastNameEdit,
        categories: this.profile.categories,
        communities: this.profile.communities,
        awards: this.profile.awards,
        events: this.profile.events,
        followers: this.profile.followers,
        following: this.profile.following,
        posts: this.profile.posts,
        reviews: this.profile.reviews,
        profileImage: this.profile.profileImage,
        profileBanner: this.profile.profileBanner,
        bio: this.profile.bio,
      }

      this.store.dispatch(new UpdateProfile(data, this.profile._id))

      if(this.loginModel.email !== this.emailEdit){
        this.store.dispatch(new UpdateEmail(this.profile._id, this.emailEdit))
      }

      if(this.newPassword){
        if(this.newPassword === this.confirmNewPassword){
          this.store.dispatch(new UpdatePassword(this.profile._id, this.newPassword))
        }
      }
    }
    
    else{
      if(this.profile === null){
        return;
      }

      let imageUrl: string | null;
      let bannerUrl: string | null;

      if(this.profileFile){
        imageUrl = await this.uploadImage(this.profileFile, this.profileName);

        if(imageUrl === null){
          imageUrl = this.profile.profileImage;
        }
      }

      else{
        imageUrl = this.profile.profileImage;
      }

      if(this.bannerFile){
        bannerUrl = await this.uploadImage(this.bannerFile, this.bannerName);

        if(bannerUrl === null){
          bannerUrl = this.profile.profileBanner;
        }
      }

      else{
        bannerUrl = this.profile.profileBanner;
      }

      console.log(this.bioEdit)

      const data: UpdateProfileRequest ={
        username: this.profile.username,
        name: this.profile.name,
        lastName: this.profile.lastName,
        categories: this.profile.categories,
        communities: this.profile.communities,
        awards: this.profile.awards,
        events: this.profile.events,
        followers: this.profile.followers,
        following: this.profile.following,
        posts: this.profile.posts,
        reviews: this.profile.reviews,
        profileImage: imageUrl,
        profileBanner: bannerUrl,
        bio: this.bioEdit,
      }

      this.store.dispatch(new UpdateProfile(data, this.profile._id))
    }
  }

  profilePictureUrl = '';
  bannerPictureUrl = '';

  onProfilePictureSelected(event: any): void {

    console.log('Profile')
  const file : File = event.target.files[0];
  
  if (file) {
    // const reader = new FileReader();
    // reader.onload = (e) => {
    //   this.profilePictureUrl = e.target?.result as string;
    // };
    // reader.readAsDataURL(file);
    // console.log('file: ', file);

    this.profileFile = file;
    this.profileName = file.name;
  }
}

  onBannerPictureSelected(event: any): void {
    // const inputElement = event.target as HTMLInputElement;
    console.log('Banner')
    const file:File = event.target.files[0];
    
    if (file) {
      // const reader = new FileReader();
      // reader.onload = (e) => {
      //   this.profilePictureUrl = e.target?.result as string;
      // };
      // reader.readAsDataURL(file);
      // console.log('file: ', file);

      this.bannerFile = file;
      this.bannerName = file.name;
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

  onSelectChange(){
    if(this.profile == null){
      return
    }

    console.log(this.selectedValue)

    this.store.dispatch(new UpdateMessageSettings(this.profile._id, this.selectedValue))
  }

  async uploadImage(file: File, fileName: string) : Promise<string | null>{
    return new Promise((resolve) => {
      const formData = new FormData();
      formData.append('file', file, fileName);

      const uploadFile = this.settingsApi.uploadFile(formData)
      console.log(uploadFile);
      resolve(uploadFile);
    })
  }

  // async presentAlert() {
  //   return new Promise<void>(async (resolve) => {
  //     const alert = await this.alertController.create({
  //       header: 'Enter new Password',
  //       buttons: this.alertButtons,
  //       inputs: this.alertInputs,
  //     });

  //     await alert.present();

  //     alert.onDidDismiss().then((data) => {
  //       if (data && data.role === 'save') {
  //         const enteredData = data.data.values;
  //         if (enteredData) {
  //           this.newPassword = enteredData.pass;
  //           this.confirmNewPassword = enteredData.confirmPass;
  //           console.log('New Password:', this.newPassword);
  //           console.log('Confirm New Password:', this.confirmNewPassword);

  //           // You can use the captured values 'this.newPassword' and 'this.confirmNewPassword' as needed.
  //         }
  //       }

  //       resolve();
  //     });
  //   });
  // }

  presentAlert(): Promise<void> {
    return new Promise<void>((resolve) => {
      const alert = this.alertController.create({
        header: 'Enter new Password',
        buttons: this.alertButtons,
        inputs: this.alertInputs,
      });
  
      alert.then((alertEl) => {
        alertEl.present();
        alertEl.onDidDismiss().then((data) => {
          if (data && data.role === 'save') {
            const enteredData = data.data.values;
            if (enteredData) {
              this.newPassword = enteredData.pass;
              this.confirmNewPassword = enteredData.confirmPass;
              console.log('New Password:', this.newPassword);
              console.log('Confirm New Password:', this.confirmNewPassword);
  
              // You can use the captured values 'this.newPassword' and 'this.confirmNewPassword' as needed.
            }
          }
  
          resolve();
        });
      });
    });
  }

  alertButtons = [
    {
      text: 'Cancel',
      role: 'cancel',
    },
    {
      text: 'Save',
      role: 'save',
    },
  ];
  public alertInputs: AlertInput[] = [
    {
      name: "pass",
      type: 'password',
      placeholder: 'New Password',
      min: 8,
      max: 100,
    },
    {
      name: "confirmPass",
      type: 'password',
      placeholder: 'Confirm New Password',
      min: 8,
      max: 100,
    },
  ];


}
