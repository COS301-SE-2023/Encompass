import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { HomeApi } from '@encompass/app/home-page/data-access';
import { Select, Store } from '@ngxs/store';
import { HomeState } from '@encompass/app/home-page/data-access';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import {
  ClearAllNotifications,
  ClearNotification,
  GetNotifications,
  getHome,
} from '@encompass/app/home-page/util';
import { Console } from 'console';
import { ProfileState } from '@encompass/app/profile/data-access';
import { ProfileDto } from '@encompass/api/profile/data-access';
import { SubscribeToProfile } from '@encompass/app/profile/util';
import { MenuController, ModalController } from '@ionic/angular';
import { CreatePostComponent } from '@encompass/app/create-post/feature';
import { PostDto } from '@encompass/api/post/data-access';
import { CreateCommunityComponent } from '@encompass/app/create-community/feature';
import { PopoverController } from '@ionic/angular';
import { NotificationDto } from '@encompass/api/notifications/data-access';
import { DatePipe } from '@angular/common';
import { SettingsState } from '@encompass/app/settings/data-access';
import { SettingsDto } from '@encompass/api/settings/data-access';
import { GetUserSettings } from '@encompass/app/settings/util';

import { SearchState } from '@encompass/app/search-explore/data-access';
import { SearchApi } from '@encompass/app/search-explore/data-access';
import { CommunityDto } from '@encompass/api/community/data-access';
import { takeUntil, pipe, Subject, take } from 'rxjs';
import {
  SearchCommunities,
  SearchPosts,
  SearchProfiles,
} from '@encompass/app/search-explore/util';

