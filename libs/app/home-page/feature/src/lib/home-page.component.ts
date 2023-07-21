import { Component } from '@angular/core';
import { HomeApi } from '@encompass/app/home-page/data-access';
import { Select, Store } from '@ngxs/store';
import { HomeState } from '@encompass/app/home-page/data-access';
import { Observable } from 'rxjs';
import { HomeDto } from '@encompass/api/home/data-access';
import { Router } from '@angular/router';
import { ClearNotification, GetAllPosts, GetNotifications, getHome } from '@encompass/app/home-page/util';
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


@Component({
  selector: 'home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePage {
  @Select(ProfileState.profile) profile$! : Observable<ProfileDto | null>;
  @Select(HomeState.notifications) notifications$! : Observable<NotificationDto | null>;
  // @Select(HomeState.homePosts) homePosts$! : Observable<PostDto[] | null>;

  profile! : ProfileDto | null;
  notifications! : NotificationDto | null;

  constructor(private router: Router, private store: Store, private datePipe: DatePipe){
    this.store.dispatch(new SubscribeToProfile())
    this.profile$.subscribe((profile) => {
      if(profile){
        console.log(profile);
        this.profile = profile;
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

  logout() {
    localStorage.removeItem('UserID')
    this.router.navigate(['/']);
  }

  showNotifications = false;
  showSearch = false;

  toggleNotifications() {
    if(this.profile == null){
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
