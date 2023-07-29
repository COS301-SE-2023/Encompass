import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { HomeApi } from '@encompass/app/home-page/data-access';
import { Select, Store } from '@ngxs/store';
import { HomeState } from '@encompass/app/home-page/data-access';
import { Observable } from 'rxjs';
import { HomeDto } from '@encompass/api/home/data-access';
import { Router } from '@angular/router';
import { ClearAllNotifications, ClearNotification, GetAllPosts, GetNotifications, getHome } from '@encompass/app/home-page/util';
import { Console } from 'console';
import { ProfileState } from '@encompass/app/profile/data-access';
import { ProfileDto } from '@encompass/api/profile/data-access';
import { SubscribeToProfile } from '@encompass/app/profile/util';
import { ModalController } from '@ionic/angular';
import {CreatePostComponent} from '@encompass/app/create-post/feature';
import { PostDto } from '@encompass/api/post/data-access';
import {CreateCommunityComponent} from '@encompass/app/create-community/feature';
import { PopoverController } from '@ionic/angular';
import { NotificationDto } from '@encompass/api/notifications/data-access';
import { DatePipe } from '@angular/common';
import { SettingsState } from '@encompass/app/settings/data-access';
import { SettingsDto } from '@encompass/api/settings/data-access';
import { GetUserSettings } from '@encompass/app/settings/util';
import { trigger, state, style, animate, transition } from '@angular/animations';


@Component({
  selector: 'home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  animations: [
    trigger('slideIn', [
      state('in', style({ transform: 'translateX(0)' })),
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('300ms ease-in-out')
      ]),
      transition(':leave', animate('300ms ease-in-out', style({ transform: 'translateX(-100%)' })))
    ])
  ]
})
export class HomePage {
  @Select(ProfileState.profile) profile$! : Observable<ProfileDto | null>;
  @Select(HomeState.notifications) notifications$! : Observable<NotificationDto | null>;
  @Select(SettingsState.settings) settings$!: Observable<SettingsDto | null>
  // @Select(HomeState.homePosts) homePosts$! : Observable<PostDto[] | null>;

  settings!: SettingsDto | null;
  profile! : ProfileDto | null;
  notifications! : NotificationDto | null;
  themeName!: string;

  constructor(@Inject(DOCUMENT) private document: Document, private router: Router, private store: Store, private datePipe: DatePipe){
    

    this.load();
  }

  load() {
    const page = document.getElementById('home-page');

    this.store.dispatch(new SubscribeToProfile())
    this.profile$.subscribe((profile) => {
      if(profile){
        console.log(profile);
        this.profile = profile;

        this.store.dispatch(new GetUserSettings(this.profile._id))
        this.settings$.subscribe(settings => {
          if(settings){
            this.settings = settings;

            this.document.body.setAttribute('color-theme', this.settings.themes.themeColor);
            
            this.themeName = this.settings.themes.themeColor;
            
           console.log(this.themeName);

           const defaultLogo = document.getElementById('logo-default');
            const redLogo = document.getElementById('logo-red');
            const blueLogo = document.getElementById('logo-blue');
            const greenLogo = document.getElementById('logo-green');
            const orangeLogo = document.getElementById('logo-orange');

            if (defaultLogo && redLogo && blueLogo && greenLogo && orangeLogo){
              // console.log('default logosssssssssssssssssssssssssssssssss1');
              console.log(this.themeName);
              if (this.themeName == 'light-red' || this.themeName == 'dark-red') {
                redLogo.classList.remove('visible');
                defaultLogo.classList.add('visible');
                blueLogo.classList.add('visible');
                greenLogo.classList.add('visible');
                orangeLogo.classList.add('visible');
              }else if (this.themeName == 'light-blue' || this.themeName == 'dark-blue') {
                // console.log('BLUEEEEEEEEEEEEEEEEEEEEEEEEEEEE');
                blueLogo.classList.remove('visible');
                defaultLogo.classList.add('visible');
                redLogo.classList.add('visible');
                greenLogo.classList.add('visible');
                orangeLogo.classList.add('visible');
            } else if (this.themeName == 'light-green' || this.themeName == 'dark-green') {
                greenLogo.classList.remove('visible');
                defaultLogo.classList.add('visible');
                redLogo.classList.add('visible');
                blueLogo.classList.add('visible');
                orangeLogo.classList.add('visible');
            }else if (this.themeName == 'light-orange' || this.themeName == 'dark-orange') {
              orangeLogo.classList.remove('visible');
              defaultLogo.classList.add('visible');
              redLogo.classList.add('visible');
              blueLogo.classList.add('visible');
              greenLogo.classList.add('visible');
            }else {
              defaultLogo.classList.remove('visible');
              redLogo.classList.add('visible');
              blueLogo.classList.add('visible');
              greenLogo.classList.add('visible');
              orangeLogo.classList.add('visible');
            }
            }

            if(page){
              page.style.backgroundImage = `url(${this.settings.themes.themeImage})`;
              // page.style.backgroundImage = "blue";
            }
          }
        })
      }
    })
  }



  goToProfile() {
    this.routerClick();
    this.router.navigate(['/home/profile']);
  }

  goHome() {
    this.routerClick();
    this.router.navigate(['/home/feed']);
  }

  GoToComments(){
    this.routerClick();
    this.router.navigate(['app-comments-feature']);
  }

  goToExplore(){
    this.routerClick();
    // this.router.navigate(['/home/explore']);
     this.router.navigate(['/home/search-explore']);
  }

  goToChat(){
     this.router.navigate(['/home/messages']);
  }

  goToSettings(){
    this.routerClick();
    this.router.navigate(['/home/settings']);
  }

  goToThemes(){
    this.routerClick();
    this.router.navigate(['/home/themes']);
  }

  goToEvents(){
    this.routerClick();
    // this.router.navigate(['/home/events']);
  }


  clearNotification(id: string){
    if(this.profile == null){
      return;
    }
    
    this.store.dispatch(new ClearNotification(this.profile._id, id));
  }

  clearAllNotifications(){
    if(this.profile == null){
      return;
    }

    this.store.dispatch(new ClearAllNotifications(this.profile._id));
  }

  logout() {
    localStorage.removeItem('UserID')
    this.router.navigate(['/']);
  }

  showNotifications = false;
  showSearch = false;

  toggleNotifications() {
    if(this.profile == null){
      console.log('you are not logged in?');
      return;
    }

    this.showSearch = false;
    this.showNotifications = !this.showNotifications;

    if(this.showNotifications){
      this.store.dispatch(new GetNotifications(this.profile._id));
      this.notifications$.subscribe((notifications) => {
        if(notifications){
          console.log(notifications);
          this.notifications = notifications;
        }
      })
    }
  }

  toggleSearch() {
    this.showNotifications = false;
    this.showSearch = !this.showSearch;
  }

  routerClick() {
    this.showNotifications = false;
    this.showSearch = false;
  }


}