@Component({
  selector: 'home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePage {
  @Select(ProfileState.profile) profile$!: Observable<ProfileDto | null>;
  @Select(HomeState.notifications)
  notifications$!: Observable<NotificationDto | null>;
  @Select(SettingsState.settings) settings$!: Observable<SettingsDto | null>;
  // @Select(HomeState.homePosts) homePosts$! : Observable<PostDto[] | null>;
  // @Select(SearchState.searchPosts) searchPosts$!: Observable<PostDto[] | null>;
  // @Select(SearchState.searchProfiles) searchProfiles$!: Observable<
  //   ProfileDto[] | null
  // >;
  // @Select(SearchState.searchCommunities) searchCommunities$!: Observable<
  //   CommunityDto[] | null
  // >;

  private unsubscribe$: Subject<void> = new Subject<void>();

  settings!: SettingsDto | null;
  profile!: ProfileDto | null;
  notifications!: NotificationDto | null;
  themeName!: string;
  postsIsFetched = false;
  settingsIsFetched = false;
  peopleIsFetched = false;
  profileIsFetched = false;
  keyword = 'term';
  searchprofiles!: ProfileDto[];
  peopleExists = false;
  mobileview = false;
  default = false;
  red = false;
  blue = false;
  green = false;
  orange = false;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
    private modalController: ModalController,
    private store: Store,
    private datePipe: DatePipe,
    private searchApi: SearchApi,
    public menuCtrl: MenuController
  ) {
    const storedKeyword = localStorage.getItem('keyword');
    // console.log('STORED KEYWORD: ' + storedKeyword);
    this.load();
  }

  ngOnInit() {
    this.updateMobileView();
    window.addEventListener('resize', this.updateMobileView.bind(this));
  }

  updateMobileView() {
    this.mobileview = window.innerWidth <= 992;
    // console.log(window.innerWidth);
  }

  openFirstMenu() {
    // Open the menu by menu-id
    this.menuCtrl.enable(true, 'first-menu');
    this.menuCtrl.open('first-menu');
  }

  menuOpened() {
    // console.log('Menu opened ' + this.themeName);

    this.default = false;
    this.red = false;
    this.blue = false;
    this.green = false;
    this.orange = false;

    if (this.themeName == 'dark-red' || this.themeName == 'light-red') {
      this.red = true;
    } else if (
      this.themeName == 'dark-blue' ||
      this.themeName == 'light-blue'
    ) {
      this.blue = true;
    } else if (
      this.themeName == 'dark-green' ||
      this.themeName == 'light-green'
    ) {
      this.green = true;
    } else if (
      this.themeName == 'dark-orange' ||
      this.themeName == 'light-orange'
    ) {
      this.orange = true;
    } else {
      this.default = true;
    }
  }

  async openPopup() {
    this.menuCtrl.close('first-menu');
    const modal = await this.modalController.create({
      component: CreatePostComponent,
      cssClass: 'custom-modal',
      componentProps: {},
    });

    return await modal.present();
  }

  async openPopup2() {
    this.menuCtrl.close('first-menu');
    const modal = await this.modalController.create({
      component: CreateCommunityComponent,
      cssClass: 'custom-modal',
      componentProps: {},
    });

    return await modal.present();
  }

  async search(event: any) {
    this.keyword = event.detail.value;
    // console.log('KEYWORD: ' + this.keyword);

    if (!this.keyword) {
      // If the search keyword is empty, return
      return;
    } else {
      this.addPeople('people', this.keyword);
      this.peopleExists = true;
      localStorage.setItem('keyword', this.keyword);
    }
  }

  async addPeople(type: string, keyword: string) {
    if (this.profile == null) {
      return;
    }

    if (type === 'people') {
      this.store.dispatch(new SearchProfiles(keyword));
    } else {
      return;
    }

  }

  load() {
    const page = document.getElementById('home-page');

    this.store.dispatch(new SubscribeToProfile());
    this.profile$.subscribe((profile) => {
      if (profile) {
        // console.log(profile);
        this.profile = profile;

        this.store.dispatch(new GetUserSettings(this.profile._id));
        this.settings$.subscribe((settings) => {
          if (settings) {
            this.settings = settings;

            this.document.body.setAttribute(
              'color-theme',
              this.settings.themes.themeColor
            );

            this.themeName = this.settings.themes.themeColor;

            // console.log(this.themeName);

            const defaultLogo = document.getElementById('logo-default');
            const redLogo = document.getElementById('logo-red');
            const blueLogo = document.getElementById('logo-blue');
            const greenLogo = document.getElementById('logo-green');
            const orangeLogo = document.getElementById('logo-orange');

            if (defaultLogo && redLogo && blueLogo && greenLogo && orangeLogo) {
              // console.log(this.themeName);
              if (
                this.themeName == 'light-red' ||
                this.themeName == 'dark-red'
              ) {
                redLogo.classList.remove('visible');
                defaultLogo.classList.add('visible');
                blueLogo.classList.add('visible');
                greenLogo.classList.add('visible');
                orangeLogo.classList.add('visible');
              } else if (
                this.themeName == 'light-blue' ||
                this.themeName == 'dark-blue'
              ) {
                blueLogo.classList.remove('visible');
                defaultLogo.classList.add('visible');
                redLogo.classList.add('visible');
                greenLogo.classList.add('visible');
                orangeLogo.classList.add('visible');
              } else if (
                this.themeName == 'light-green' ||
                this.themeName == 'dark-green'
              ) {
                greenLogo.classList.remove('visible');
                defaultLogo.classList.add('visible');
                redLogo.classList.add('visible');
                blueLogo.classList.add('visible');
                orangeLogo.classList.add('visible');
              } else if (
                this.themeName == 'light-orange' ||
                this.themeName == 'dark-orange'
              ) {
                orangeLogo.classList.remove('visible');
                defaultLogo.classList.add('visible');
                redLogo.classList.add('visible');
                blueLogo.classList.add('visible');
                greenLogo.classList.add('visible');
              } else {
                defaultLogo.classList.remove('visible');
                redLogo.classList.add('visible');
                blueLogo.classList.add('visible');
                greenLogo.classList.add('visible');
                orangeLogo.classList.add('visible');
              }
            }

            if (page) {
              page.style.backgroundImage = `url(${this.settings.themes.themeImage})`;
              // page.style.backgroundImage = "blue";
            }
          }
        });
      }
    });
  }

  goToProfile() {
    this.routerClick();
    this.router.navigate(['/home/profile']);
  }

  goHome() {
    this.store.dispatch(new SubscribeToProfile())
    this.routerClick();
    this.router.navigate(['/home/feed']);
    this.menuCtrl.close('first-menu');
  }

  GoToComments() {
    this.routerClick();
    this.router.navigate(['app-comments-feature']);
  }

  goToExplore() {
    this.routerClick();
    // this.router.navigate(['/home/explore']);
    this.router.navigate(['/home/search-explore']);
  }

  goToChat() {
    this.router.navigate(['/home/messages']);
  }

  goToSettings() {
    this.routerClick();
    this.router.navigate(['/home/settings']);
    this.menuCtrl.close('first-menu');
  }

  goToThemes() {
    this.routerClick();
    this.router.navigate(['/home/themes']);
    this.menuCtrl.close('first-menu');
  }

  goToHelp() {
    this.routerClick();
    this.router.navigate(['/home/help']);
    this.menuCtrl.close('first-menu');
  }

  goToEvent() {
    this.routerClick();
    this.router.navigate(['/home/event']);
    this.menuCtrl.close('first-menu');
  }

  clearNotification(id: string) {
    if (this.profile == null) {
      return;
    }

    this.store.dispatch(new ClearNotification(this.profile._id, id));
  }

  clearAllNotifications() {
    if (this.profile == null) {
      return;
    }

    this.store.dispatch(new ClearAllNotifications(this.profile._id));
  }

  logout() {
    localStorage.removeItem('UserID');
    this.clearAllCookies()
    this.router.navigate(['/']);
  }

  showNotifications = false;
  showSearch = false;

  toggleNotifications() {
    if (this.profile == null) {
      // console.log('you are not logged in?');
      return;
    }

    this.showSearch = false;
    this.showNotifications = !this.showNotifications;

    if (this.showNotifications) {
      this.store.dispatch(new GetNotifications(this.profile._id));
      this.notifications$.subscribe((notifications) => {
        if (notifications) {
          // console.log(notifications);
          this.notifications = notifications;
        }
      });
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

  GoToProfile(username: string) {
    this.showSearch = false;
    if (this.profile?.username !== username) {
      this.router.navigate(['home/user-profile/' + username]);
    } else {
      this.router.navigate(['home/profile']);
    }
  }

  clearAllCookies() {
    const cookies = document.cookie.split(';');
    
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf('=');
      const cookieName = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      
      // Set the expiration date to a past date
      const pastDate = new Date(0);
      const formattedPastDate = pastDate.toUTCString();
      
      // Clear the cookie
      document.cookie = `${cookieName}=; expires=${formattedPastDate}; path=/`;
    }
  }
}
