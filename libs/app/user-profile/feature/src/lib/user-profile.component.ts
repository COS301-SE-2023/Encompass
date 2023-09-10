import { Component, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PostDto } from '@encompass/api/post/data-access';
import { ProfileDto } from '@encompass/api/profile/data-access';
import { ProfileState } from '@encompass/app/profile/data-access';
import {
  AddFollowing,
  RemoveFollowing,
  SubscribeToProfile,
} from '@encompass/app/profile/util';
import {
  UserProfileApi,
  UserProfileState,
} from '@encompass/app/user-profile/data-access';
import {
  GetUserProfile,
  GetUserProfilePosts,
  GetUserSettings,
  UpdateUserPost,
} from '@encompass/app/user-profile/util';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { UpdatePostRequest } from '@encompass/api/post/data-access';
import { SendNotification } from '@encompass/app/home-page/util';
import { AddNotificationRequest } from '@encompass/api/notifications/data-access';
import { SettingsDto } from '@encompass/api/settings/data-access';
import { SettingsState } from '@encompass/app/settings/data-access';
import { APP_BASE_HREF, DOCUMENT } from '@angular/common';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfile {
  @Select(UserProfileState.userProfile)
  userProfile$!: Observable<ProfileDto | null>;
  @Select(ProfileState.profile) profile$!: Observable<ProfileDto | null>;
  @Select(UserProfileState.userProfilePosts) userPosts$!: Observable<
    PostDto[] | null
  >;
  @Select(UserProfileState.userProfileSettings)
  profileSettings$!: Observable<SettingsDto | null>;
  @Select(SettingsState.settings) settings$!: Observable<SettingsDto | null>;

  private unsubscribe$: Subject<void> = new Subject<void>();

  userProfile!: ProfileDto | null;
  profile!: ProfileDto | null;
  userPosts: PostDto[] = [];
  userProfileSettings!: SettingsDto | null;
  seePosts = true;
  seeComments = false;
  shares: number[] = [];
  sharing: boolean[] = [];
  likes: number[] = [];
  likedComments: boolean[] = [];
  datesAdded: string[] = [];
  comments: number[] = [];
  reports: boolean[] = [];
  posts!: PostDto[] | null;
  settings!: SettingsDto | null;

  isPostsFetched = false;
  ViewCommunities = false;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private store: Store,
    private router: Router,
    private route: ActivatedRoute,
    private userProfileState: UserProfileState,
    private userProfileApi: UserProfileApi,
    private toastController: ToastController
  ) {
    const username = this.route.snapshot.paramMap.get('username');

    if (username == null) {
      return;
    }
    // this.store.dispatch(new GetUserProfile(username))
    // this.userProfile$.subscribe((userProfile) =>{
    this.userProfileState.getUserProfile(username).then((userProfile) => {
      if (userProfile) {
        this.userProfile = userProfile;
        console.log('Userprofile', this.userProfile);
        // if(!this.isPostsFetched){
        this.isPostsFetched = true;
        this.store.dispatch(new GetUserProfilePosts(this.userProfile.username));
        this.userPosts$
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe((userPosts) => {
            if (userPosts) {
              // const temp = userPosts;
              // this.userPosts = [];
              // temp.forEach((post) => {
              //   if(post.isPrivate){
              //     if(this.profile?.communities.includes(post.community)){
              //       this.userPosts.push(post);
              //     }
              //   }

              //   else{
              //     this.userPosts.push(post);
              //   }
              // })
              this.userPosts = userPosts;
              console.log(this.userPosts);
              for (let i = 0; i < userPosts.length; i++) {
                this.likedComments.push(false);
                this.sharing.push(false);

                if (
                  userPosts[i].dateAdded != null &&
                  userPosts[i].comments != null &&
                  userPosts[i].shares != null
                ) {
                  this.datesAdded.push(userPosts[i].dateAdded);
                  this.comments.push(userPosts[i].comments);
                  this.shares.push(userPosts[i].shares);
                }

                if (userPosts != null && userPosts[i].likes != null) {
                  this.likes.push(userPosts[i].likes?.length);
                  if (userPosts[i].likes?.includes(userPosts[i].username)) {
                    this.likedComments[i] = true;
                  }
                }
              }
            } else {
              console.log('USER PROFILE IS', userProfile);
            }
          });
        // }
        this.store.dispatch(new GetUserSettings(this.userProfile._id));
        this.profileSettings$.subscribe((profileSettings) => {
          if (profileSettings) {
            this.userProfileSettings = profileSettings;
            console.log(this.userProfileSettings);
          }
        });
      }
    });

    // this.store.dispatch(new SubscribeToProfile())
    // this.profile$.subscribe((profile) => {
    //   if(profile){
    //     this.profile = profile
    //     console.log(this.profile)

    //     if(this.profile.username === username){
    //       this.router.navigate(['home/profile']);
    //     }
    //   }
    // })

    this.load();
  }

  load() {
    const page = document.getElementById('home-page');

    this.store.dispatch(new SubscribeToProfile());
    // this.store.dispatch(new SubscribeToProfile())
    this.profile$.subscribe((profile) => {
      if (profile) {
        console.log('Profile CALLED');
        console.log(profile);
        this.profile = profile;
        // this.addPosts("recommended");
        // this.newChange();

        this.store.dispatch(new GetUserSettings(this.profile._id));

        this.settings$.subscribe((settings) => {
          if (settings) {
            this.settings = settings;

            this.document.body.setAttribute(
              'color-theme',
              this.settings.themes.themeColor
            );
            if (this.settings.themes.themeColor.startsWith('dark')) {
              const icons = document.getElementById('genreicons');

              if (icons) {
                // icons.style.filter = 'invert(1)';
              }
            }

            if (page) {
              console.log('testing the feed page');
              console.log('hello ' + this.settings.themes.themeImage);
              page.style.backgroundImage = `url(${this.settings.themes.themeImage})`;
            } else {
              console.log('page is null');
            }
          }
        });
      }
    });
  }

  ngOnDestroy() {
    // Unsubscribe to avoid memory leaks
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  async Share(n: number, post: PostDto) {
    if (this.userProfile?.username == null) {
      return;
    }
    this.shares[n]++;
    for (let i = 0; i < this.sharing.length; i++) {
      this.sharing[i] = false;
    }
    this.sharing[n] = true;

    const obj = location.origin;
    if (obj == undefined) {
      return;
    }

    const data: UpdatePostRequest = {
      title: post.title,
      text: post.text,
      imageUrl: post.imageUrl,
      communityImageUrl: post.communityImageUrl,
      categories: post.categories,
      likes: post.likes,
      spoiler: post.spoiler,
      ageRestricted: post.ageRestricted,
      shares: post.shares + 1,
      comments: post.comments,
      reported: post.reported,
    };

    this.store.dispatch(
      new UpdateUserPost(post._id, data, this.userProfile.username)
    );
    this.userProfileApi.addCoins(post.username, 1);

    const link: string = obj + '/home/app-comments-feature/' + post._id;

    await navigator.clipboard.writeText(link);

    const toast = await this.toastController.create({
      message: 'Url Copied to Clipboard',
      duration: 2000,
      color: 'success'
    })

    await toast.present();
  }

  async shareProfile() {
    const obj = location.origin;
    if (obj == undefined) {
      return;
    }

    const link: string =
      obj + '/home/user-profile/' + this.userProfile?.username;

    await navigator.clipboard.writeText(link);

    const toast = await this.toastController.create({
      message: 'Url Copied to Clipboard',
      duration: 2000,
      color: 'success'
    })

    await toast.present();
  }

  postChange() {
    const PostBtn = document.getElementById('PostBtn');
    const CommentsBtn = document.getElementById('CommentsBtn');
    const eventBtn = document.getElementById('eventBtn');

    if (PostBtn && CommentsBtn && eventBtn) {
      PostBtn.classList.add('active-button');
      CommentsBtn.classList.remove('active-button');
      eventBtn.classList.remove('active-button');
    }

    this.seePosts = true;
    this.seeComments = false;
  }

  commChange() {
    const PostBtn = document.getElementById('PostBtn');
    const CommentsBtn = document.getElementById('CommentsBtn');
    const eventBtn = document.getElementById('eventBtn');

    if (PostBtn && CommentsBtn && eventBtn) {
      PostBtn.classList.remove('active-button');
      CommentsBtn.classList.add('active-button');
      eventBtn.classList.remove('active-button');
    }

    this.seePosts = false;
    this.seeComments = true;
  }

  eventChange() {
    const PostBtn = document.getElementById('PostBtn');
    const CommentsBtn = document.getElementById('CommentsBtn');
    const eventBtn = document.getElementById('eventBtn');

    if (PostBtn && CommentsBtn && eventBtn) {
      PostBtn.classList.remove('active-button');
      CommentsBtn.classList.remove('active-button');
      eventBtn.classList.add('active-button');
    }
  }

  GoToComments(postId: string) {
    this.router.navigate(['home/app-comments-feature/' + postId]);
  }
  presentingElement: any;
  presentingElement2: any;

  ngOnInit() {
    this.presentingElement = document.querySelector('.ion-page');
    this.presentingElement2 = document.querySelector('.ion-page');
    this.updateMobileView();
    window.addEventListener('resize', this.updateMobileView.bind(this));
  }
  Follow() {
    if (this.profile == null || this.userProfile == null) {
      return;
    }

    this.userProfileState
      .addFollower(this.userProfile.username, this.profile.username)
      .then((userProfile) => {
        if (userProfile) {
          this.userProfile = userProfile;
          console.log(this.userProfile);
        }
      });

    this.store.dispatch(
      new AddFollowing(this.profile.username, this.userProfile.username)
    );

    const notification: AddNotificationRequest = {
      sentBy: this.profile.name + ' ' + this.profile.lastName,
      picture: this.profile.profileImage,
      title: 'Started Following You',
      description: '',
    };

    if (this.userProfileSettings?.notifications.follows !== false) {
      this.store.dispatch(
        new SendNotification(this.userProfile._id, notification)
      );
    }
  }

  Unfollow() {
    if (this.profile == null || this.userProfile == null) {
      return;
    }

    this.userProfileState
      .removeFollower(this.userProfile.username, this.profile.username)
      .then((userProfile) => {
        if (userProfile) {
          this.userProfile = userProfile;
          console.log(this.userProfile);
        }
      });

    this.store.dispatch(
      new RemoveFollowing(this.profile.username, this.userProfile.username)
    );
  }

  GoToCommunity(communityName: string) {
    this.router.navigate(['home/community-profile/' + communityName]);
  }

  GoToProfile(username: string) {
    if (this.profile?.username !== username) {
      this.router.navigate(['home/user-profile/' + username]);
    } else {
      this.router.navigate(['home/profile']);
    }
  }

  Report(n: number) {
    if (this.posts?.length == null) {
      return;
    }

    if (this.reports[n] == true) {
      this.reports[n] = false;
      return;
    } else {
      for (let k = 0; k < this.reports.length; k++) {
        this.reports[k] = false;
      }
      this.reports[n] = true;
    }
  }

  ReportPost(n: number, post: PostDto) {
    if (this.userProfile == null) {
      return;
    }

    if (this.posts?.length == null) {
      return;
    }

    this.reports[n] = false;

    const data: UpdatePostRequest = {
      title: post.title,
      text: post.text,
      imageUrl: post.imageUrl,
      communityImageUrl: post.communityImageUrl,
      categories: post.categories,
      likes: post.likes,
      spoiler: post.spoiler,
      ageRestricted: post.ageRestricted,
      shares: post.shares,
      comments: post.comments,
      reported: true,
    };

    this.store.dispatch(
      new UpdateUserPost(post._id, data, this.userProfile.username)
    );
    this.userProfileApi.removeCoins(post.username, 1);
  }

  Like(n: number, post: PostDto) {
    if (this.userProfile == null) {
      return;
    }

    let likesArr: string[];

    console.log(this.profile?.username + ' LIKED POST');
    const emptyArray: string[] = [];

    if (this.profile?.username == null) {
      return;
    }

    if (post.likes == emptyArray) {
      likesArr = [this.profile?.username];
    } else {
      likesArr = [...post.likes, this.profile?.username];
    }

    const data: UpdatePostRequest = {
      title: post.title,
      text: post.text,
      imageUrl: post.imageUrl,
      communityImageUrl: post.communityImageUrl,
      categories: post.categories,
      likes: likesArr,
      spoiler: post.spoiler,
      ageRestricted: post.ageRestricted,
      shares: post.shares,
      comments: post.comments,
      reported: post.reported,
    };

    this.store.dispatch(
      new UpdateUserPost(post._id, data, this.userProfile.username)
    );
    this.userProfileApi.addCoins(post.username, 1);
  }

  Dislike(n: number, post: PostDto) {
    if (this.userProfile == null) {
      return;
    }

    this.likedComments[n] = false;
    this.likes[n]--;

    let likesArr = [...post.likes];
    likesArr = likesArr.filter((like) => like !== this.profile?.username);

    const data: UpdatePostRequest = {
      title: post.title,
      text: post.text,
      imageUrl: post.imageUrl,
      communityImageUrl: post.communityImageUrl,
      categories: post.categories,
      likes: likesArr,
      spoiler: post.spoiler,
      ageRestricted: post.ageRestricted,
      shares: post.shares,
      comments: post.comments,
      reported: post.reported,
    };

    this.store.dispatch(
      new UpdateUserPost(post._id, data, this.userProfile.username)
    );
    this.userProfileApi.removeCoins(post.username, 1);
  }

  OpenView() {
    this.ViewCommunities = !this.ViewCommunities;
  }

  // loadFollowers(){
  //   if(this.profile == null){
  //     return;
  //   }
  //   console.log("here");
  //   this.store.dispatch(new GetFollowers(this.profile.followers));
  //   this.otherUsers$.subscribe((users) => {
  //     if(users){
  //       console.log(users);
  //       this.otherUsers = users;
  //     }
  //   })
  // }

  // loadFollowing(){
  //   if(this.profile == null){
  //     return;
  //   }

  //       console.log("here as well");

  //   this.store.dispatch(new GetFollowing(this.profile.following));
  //   this.otherUsers$.subscribe((users) => {
  //     if(users){
  //       this.otherUsers = users;
  //     }
  //   })
  // }

  // async goToProfile(username : string | undefined){
  //   console.log("Route is " + username);
  //   await this.modalController.dismiss();
  //   this.router.navigate(['home/user-profile/' + username]);
  // }

  mobileview = false;

  updateMobileView() {
    this.mobileview = window.innerWidth <= 992;
  }

  isModalOpen = false;

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  isModal2Open = false;

  setOpen2(isOpen: boolean) {
    this.isModal2Open = isOpen;
  }
}
