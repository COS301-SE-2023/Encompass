import { Component } from '@angular/core';
import { HomeApi } from '@encompass/app/home-page/data-access';
import { Select, Store } from '@ngxs/store';
import { HomeState } from '@encompass/app/home-page/data-access';
import { Observable } from 'rxjs';
import { HomeDto } from '@encompass/api/home/data-access';
import { Router } from '@angular/router';
import { GetAllPosts, getHome } from '@encompass/app/home-page/util';
import { Console } from 'console';
import { ProfileState } from '@encompass/app/profile/data-access';
import { ProfileDto } from '@encompass/api/profile/data-access';
import { SubscribeToProfile } from '@encompass/app/profile/util';
import { ModalController } from '@ionic/angular';
import {CreatePostComponent} from '@encompass/app/create-post/feature';
import { PostDto } from '@encompass/api/post/data-access';
import {CreateCommunityComponent} from '@encompass/app/create-community/feature';
import { PopoverController } from '@ionic/angular';


@Component({
  selector: 'home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePage {
  // @Select(ProfileState.profile) profile$! : Observable<ProfileDto | null>;
  // @Select(HomeState.homePosts) homePosts$! : Observable<PostDto[] | null>;
  
  // profile! : ProfileDto | null;
  // posts! : PostDto[] | null;
  // reports : boolean[] =[];
  // images : string[] = [];

  constructor(private router: Router){}
  // constructor(private router: Router, private store: Store, private modalController: ModalController, private popoverController: PopoverController){
  //     this.store.dispatch(new SubscribeToProfile())
  //     this.profile$.subscribe((profile) => {
  //       if(profile){
  //         console.log(profile);
  //         this.profile = profile;
  //       }
  //     });

  //     this.store.dispatch(new GetAllPosts());
  //     this.homePosts$.subscribe((posts) => {
  //       if(posts){
  //         console.log(posts);
  //         console.log(posts.length)
  //         this.posts = posts;
  //         for(let i =0;i<posts.length;i++){
  //               this.reports.push(false);
  //             } 
  //             console.log(this.reports);
  //       }
  //     })

  // }

  // async openPopup() {
  //   const modal = await this.modalController.create({
  //     component: CreatePostComponent,
  //     cssClass: 'custom-modal', // Replace with the component or template for your popup
  //     componentProps: {
  //       // Add any input properties or data you want to pass to the popup component
  //     }
  //   });
  
  //   return await modal.present();
  // }

  // async openPopup2() {
  //   const modal = await this.modalController.create({
  //     component: CreateCommunityComponent,
  //     cssClass: 'custom-modal', // Replace with the component or template for your popup
  //     componentProps: {
  //       // Add any input properties or data you want to pass to the popup component
  //     }
  //   });
  
  //   return await modal.present();
  // }

  // Report(n:number){
  //   if(this.reports[n]==true){
  //     this.reports[n]=false;
  //   }else if(this.reports[n]==false){
  //     this.reports[n]=true;
  //   }
   
  // }
  
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

  showSearchPanel = false;

  OpenSearch() {
    
    const menuItem = document.getElementById('main-content');
    const search = document.getElementById('search-card');
    const notifications = document.getElementById('notifications-card');

    if (menuItem && this.showSearchPanel == false && search && notifications) {
      if (this.showNotificationsPanel == true) {
        notifications.style.setProperty('display', 'none');
        this.showNotificationsPanel = false;
      }
      // menuItem.classList.remove('menu-pane');
      // menuItem.classList.add('notifications-menu-pane');
      search.style.setProperty('display', 'block');
      this.showSearchPanel = true;
    } else if (menuItem && this.showSearchPanel == true && search ) {
      // menuItem.classList.add('menu-pane');
      // menuItem.classList.remove('notifications-menu-pane');
      search.style.setProperty('display', 'none');
      this.showSearchPanel = false;
    }

    
  }

  goToExplore(){
    this.routerClick();
    // this.router.navigate(['/home/explore']);
  }

  goToChat(){
    this.routerClick();
    // this.router.navigate(['/home/chat']);
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

  logout(){
    this.router.navigate(['/']);
  }

  showNotificationsPanel = false;

  openNotifications() {

    const menuItem = document.getElementById('main-content');
    const notifications = document.getElementById('notifications-card');
    const search = document.getElementById('search-card');

    if (menuItem && this.showNotificationsPanel == false && notifications && search) {
      if (this.showSearchPanel == true) {
        search.style.setProperty('display', 'none');
        this.showSearchPanel = false;
      }
      // menuItem.classList.remove('menu-pane');
      // menuItem.classList.add('notifications-menu-pane');
      notifications.style.setProperty('display', 'block');
      this.showNotificationsPanel = true;
    } else if (menuItem && this.showNotificationsPanel == true && notifications) {
      // menuItem.classList.add('menu-pane');
      // menuItem.classList.remove('notifications-menu-pane');
      notifications.style.setProperty('display', 'none');
      this.showNotificationsPanel = false;
    }

    
  }

  routerClick() {
    const menuItem = document.getElementById('main-content');
    const notifications = document.getElementById('notifications-card');
    const search = document.getElementById('search-card');

    if (menuItem && notifications && search) {
      if (this.showSearchPanel == true) {
        search.style.setProperty('display', 'none');
        this.showSearchPanel = false;
      }

      if (this.showNotificationsPanel == true) {
        notifications.style.setProperty('display', 'none');
        this.showNotificationsPanel = false;
      }
    }
  }


}
